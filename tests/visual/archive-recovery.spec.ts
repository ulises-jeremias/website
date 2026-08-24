import { expect, test } from '@playwright/test';

test.describe('Archive and recovery routes', () => {
  for (const width of [320, 390]) {
    test(`keeps archive reading and recovery paths usable at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.emulateMedia({ reducedMotion: 'reduce' });

      await page.goto('/projects/');
      await expect(page.locator('#archipelago-title')).toHaveText('Project archive');
      await expect(page.locator('.archipelago__readout')).toContainText('World pointers');
      await expect(page.locator('[data-projects-row]')).not.toHaveCount(0);

      await page.goto('/open-source/');
      await expect(page.locator('#constellation-title')).toHaveText('Evidence archive');
      await expect(page.locator('[data-testid="oss-ledger"]')).toContainText('Primary record');
      await expect(page.locator('[data-testid="oss-row"]')).not.toHaveCount(0);

      await page.goto('/404.html');
      await expect(page.locator('#lost-title')).toHaveText('This world is unlisted');
      await expect(page.locator('.lost-world__console')).toContainText('Recovery console');
      await expect(page.locator('.lost-world__atlas-link')).not.toHaveCount(0);
      await expect(page.locator('.lost-world__atlas-link code').first()).toBeVisible();
    });
  }
});

for (const viewport of [
  { label: 'mobile-390', width: 390, height: 844 },
  { label: 'desktop-1440', width: 1440, height: 1100 },
]) {
  test(`protects the archive tables at ${viewport.label}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.emulateMedia({ reducedMotion: 'reduce' });

    await page.goto('/projects/');
    await page.addStyleTag({ content: '.site-header { position: static !important; }' });
    await expect(page.locator('.projects-ledger')).toHaveScreenshot(`projects-ledger-${viewport.label}.png`, {
      animations: 'disabled',
      maxDiffPixelRatio: 0.07,
    });

    await page.goto('/open-source/');
    await page.addStyleTag({ content: '.site-header { position: static !important; }' });
    await expect(page.locator('.oss-ledger')).toHaveScreenshot(`open-source-ledger-${viewport.label}.png`, {
      animations: 'disabled',
      maxDiffPixelRatio: 0.07,
    });
  });
}
