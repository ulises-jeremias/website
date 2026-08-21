import { expect, test } from '@playwright/test';

test.describe('global shell visual coverage', () => {
  test('header and footer appear once on the homepage', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.goto('/');

    await expect(page.getByTestId('site-header')).toHaveCount(1);
    await expect(page.locator('footer, [data-testid="site-footer"]').first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Digital Nest/i }).first()).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Primary', exact: true })).toHaveCount(1);
  });

  test('mobile drawer replaces the compact navigation while open', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const compact = page.getByRole('navigation', { name: 'Primary (compact)', exact: true });
    await expect(compact).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Primary', exact: true })).toHaveCount(0);

    const trigger = page.getByRole('button', { name: 'Open navigation' });
    const pageShell = page.locator('.section-layout');
    await trigger.click();
    const dialog = page.getByRole('dialog', { name: 'Navigate the atlas' });
    await expect(dialog).toBeVisible();
    const drawerBox = await dialog.boundingBox();
    expect(drawerBox?.height).toBeGreaterThanOrEqual(843);
    expect(drawerBox?.y).toBe(0);
    await expect(dialog.getByRole('navigation', { name: 'Primary', exact: true })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Primary (compact)', exact: true })).toHaveCount(0);
    await expect(pageShell).toHaveAttribute('inert', '');
    await expect(pageShell).toHaveAttribute('aria-hidden', 'true');

    await dialog.getByRole('button', { name: 'Close navigation' }).click();
    await expect(dialog).toBeHidden();
    await expect(compact).toBeVisible();
    await expect(pageShell).not.toHaveAttribute('inert', '');
    await expect(pageShell).not.toHaveAttribute('aria-hidden', 'true');
    await expect(trigger).toBeFocused();
  });

  test('dotfiles route reuses the same shell', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.goto('/dotfiles');

    await expect(page.getByTestId('site-header')).toHaveCount(1);
    await expect(page.locator('footer, [data-testid="site-footer"]').first()).toBeVisible();
  });
});
