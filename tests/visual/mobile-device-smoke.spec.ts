import { expect, test } from '@playwright/test';

const routes = [
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
  '/agentic-harness/',
  '/404.html',
] as const;

test.describe('mobile device smoke', () => {
  for (const route of routes) {
    test(`${route} renders on a mobile device profile`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: 'networkidle' });
      expect(response?.status(), `${route} HTTP status`).toBeGreaterThanOrEqual(200);
      expect(response?.status(), `${route} HTTP status`).toBeLessThan(300);

      await expect(page.locator('main')).toBeVisible();

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `${route} horizontal overflow`).toBeLessThanOrEqual(1);
    });

    test(`${route} body fits the mobile viewport`, async ({ page }) => {
      await page.goto(route, { waitUntil: 'networkidle' });

      const viewportWidth = page.viewportSize()?.width ?? 390;
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidth, `${route} body wider than viewport`).toBeLessThanOrEqual(viewportWidth + 1);
    });
  }
});
