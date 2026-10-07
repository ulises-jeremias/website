import { expect, test } from '@playwright/test';

test.describe('Blog empty state', () => {
  test('gives the field-notes desk a readable editorial share on desktop', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('/blog/');

    const desk = page.locator('.empty-desk');
    const deskBounds = await desk.boundingBox();
    expect(deskBounds?.width).toBeGreaterThanOrEqual(400);
    await expect(desk).toHaveAccessibleName(/night desk with a terminal waiting for the first entry/);
    await expect(desk.locator('.ed-terminal__cmd')).toHaveText('$ notes new --topic');
    await expect(desk.locator('.ed-pad__label')).toHaveText('next field note');
    await expect(desk).toHaveScreenshot('blog-empty-desk-desktop.png', { animations: 'disabled' });
  });

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
