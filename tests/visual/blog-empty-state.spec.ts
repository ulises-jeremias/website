import { expect, test } from '@playwright/test';

test.describe('Blog empty state', () => {
  for (const width of [320, 390]) {
    test(`keeps publication routes usable at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto('/blog/');

      await expect(page.locator('.blog-page__contract')).toContainText('desk open');
      await expect(page.locator('.blog-empty')).toBeVisible();
      await expect(page.locator('.blog-empty__routes li')).toHaveCount(3);
      await expect(page.locator('.blog-empty__routes')).toContainText('Read the current work');
      await expect(page.locator('.blog-empty__routes a')).toHaveCount(3);

      for (const link of await page.locator('.blog-empty__routes a').all()) {
        await expect(link).toBeVisible();
        await expect(link).toHaveCSS('min-block-size', '44px');
      }
    });
  }
});
