import { expect, test } from '@playwright/test';

const asset = 'island-assembly-workshop';

test('Create Awesome island art stays consistent across the homepage and Work map', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto('/');

  const atlasWorld = page.locator('.atlas-world[data-world-id="create-awesome"]');
  const atlasSource = atlasWorld.locator('source[type="image/webp"]');
  await expect(atlasSource).toHaveAttribute('srcset', new RegExp(`${asset}-sm\\.webp`));
  await expect(atlasWorld.locator('source[type="image/png"]')).toHaveAttribute(
    'srcset',
    `/assets/${asset}-220.png 220w, /assets/${asset}-440.png 440w`,
  );
  await expect(atlasWorld.locator('img')).toHaveAttribute('src', `/assets/${asset}-220.png`);
  await atlasWorld.locator('img').evaluate((image: HTMLImageElement) => image.decode());
  await expect(atlasWorld).toHaveScreenshot('create-awesome-island-atlas-desktop.png');

  const featuredCard = page.locator('[aria-labelledby="featured-create-awesome-title"]');
  await expect(featuredCard.locator('source[type="image/webp"]')).toHaveAttribute(
    'srcset',
    new RegExp(`${asset}-192\\.webp`),
  );
  await expect(featuredCard.locator('img')).toHaveAttribute('src', `/assets/${asset}-220.png`);
  await featuredCard.scrollIntoViewIfNeeded();
  await expect(featuredCard.locator('.featured-areas__art')).toHaveScreenshot(
    'create-awesome-island-featured-art-desktop.png',
  );

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

test('PNG island fallback selects the matching physical resolution', async ({ browser }) => {
  for (const deviceScaleFactor of [1, 2]) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const world = page.locator('.atlas-world[data-world-id="create-awesome"]');
    await world.scrollIntoViewIfNeeded();
    await world.locator('source[type="image/webp"]').evaluate((source) => {
      source.setAttribute('type', 'image/x-unsupported-webp');
    });

    const expectedWidth = deviceScaleFactor === 1 ? 220 : 440;
    await expect
      .poll(() => world.locator('img').evaluate((image: HTMLImageElement) => image.currentSrc))
      .toContain(`${asset}-${expectedWidth}.png`);
    await page.close();
  }
});
