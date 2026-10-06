import { expect, test } from '@playwright/test';

test.describe('VTL autograd trace', () => {
  test('animates symbolic values forward and gradients backward', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.goto('/v#vtl');

    const scene = page.locator('[data-v-scene="vtl"]');
    await expect(scene).toBeVisible();
    await expect(scene.locator('.vtl-trace__svg')).toBeVisible();
    await expect(scene.locator('.vtl-trace__mobile-flow')).toBeHidden();
    await expect(scene.locator('[data-vtl-node="multiply"]')).toContainText('×');
    await expect(scene).toContainText('∂L/∂x = w');
    await expect(scene).toContainText('∂L/∂w = x');
    await expect(scene).toHaveScreenshot('vtl-autograd-desktop.png');

    const forward = scene.getByRole('button', { name: 'Run forward' });
    await forward.click();
    await expect
      .poll(() =>
        scene.locator('[data-pass="forward"][data-stage="x"]').evaluate((edge) => edge.getAnimations().length),
      )
      .toBeGreaterThan(0);
    await expect(scene.locator('[data-v-scene-live]')).toHaveText(
      'Forward pass complete. The gate combined x and w into y = x × w.',
    );

    await scene.getByRole('button', { name: 'Run backward' }).click();
    await expect
      .poll(() =>
        scene.locator('[data-pass="reverse"][data-stage="y"]').evaluate((edge) => edge.getAnimations().length),
      )
      .toBeGreaterThan(0);
    await expect(scene.locator('[data-v-scene-live]')).toHaveText(
      'Backward pass complete. The graph returned ∂L/∂x = w and ∂L/∂w = x.',
    );
    await expect(page).toHaveURL(/\/v\/?#vtl$/);
  });

  test('keeps the explanatory graph static when reduced motion is requested', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/v#vtl');

    const scene = page.locator('[data-v-scene="vtl"]');
    await expect(scene.locator('.vtl-trace__svg')).toBeHidden();
    await expect(scene.locator('.vtl-trace__mobile-flow')).toBeVisible();
    await expect(scene.locator('.vtl-trace__mobile-flow .vtl-trace__mobile-arrow')).toHaveCount(2);
    await expect(scene).toHaveScreenshot('vtl-autograd-mobile.png');
    await scene.getByRole('button', { name: 'Run backward' }).click();
    await expect(scene.locator('[data-v-scene-live]')).toHaveText(
      'Backward pass complete. The graph returned ∂L/∂x = w and ∂L/∂w = x.',
    );
    await expect
      .poll(() =>
        scene.locator('[data-vtl-edge]').evaluateAll((edges) => edges.some((edge) => edge.getAnimations().length > 0)),
      )
      .toBe(false);
    await expect(scene.locator('[data-vtl-edge][data-pass="reverse"]')).toHaveCount(3);
    await expect(scene.locator('.vtl-trace__mobile-flow')).toBeVisible();
    await expect(scene.locator('.vtl-trace__mobile-flow')).toContainText('∂L/∂w = x');
    await expect(scene.locator('.vtl-trace__mobile-flow')).toHaveCSS('flex-direction', 'column-reverse');
  });
});

test.describe('VTL autograd trace without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('keeps forward and reverse equations readable in the mobile composition', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/v#vtl');

    const scene = page.locator('[data-v-scene="vtl"]');
    await expect(scene.locator('.vtl-trace__svg')).toBeHidden();
    await expect(scene.locator('.vtl-trace__mobile-flow')).toBeVisible();
    await expect(scene).toContainText('y = xw');
    await expect(scene).toContainText('∂L/∂x = w');
    await expect(scene.getByRole('button', { name: 'Run backward' })).toBeDisabled();
  });
});
