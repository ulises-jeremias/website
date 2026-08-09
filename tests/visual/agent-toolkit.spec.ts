import { expect, test } from '@playwright/test';

test.describe('agent-toolkit flagship', () => {
  test('desktop operations room + recipe selector', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.goto('/agent-toolkit');

    await expect(page.getByRole('heading', { name: /^agent toolkit$/i }).first()).toBeVisible();
    await expect(page.locator('.atk-nexus')).toBeVisible();
    await expect(page.locator('.atk-qvs')).toBeVisible();
    await expect(page.locator('.atk-swarm')).toBeVisible();

    await expect(page.getByText('61', { exact: true }).first()).toBeVisible();
    await expect(page.getByText(/implementer/i).first()).toBeVisible();

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

    await expect(page).toHaveScreenshot('toolkit-mobile-390.png', { fullPage: false });
  });
});
