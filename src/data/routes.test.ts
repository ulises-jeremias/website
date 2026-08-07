import { describe, expect, it } from 'vitest';
import {
  getCanonicalUrl,
  getCanonicalUrlForSlug,
  getNavLabel,
  getNavRoutes,
  getRouteById,
  getRouteByPath,
  isExternalHref,
  routeMetaSchema,
  routes,
} from './routes.js';

describe('routes', () => {
  it('all routes validate against Zod schema', () => {
    for (const route of routes) {
      const result = routeMetaSchema.safeParse(route);
      expect(result.success, `route ${route.id} should validate: ${result.success ? '' : result.error.message}`).toBe(
        true,
      );
    }
  });

  it('covers all B-01 preferred paths', () => {
    const paths = routes.map((r) => r.path);
    const expected = [
      '/',
      '/dotfiles',
      '/agentic-workstation',
      '/agent-toolkit',
      '/v',
      '/create-awesome',
      '/community',
      '/blog',
      '/blog/[slug]',
      '/projects',
      '/open-source',
    ];
    for (const p of expected) {
      expect(paths).toContain(p);
    }
  });

  it('getRouteByPath finds static and dynamic routes', () => {
    expect(getRouteByPath('/')?.id).toBe('home');
    expect(getRouteByPath('/blog')?.id).toBe('blog');
    expect(getRouteByPath('/blog/[slug]')?.id).toBe('blog-post');
    expect(getRouteByPath('/not-found')).toBeUndefined();
  });

  it('getRouteById finds by id', () => {
    expect(getRouteById('toolkit')?.path).toBe('/agent-toolkit');
    expect(getRouteById('unknown')).toBeUndefined();
  });

  it('getNavRoutes returns sorted primary nav', () => {
    const nav = getNavRoutes();
    expect(nav.length).toBeGreaterThanOrEqual(9);
    for (let i = 1; i < nav.length; i++) {
      expect((nav[i].navOrder as number) >= (nav[i - 1].navOrder as number)).toBe(true);
    }
    expect(nav[0].path).toBe('/');
  });

  it('getNavLabel falls back to title', () => {
    const withLabel = routes.find((r) => r.navLabel)!;
    expect(getNavLabel(withLabel)).toBe(withLabel.navLabel);
    const dynamic = getRouteById('blog-post')!;
    expect(getNavLabel(dynamic)).toBe(dynamic.title);
  });

  it('getCanonicalUrl builds absolute URL', () => {
    expect(getCanonicalUrl('/blog', 'https://example.com')).toBe('https://example.com/blog');
    expect(getCanonicalUrl('blog', 'https://example.com/')).toBe('https://example.com/blog');
    expect(getCanonicalUrl('/', 'https://example.com')).toBe('https://example.com/');
    // default site when no explicit url
    expect(getCanonicalUrl('/projects')).toContain('/projects');
  });

  it('getCanonicalUrlForSlug handles slugs', () => {
    expect(getCanonicalUrlForSlug('my-post', 'https://example.com')).toBe('https://example.com/blog/my-post');
    expect(getCanonicalUrlForSlug('/my-post/', 'https://example.com')).toBe('https://example.com/blog/my-post');
  });

  it('isExternalHref detects external urls', () => {
    expect(isExternalHref('https://github.com/ulises-jeremias')).toBe(true);
    expect(isExternalHref('http://example.com')).toBe(true);
    expect(isExternalHref('//example.com/path')).toBe(true);
    expect(isExternalHref('/blog')).toBe(false);
    expect(isExternalHref('/projects#anchor')).toBe(false);
    expect(isExternalHref('mailto:a@b.com')).toBe(false);
  });
});
