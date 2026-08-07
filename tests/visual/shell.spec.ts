import { expect, test } from '@playwright/test';

test.describe('global shell visual coverage', () => {
  test('header and footer appear once on the homepage', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.goto('/');

    await expect(page.getByTestId('site-header')).toHaveCount(1);
    await expect(page.locator('footer, [data-testid="site-footer"]').first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Digital Nest/i }).first()).toBeVisible();
  });

  test('dotfiles route reuses the same shell', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.goto('/dotfiles');

    await expect(page.getByTestId('site-header')).toHaveCount(1);
    await expect(page.locator('footer, [data-testid="site-footer"]').first()).toBeVisible();
  });
});
