import { expect, test } from '@playwright/test';

test('serves production output without Astro development artifacts', async ({ page }) => {
  const response = await page.goto('/');

  expect(response?.ok()).toBe(true);
  await page.waitForLoadState('networkidle');

  await expect(page.locator('script[src*="/@vite/client"]')).toHaveCount(0);
  await expect(page.locator('astro-dev-toolbar')).toHaveCount(0);
  await expect(page.locator('[data-astro-dev-toolbar]')).toHaveCount(0);
  expect(await page.content()).not.toContain('astro-dev-toolbar');
});
