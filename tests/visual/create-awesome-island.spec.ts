import { expect, test } from '@playwright/test';

const asset = 'island-assembly-workshop';

test('Create Awesome island art stays consistent across the homepage and Work map', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto('/');

  const atlasWorld = page.locator('.atlas-world[data-world-id="create-awesome"]');
  const atlasSource = atlasWorld.locator('source[type="image/webp"]');
  await expect(atlasSource).toHaveAttribute('srcset', new RegExp(`${asset}-sm\\.webp`));
  await expect(atlasWorld.locator('img')).toHaveAttribute('src', `/assets/${asset}.png`);
  await atlasWorld.locator('img').evaluate((image: HTMLImageElement) => image.decode());
  await expect(atlasWorld).toHaveScreenshot('create-awesome-island-atlas-desktop.png');

  const featuredCard = page.locator('[aria-labelledby="featured-create-awesome-title"]');
  await expect(featuredCard.locator('source[type="image/webp"]')).toHaveAttribute(
    'srcset',
    new RegExp(`${asset}-192\\.webp`),
  );
  await expect(featuredCard.locator('img')).toHaveAttribute('src', `/assets/${asset}.png`);
  await featuredCard.scrollIntoViewIfNeeded();
  await expect(featuredCard).toHaveScreenshot('create-awesome-island-featured-desktop.png');

  await page.goto('/projects/');
  const workIsland = page.locator('.archipelago__link[href="/create-awesome"]');
  const workImage = workIsland.locator('img');
  await expect(workImage).toHaveAttribute('src', `/assets/nest/${asset}-sm.webp`);
  await workImage.evaluate((image: HTMLImageElement) => image.decode());
  await expect(workIsland).toHaveScreenshot('create-awesome-island-work-desktop.png');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const mobileWorld = page.locator('.atlas-world[data-world-id="create-awesome"]');
  await mobileWorld.scrollIntoViewIfNeeded();
  await expect(mobileWorld).toHaveScreenshot('create-awesome-island-atlas-mobile.png');
});
