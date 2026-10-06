import { expect, test } from '@playwright/test';

test.describe('Agentic Harness session trace', () => {
  test('ends and restarts a demo session while workspace state persists', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/agentic-harness');

    const scene = page.locator('[data-persistence-core]');
    const toggle = scene.getByRole('button', { name: 'End the demo session' });
    const status = scene.locator('[data-pc-status]');

    await expect(scene).toHaveAttribute('data-pc-state', 'active');
    await expect(toggle).toBeVisible();
    await expect(scene.locator('.pc-session__variant--active')).toBeVisible();
    await expect(page).toHaveScreenshot('harness-session-active-desktop.png', { maxDiffPixelRatio: 0.12 });
    await toggle.focus();
    const sessionAnimation = page.waitForFunction(() => {
      const scene = document.querySelector('[data-persistence-core]');
      const session = scene?.querySelector('[data-pc-session-visual]');
      return session?.getAnimations().some((animation) => {
        return animation.playState === 'running' && animation.effect?.getTiming().duration === 360;
      });
    });
    await page.keyboard.press('Enter');
    await sessionAnimation;

    await expect(scene).toHaveAttribute('data-pc-state', 'ended');
    await expect(scene.locator('.pc-session__variant--ended')).toBeVisible();
    await expect(scene.locator('.pc-core__glyph')).toHaveText(['K', 'C', 'P']);
    await expect(scene.locator('.pc-runtime')).toBeVisible();
    await expect(status).toHaveText('Demo session ended. Knowledge, personas and projects remain in the workspace.');
    await expect(scene.getByRole('button', { name: 'Start a new demo session' })).toBeFocused();
    await expect(scene).toHaveScreenshot('harness-session-ended-desktop.png', { maxDiffPixelRatio: 0.12 });

    await page.keyboard.press('Enter');
    await expect(scene).toHaveAttribute('data-pc-state', 'active');
    await expect(scene.locator('.pc-session__variant--active')).toBeVisible();
    await expect(scene.getByRole('button', { name: 'End the demo session' })).toBeFocused();
    await expect(status).toHaveText('New demo session started. It reconnects to the same persistent workspace state.');
  });

  test('uses static state changes when reduced motion is requested and reflows on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/agentic-harness');

    const scene = page.locator('[data-persistence-core]');
    await scene.getByRole('button', { name: 'End the demo session' }).click();

    await expect(scene).toHaveAttribute('data-pc-state', 'ended');
    await expect(scene.locator('.pc-session__variant--ended')).toBeVisible();
    await expect(scene.locator('.pc-core__glyph')).toHaveText(['K', 'C', 'P']);
    await expect(scene.getByRole('button', { name: 'Start a new demo session' })).toBeVisible();
    await expect.poll(() => scene.evaluate((root) => root.getAnimations({ subtree: true }).length)).toBe(0);
    await expect(scene).toHaveScreenshot('harness-session-ended-mobile.png', { maxDiffPixelRatio: 0.12 });

    for (const width of [320, 360, 390]) {
      await page.setViewportSize({ width, height: 844 });
      const layout = await scene.evaluate((element) => ({
        right: element.getBoundingClientRect().right,
        width: element.getBoundingClientRect().width,
        scrollWidth: document.documentElement.scrollWidth,
      }));
      expect(layout.right).toBeLessThanOrEqual(width);
      expect(layout.width).toBeLessThanOrEqual(width);
      expect(layout.scrollWidth).toBeLessThanOrEqual(width);
    }
  });

  test('keeps a high-contrast focus target for keyboard users', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
    await page.goto('/agentic-harness');

    const button = page.getByRole('button', { name: 'End the demo session' });
    await button.focus();
    const focusStyle = await button.evaluate((element) => {
      const style = getComputedStyle(element);
      return { outline: style.outlineStyle, outlineWidth: Number.parseFloat(style.outlineWidth) };
    });
    const targetSize = await button.evaluate((element) => {
      const { width, height } = element.getBoundingClientRect();
      return { width, height };
    });

    expect(focusStyle.outline).not.toBe('none');
    expect(focusStyle.outlineWidth).toBeGreaterThanOrEqual(2);
    expect(targetSize.width).toBeGreaterThanOrEqual(44);
    expect(targetSize.height).toBeGreaterThanOrEqual(44);
  });
});

test.describe('Agentic Harness session trace without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('keeps the complete explanatory diagram and copy available', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/agentic-harness');

    const scene = page.locator('[data-persistence-core]');
    await expect(scene.locator('svg')).toBeVisible();
    await expect(scene.locator('.pc-session__variant--active')).toBeVisible();
    await expect(scene.locator('.pc-core__glyph')).toHaveText(['K', 'C', 'P']);
    await expect(scene.locator('.pc-caption')).toContainText('illustrative model');
    await expect(scene.locator('.pc-controls')).toBeHidden();
    await expect(scene.getByRole('button')).toHaveCount(0);
  });
});
