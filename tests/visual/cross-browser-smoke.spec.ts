import { expect, test } from '@playwright/test';

const routes = [
  '/',
  '/about/',
  '/agentic/',
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
];

const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 1000 },
];

for (const route of routes) {
  test(`${route} renders at mobile and desktop sizes`, async ({ page }) => {
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      const response = await page.goto(route, { waitUntil: 'networkidle' });

      expect(response?.status(), `${route} ${viewport.name} response`).toBeLessThan(400);
      await expect(page.locator('main')).toBeVisible();

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `${route} ${viewport.name} horizontal overflow`).toBeLessThanOrEqual(1);
    }
  });
}
