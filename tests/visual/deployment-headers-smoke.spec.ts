import { expect, test } from '@playwright/test';

const routes = ['/', '/404.html'] as const;
const assets = ['/fonts/jetbrains-mono-latin-400-normal.woff2', '/assets/nest/logo-nest-sm.webp'] as const;

const expectedSecurityHeaders = {
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
} as const;

test.describe('deployed security headers', () => {
  for (const route of routes) {
    test(`${route} returns the security header contract`, async ({ request }) => {
      const response = await request.get(route);
      expect(response.status(), `${route} HTTP status`).toBeGreaterThanOrEqual(200);
      expect(response.status(), `${route} HTTP status`).toBeLessThan(300);

      const headers = response.headers();
      for (const [name, value] of Object.entries(expectedSecurityHeaders)) {
        expect(headers[name], `${route} ${name}`).toBe(value);
      }
    });
  }
});

test.describe('deployed asset caching', () => {
  for (const asset of assets) {
    test(`${asset} has a bounded browser cache policy`, async ({ request }) => {
      const response = await request.get(asset);
      expect(response.status(), `${asset} HTTP status`).toBeGreaterThanOrEqual(200);
      expect(response.status(), `${asset} HTTP status`).toBeLessThan(300);
      expect(response.headers()['cache-control'], `${asset} Cache-Control`).toBe('public, max-age=86400');
    });
  }
});
