import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULT_SITE_URL, getCanonicalUrl, getSiteUrl } from './routes.js';
import { buildPageSeo } from './seo.js';
import { auditSiteUrl, PRODUCTION_SITE_URL } from './site.js';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

describe('site / SEO foundations', () => {
  it('defaults canonical host to www.ulises-jeremias.dev', () => {
    expect(DEFAULT_SITE_URL).toBe(PRODUCTION_SITE_URL);
    expect(getSiteUrl()).toBe(PRODUCTION_SITE_URL);
    expect(getCanonicalUrl('/projects')).toBe(`${PRODUCTION_SITE_URL}/projects`);
  });

  it('warns when production builds use a wrong site host', () => {
    const warnings = auditSiteUrl('https://ulises-jeremias.github.io', { production: true });
    expect(warnings.some((w) => w.message.includes('www.ulises-jeremias.dev'))).toBe(true);
  });

  it('builds page SEO with OG, Twitter, robots, theme, author, locale, and JSON-LD', () => {
    const seo = buildPageSeo({
      path: '/',
      title: 'Ulises Jeremias — Digital Nest',
      description: 'Personal workshop',
    });
    expect(seo.canonical).toBe(`${PRODUCTION_SITE_URL}/`);
    expect(seo.ogImage).toContain('http');
    expect(seo.ogImageAlt).toBeTruthy();
    expect(seo.ogImageWidth).toBe(1200);
    expect(seo.ogImageHeight).toBe(630);
    expect(seo.twitterCard).toBe('summary_large_image');
    expect(seo.robots).toBe('index, follow');
    expect(seo.themeColor).toBeTruthy();
    expect(seo.author).toBe('Ulises Jeremias');
    expect(seo.locale).toBe('en_US');
    expect(seo.jsonLd.length).toBeGreaterThanOrEqual(2);
    expect(seo.jsonLd.some((block) => block['@type'] === 'WebSite')).toBe(true);
    expect(seo.jsonLd.some((block) => block['@type'] === 'Person')).toBe(true);
  });

  it('references complete conventional and manifest icon sets', () => {
    const head = readFileSync(resolve(projectRoot, 'src/components/BaseHead.astro'), 'utf8');
    const manifest = JSON.parse(readFileSync(resolve(projectRoot, 'public/site.webmanifest'), 'utf8')) as {
      icons: Array<{ src: string; sizes: string; purpose: string }>;
    };

    for (const path of ['/favicon.svg', '/favicon.ico', '/favicon-32x32.png', '/icons/apple-touch-icon.png']) {
      expect(head).toContain(path);
      expect(existsSync(resolve(projectRoot, 'public', path.slice(1))), path).toBe(true);
    }

    expect(manifest.icons.map((icon) => `${icon.sizes}:${icon.purpose}`)).toEqual([
      'any:any',
      '192x192:any',
      '512x512:any',
      '192x192:maskable',
      '512x512:maskable',
    ]);
    for (const icon of manifest.icons) {
      expect(existsSync(resolve(projectRoot, 'public', icon.src.slice(1))), icon.src).toBe(true);
    }
  });
});
