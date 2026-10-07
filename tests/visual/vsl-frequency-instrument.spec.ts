import { expect, test } from '@playwright/test';

test.describe('VSL frequency instrument', () => {
  test('recomputes the spectrum and animates a user-triggered transform', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await activateVslStation(page);

    const scene = page.locator('[data-v-scene="vsl"]');
    await expect(scene).toBeVisible();
    await expect(scene.getByRole('slider', { name: 'Fundamental' })).toHaveValue('5');
    await expect(scene.locator('[data-vsl-controls]')).toBeVisible();
    await expect(scene.locator('[data-vsl-fallback]')).toBeHidden();
    await expect(scene.locator('[data-vsl-summary]')).toHaveText('64 samples · dominant bins 5 and 10');
    await expect
      .poll(() =>
        scene
          .locator('[data-vsl-peaks]')
          .getAttribute('d')
          .then((path) => path?.match(/M/g)?.length),
      )
      .toBe(2);
    await expect(scene).toHaveScreenshot('vsl-frequency-instrument-desktop.png');

    await page.emulateMedia({ reducedMotion: 'no-preference' });
    const frequency = scene.getByRole('slider', { name: 'Fundamental' });
    const signal = scene.locator('[data-vsl-signal]');
    const originalPoints = await signal.getAttribute('points');
    await frequency.focus();
    await page.keyboard.press('ArrowRight');

    await expect(frequency).toHaveValue('6');
    await expect(scene.locator('[data-vsl-frequency-readout]')).toHaveText('6 cycles / window');
    await expect(scene.locator('[data-vsl-summary]')).toHaveText('64 samples · dominant bins 6 and 12 · ready to run');
    await expect(signal).not.toHaveAttribute('points', originalPoints ?? '');
    await expect(frequency).toBeFocused();

    const run = scene.getByRole('button', { name: 'Run DFT' });
    await run.click();
    await expect
      .poll(() => scene.locator('[data-vsl-signal]').evaluate((element) => element.getAnimations().length))
      .toBeGreaterThan(0);
    await expect(scene.locator('[data-v-scene-live]')).toHaveText('DFT complete · dominant bins 6 and 12.', {
      timeout: 5000,
    });
    await expect(run).toBeFocused();
  });

  test('recomposes at 320px and skips animation when reduced motion is requested', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await activateVslStation(page);

    const scene = page.locator('[data-v-scene="vsl"]');
    const run = scene.getByRole('button', { name: 'Run DFT' });
    await expect(scene.locator('.vsl-instrument__plot')).toBeVisible();
    await expect(scene.getByRole('slider', { name: 'Fundamental' })).toBeVisible();
    await expect(scene.locator('.vsl-instrument__scroll-hint')).toBeVisible();
    await expectPageToFit(page);

    await run.click();
    await expect(scene.locator('[data-v-scene-live]')).toHaveText('DFT complete · dominant bins 5 and 10.');
    await expect
      .poll(() =>
        scene
          .locator('[data-vsl-signal], [data-vsl-bins], [data-vsl-peaks]')
          .evaluateAll((elements) => elements.some((element) => element.getAnimations().length > 0)),
      )
      .toBe(false);
    await expectPageToFit(page);
    await expect(scene).toHaveScreenshot('vsl-frequency-instrument-mobile.png');
  });
});

test.describe('VSL frequency instrument without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('keeps a complete static spectrum and exposes no inert controls', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 844 });
    await page.goto('/v#vsl');

    const scene = page.locator('[data-v-scene="vsl"]');
    await expect(scene.locator('[data-vsl-controls]')).toBeHidden();
    await expect(scene.locator('[data-vsl-fallback]')).toBeVisible();
    await expect(scene.locator('[data-vsl-equation]')).toContainText('5n/64');
    await expect(scene.locator('[data-vsl-summary]')).toHaveText('64 samples · dominant bins 5 and 10');
    await expect
      .poll(() =>
        scene
          .locator('[data-vsl-peaks]')
          .getAttribute('d')
          .then((path) => path?.match(/M/g)?.length),
      )
      .toBe(2);
    await expect(scene).toContainText('This browser model demonstrates the math; it does not run VSL.');
    await expectPageToFit(page);
  });
});

async function activateVslStation(page: import('@playwright/test').Page) {
  await page.goto('/v');
  await page.locator('[data-v-station="vsl"]').click();
  await expect(page.locator('[data-v-panel="vsl"]')).toBeVisible();
}

async function expectPageToFit(page: import('@playwright/test').Page) {
  const widths = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    body: document.body.scrollWidth,
    document: document.documentElement.scrollWidth,
  }));

  expect(Math.max(widths.body, widths.document)).toBeLessThanOrEqual(widths.viewport + 1);
}
