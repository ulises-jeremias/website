import { expect, test } from '@playwright/test';

test.describe('agent-toolkit flagship', () => {
  test('desktop operations room + recipe selector', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.goto('/agent-toolkit');

    const headings = page.locator('main h1, main h2, main h3, main h4, main h5, main h6');
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(headings.first()).toHaveText('Agent Toolkit');
    await expect(page.locator('.atk-nexus')).toBeVisible();
    await expect(page.locator('.atk-qvs')).toBeVisible();
    await expect(page.locator('.atk-swarm')).toBeVisible();

    await expect(page.getByText('116', { exact: true }).first()).toBeVisible();
    await expect(
      page
        .locator('.atk-qvs')
        .getByText(/implementer/i)
        .first(),
    ).toBeVisible();

    await page.locator('label[for="atk-recipe-team"]').click({ force: true });
    await expect(page.locator('#atk-recipe-team')).toBeChecked();

    await expect(page).toHaveScreenshot('toolkit-desktop-1440.png', { fullPage: false });
  });

  test('mobile recomposed toolkit', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/agent-toolkit');

    await expect(page.locator('.atk-nexus')).toBeVisible();
    await expect(page.locator('.atk-swarm')).toBeVisible();

    // The editorial-contract intro (#394) reflows proportionally between CI
    // and local Chromium font rendering; 0.07 covers the proportional diff.
    await expect(page).toHaveScreenshot('toolkit-mobile-390.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.07,
    });
  });
});
