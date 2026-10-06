import { expect, test } from '@playwright/test';

test.describe('Agent Toolkit profile compiler trace', () => {
  test('animates the canonical catalog into the selected native profile', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.goto('/agent-toolkit');

    const chamber = page.locator('[data-atk-compile]');
    const flow = chamber.locator('[data-compile-flow]');
    const cursor = chamber.getByRole('button', { name: 'Select Cursor profile' });

    await expect(chamber.getByRole('heading', { name: 'One catalog. Native landings.' })).toBeVisible();
    await expect(chamber.locator('[data-compile-target]')).toHaveCount(9);
    await cursor.click();
    await expect(cursor).toHaveAttribute('aria-pressed', 'true');
    await expect(chamber.locator('[data-compile-path]')).toHaveText('marketplace plugins + .cursor/rules/*.mdc');

    await chamber.getByRole('button', { name: 'Trace a distribution pass' }).click();
    await expect(flow).toHaveClass(/is-compiling/);
    await expect
      .poll(() =>
        chamber
          .locator('[data-compile-packet]')
          .first()
          .evaluate(
            (element) => element.getAnimations().filter((animation) => animation.playState === 'running').length,
          ),
      )
      .toBeGreaterThan(0);
    await expect(chamber.locator('[data-compile-status]')).toContainText('Distribution trace complete for Cursor');
    await expect(flow).toHaveClass(/is-routed/);
    await expect(chamber.locator('.atk-compile__truth')).toHaveText('Symbolic route · no install is running');
  });

  test('keeps the selected path static when reduced motion is enabled', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/agent-toolkit');

    const chamber = page.locator('[data-atk-compile]');
    const flow = chamber.locator('[data-compile-flow]');
    await chamber.getByRole('button', { name: 'Select Codex CLI profile' }).click();
    await chamber.getByRole('button', { name: 'Trace a distribution pass' }).click();

    await expect(flow).toHaveClass(/is-routed/);
    await expect(flow).not.toHaveClass(/is-compiling/);
    await expect(chamber.locator('[data-compile-status]')).toContainText('Reduced motion is enabled');
    expect(
      await chamber.evaluate((element) =>
        element.getAnimations().filter((animation) => animation.playState === 'running'),
      ),
    ).toHaveLength(0);
  });

  test('shows the complete static composition without JavaScript', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    try {
      await page.goto('/agent-toolkit');
      const chamber = page.locator('[data-atk-compile]');
      await expect(chamber).toBeVisible();
      await expect(chamber.locator('[data-compile-source]')).toHaveCount(6);
      await expect(chamber.locator('[data-compile-target]')).toHaveCount(9);
      await expect(chamber.locator('[data-compile-path]')).toHaveText('~/.claude/skills + marketplace plugins');
      await expect(chamber.locator('[data-compile-run]')).toBeDisabled();
      await expect(chamber.locator('[data-compile-target]').first()).toBeDisabled();
      const staticIndex = page.locator('[data-atk-static-index]');
      await expect(staticIndex).toBeVisible();
      await expect(staticIndex.locator('.atk-nexus__static-families li')).toHaveCount(6);
      await expect(staticIndex.locator('.atk-nexus__static-targets li')).toHaveCount(9);
    } finally {
      await context.close();
    }
  });
});
