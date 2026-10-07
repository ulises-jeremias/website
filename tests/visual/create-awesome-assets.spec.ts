import { expect, test } from '@playwright/test';

test('every Create Awesome family illustration loads as a valid image', async ({ page }) => {
  await page.goto('/create-awesome');

  const illustrations = page.locator('.ca-variant__hero');
  await expect(illustrations).toHaveCount(4);

  for (const illustration of await illustrations.all()) {
    await illustration.scrollIntoViewIfNeeded();
    await expect
      .poll(() => illustration.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0))
      .toBe(true);
  }
});
