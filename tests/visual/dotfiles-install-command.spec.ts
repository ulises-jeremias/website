import { expect, test } from '@playwright/test';

test('Dotfiles install command is a keyboard-scrollable named region', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/dotfiles');

  const command = page.locator('[data-df-install]');
  await expect(command).toHaveAttribute('role', 'region');
  await expect(command).toHaveAttribute('aria-label', 'HorneroConfig install command');
  await expect(command).toHaveAttribute('aria-describedby', 'df-install-hint');

  const dimensions = await command.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBeGreaterThan(dimensions.clientWidth);

  await command.focus();
  await page.keyboard.press('End');
  await expect.poll(() => command.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);

  await page.keyboard.press('PageUp');
  await expect.poll(() => command.evaluate((element) => element.scrollLeft)).toBeLessThan(dimensions.scrollWidth);

  await page.keyboard.press('PageDown');
  await expect.poll(() => command.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);

  await page.keyboard.press('Home');
  await expect.poll(() => command.evaluate((element) => element.scrollLeft)).toBe(0);
});
