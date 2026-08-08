import { describe, expect, it } from 'vitest';
import { DEFAULT_SITE_URL, getCanonicalUrl, getSiteUrl } from './routes.js';
import { buildPageSeo } from './seo.js';
import { auditSiteUrl, PRODUCTION_SITE_URL } from './site.js';

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
    expect(seo.twitterCard).toBe('summary_large_image');
    expect(seo.robots).toBe('index, follow');
    expect(seo.themeColor).toBeTruthy();
    expect(seo.author).toBe('Ulises Jeremias');
    expect(seo.locale).toBe('en_US');
    expect(seo.jsonLd.length).toBeGreaterThanOrEqual(2);
    expect(seo.jsonLd.some((block) => block['@type'] === 'WebSite')).toBe(true);
    expect(seo.jsonLd.some((block) => block['@type'] === 'Person')).toBe(true);
  });
});
