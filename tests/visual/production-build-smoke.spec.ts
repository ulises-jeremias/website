import { expect, type Page, test } from '@playwright/test';

const PRODUCTION_ORIGIN = 'https://www.ulises-jeremias.dev';

const INDEXABLE_STATIC_ROUTES = [
  '/',
  '/dotfiles/',
  '/agentic-workstation/',
  '/agent-toolkit/',
  '/v/',
  '/create-awesome/',
  '/community/',
  '/blog/',
  '/projects/',
  '/open-source/',
] as const;

const REPRESENTATIVE_ASSETS = [
  '/favicon.svg',
  '/fonts/jetbrains-mono-latin-400-normal.woff2',
  '/assets/nest/logo-nest-sm.webp',
] as const;

async function parseXml(page: Page, source: string) {
  return page.evaluate((xml) => {
    const document = new DOMParser().parseFromString(xml, 'application/xml');
    return {
      root: document.documentElement?.localName ?? null,
      parseError: document.querySelector('parser' + 'error')?.textContent ?? null,
      firstLoc: document.querySelector('loc')?.textContent?.trim() ?? null,
      hasChannel: document.querySelector('channel') !== null,
      hasTitle: document.querySelector('channel > title') !== null,
    };
  }, source);
}

test.describe('static build assets', () => {
  test('robots.txt serves correctly', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain('User-agent: *');
    expect(body).toContain('Sitemap:');
    expect(body).toContain('sitemap.xml');
  });

  test('sitemap.xml is valid XML with urlset', async ({ page, request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);
    const parsed = await parseXml(page, await response.text());
    expect(parsed.root).toBe('urlset');
    expect(parsed.parseError).toBeNull();
    expect(parsed.firstLoc).toBeTruthy();
    const firstLoc = new URL(parsed.firstLoc!);
    expect(firstLoc.origin).toBe(PRODUCTION_ORIGIN);
    expect(firstLoc.protocol).toBe('https:');
  });

  test('rss.xml is valid RSS', async ({ page, request }) => {
    const response = await request.get('/rss.xml');
    expect(response.status()).toBe(200);
    const parsed = await parseXml(page, await response.text());
    expect(parsed.root).toBe('rss');
    expect(parsed.parseError).toBeNull();
    expect(parsed.hasChannel).toBe(true);
    expect(parsed.hasTitle).toBe(true);
  });

  test('site.webmanifest is valid JSON', async ({ request }) => {
    const response = await request.get('/site.webmanifest');
    expect(response.status()).toBe(200);
    const contentType = response.headers()['content-type'] ?? '';
    expect(contentType).toContain('json');
    const manifest = (await response.json()) as Record<string, unknown>;
    expect(typeof manifest.name).toBe('string');
    expect(String(manifest.name).trim().length).toBeGreaterThan(0);
    expect(typeof manifest.short_name).toBe('string');
    expect(String(manifest.short_name).trim().length).toBeGreaterThan(0);
  });

  for (const asset of REPRESENTATIVE_ASSETS) {
    test(`${asset} serves from the production build`, async ({ request }) => {
      const response = await request.get(asset);
      expect(response.status(), `${asset} HTTP status`).toBeGreaterThanOrEqual(200);
      expect(response.status(), `${asset} HTTP status`).toBeLessThan(300);
      expect((response.headers()['content-type'] ?? '').length, `${asset} content type`).toBeGreaterThan(0);
    });
  }
});

test.describe('indexable static page metadata', () => {
  for (const route of INDEXABLE_STATIC_ROUTES) {
    test(`${route} has title, OG tags, and canonical`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status(), `${route} HTTP status`).toBeGreaterThanOrEqual(200);
      expect(response?.status(), `${route} HTTP status`).toBeLessThan(300);

      const title = await page.title();
      expect(title.trim().length, `${route} <title> is empty`).toBeGreaterThan(0);

      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
      expect(ogTitle?.trim().length ?? 0, `${route} og:title is missing or empty`).toBeGreaterThan(0);

      const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
      expect(ogImage, `${route} og:image is missing`).toBeTruthy();
      const ogImageUrl = new URL(ogImage!);
      expect(ogImageUrl.origin, `${route} og:image host is incorrect`).toBe(PRODUCTION_ORIGIN);
      expect(ogImageUrl.protocol, `${route} og:image is not HTTPS`).toBe('https:');

      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical, `${route} canonical is missing`).toBeTruthy();
      const canonicalUrl = new URL(canonical!);
      expect(canonicalUrl.origin, `${route} canonical host is incorrect`).toBe(PRODUCTION_ORIGIN);
      expect(canonicalUrl.protocol, `${route} canonical is not HTTPS`).toBe('https:');
    });
  }
});
