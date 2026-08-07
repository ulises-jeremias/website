import { expect, test } from '@playwright/test';

test.describe('agent-toolkit flagship', () => {
  test('desktop anatomy + recipe selector', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.goto('/agent-toolkit');

    await expect(page.getByRole('heading', { name: /one source/i }).first()).toBeVisible();
    await expect(page.locator('.cap-anatomy')).toBeVisible();
    await expect(page.locator('.dist-map')).toBeVisible();
    await expect(page.locator('.queue-sep')).toBeVisible();
    await expect(page.locator('.swarm-story')).toBeVisible();

    await expect(page.getByText('61', { exact: true }).first()).toBeVisible();
    await expect(page.getByText(/core is 8/i)).toBeVisible();
    await expect(page.getByText(/implementer → reviewer → integrator/i)).toBeVisible();
    await expect(page.getByText(/DevCompanion queues work/i)).toBeVisible();

    await page.locator('label[for="recipe-team"]').click({ force: true });
    await expect(page.locator('#recipe-team')).toBeChecked();
    await expect(page.locator('.swarm-story__panel--team')).toBeVisible();

    await expect(page).toHaveScreenshot('toolkit-desktop-1440.png', { fullPage: false });
  });

  test('mobile recomposed toolkit', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/agent-toolkit');

    await expect(page.locator('.cap-anatomy')).toBeVisible();
    await expect(page.locator('.swarm-story')).toBeVisible();

    await expect(page).toHaveScreenshot('toolkit-mobile-390.png', { fullPage: false });
  });
});
