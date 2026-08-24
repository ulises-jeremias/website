import { expect, test } from '@playwright/test';

const PRIMARY_ROUTES = [
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

test.describe('robots.txt and sitemap', () => {
  test('robots.txt serves correctly', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain('User-agent: *');
    expect(body).toContain('Sitemap:');
    expect(body).toContain('sitemap.xml');
  });

  test('sitemap.xml is valid XML with urlset', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain('<urlset');
    expect(body).toContain('<url>');
    expect(body).toContain('<loc>');
  });

  test('rss.xml is valid RSS', async ({ request }) => {
    const response = await request.get('/rss.xml');
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain('<rss');
    expect(body).toContain('<channel>');
  });

  test('site.webmanifest is valid JSON', async ({ request }) => {
    const response = await request.get('/site.webmanifest');
    expect(response.status()).toBe(200);
    const contentType = response.headers()['content-type'] ?? '';
    expect(contentType).toContain('json');
    const manifest = (await response.json()) as Record<string, unknown>;
    expect(typeof manifest.name).toBe('string');
    expect(typeof manifest.short_name).toBe('string');
  });
});

test.describe('page SEO meta tags', () => {
  for (const route of PRIMARY_ROUTES) {
    test(`${route} has title, OG tags, and canonical`, async ({ page }) => {
      await page.goto(route);

      // <title> must be non-empty
      const title = await page.title();
      expect(title.length, `${route} <title> is empty`).toBeGreaterThan(0);

      // og:title
      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
      expect(ogTitle?.length ?? 0, `${route} og:title is missing or empty`).toBeGreaterThan(0);

      // og:image — must be an absolute URL starting with https
      const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
      expect(ogImage, `${route} og:image is missing`).toBeTruthy();
      expect(ogImage, `${route} og:image is not absolute`).toMatch(/^https?:\/\//);

      // canonical — must be an absolute URL
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical, `${route} canonical is missing`).toBeTruthy();
      expect(canonical, `${route} canonical is not absolute`).toMatch(/^https?:\/\//);
    });
  }
});
