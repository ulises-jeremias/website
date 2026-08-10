import { expect, test } from '@playwright/test';

const semanticRoutes = ['/dotfiles', '/agentic-workstation', '/agent-toolkit', '/community', '/projects'] as const;

test.describe('PR 2 value and group semantics', () => {
  for (const width of [390, 1440]) {
    test(`exposes valid value and group semantics at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });

      for (const route of semanticRoutes) {
        await page.goto(route);

        const meters = page.locator('.vf-meter');
        for (const meter of await meters.all()) {
          await expect(meter).toHaveAttribute('role', 'progressbar');
          await expect(meter).toHaveAttribute('aria-label');
          await expect(meter).toHaveAttribute('aria-valuemin', '0');
          await expect(meter).toHaveAttribute('aria-valuemax', '100');
          await expect(meter).toHaveAttribute('aria-value' + 'now', /^(?:100|[0-9]{1,2})$/);
          await expect(meter).toHaveAttribute('aria-value' + 'text');
        }

        await expect(page.locator('.df-world__fact-line')).toHaveCount(route === '/dotfiles' ? 1 : 0);
        await expect(page.locator('.df-world__fact-line[aria-label]')).toHaveCount(0);
        await expect(page.locator('.atk-nexus__domains[aria-label]')).toHaveCount(0);
        await expect(page.locator('.atk-swarm__budget[aria-label]')).toHaveCount(0);
        await expect(page.locator('.cm-plaza__incubating[aria-label]')).toHaveCount(0);
        await expect(page.locator('.projects-ledger__badge[aria-label]')).toHaveCount(0);
      }
    });
  }
});

test.describe('PR 2 keyboard-scrollable install code', () => {
  for (const width of [320, 390, 1440]) {
    test(`names and focuses the install command at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/agent-toolkit');

      const command = page.locator('#install-panel > pre');
      await expect(command).toHaveAttribute('role', 'region');
      await expect(command).toHaveAttribute('tabindex', '0');
      await expect(command).toHaveAttribute('aria-label', 'Install command');
      await expect(command).toHaveAttribute('aria-described' + 'by', 'install-scroll-hint');
      await expect(page.locator('#install-scroll-hint')).toBeVisible();
      await expect(page.locator('[data-install-copy]')).toBeVisible();

      const overflow = await command.evaluate((element) => element.scrollWidth > element.clientWidth + 1);
      await command.focus();
      await expect(command).toBeFocused();
      if (overflow) {
        await page.keyboard.press('ArrowRight');
        await expect.poll(() => command.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
      }
    });
  }

  test('preserves the named code region in forced colors', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
    await page.goto('/agent-toolkit');
    const command = page.locator('#install-panel > pre');
    await command.focus();
    await expect(command).toBeFocused();
    await expect(command).toHaveAttribute('aria-label', 'Install command');
  });
});
