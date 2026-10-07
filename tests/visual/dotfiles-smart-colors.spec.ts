import { expect, test } from '@playwright/test';

test('Smart Colors traces each real wallpaper path on request', async ({ page }, testInfo) => {
  await page.goto('/dotfiles');

  const flow = page.locator('.df-color-flow');
  const source = flow.locator('[data-df-flow-source]');
  const signal = flow.locator('[data-df-flow-signal]');
  const live = flow.locator('[data-df-flow-route="live"]');
  const fallback = flow.locator('[data-df-flow-route="fallback"]');
  const status = flow.locator('[data-df-flow-status]');

  await expect(source).toBeVisible();
  await expect(live).toContainText('appearance setWallpaper');
  await expect(fallback).toContainText('apply-appearance.sh');
  await expect(flow.locator('[data-df-flow-controls]')).toBeVisible();

  await flow.getByRole('button', { name: 'Shell running · Quickshell IPC' }).click();
  await expect(flow).toHaveAttribute('data-trace-state', 'running');
  await expect(status).toHaveText('Wallpaper selected with horneroctl.');
  await expect(source).toHaveClass(/is-active/);
  const signalFrames = await signal.evaluate((element) => {
    const animation = element.getAnimations()[0];
    const effect = animation?.effect;
    return effect instanceof KeyframeEffect ? effect.getKeyframes().map((frame) => frame.transform) : [];
  });
  expect(signalFrames).toHaveLength(4);
  expect(signalFrames[0]).not.toBe(signalFrames[2]);
  const expectedEnd = await flow.evaluate((figure) => {
    const output = figure.querySelector('[data-df-flow-route="live"] [data-df-flow-output]');
    if (!output) throw new Error('Live route output is missing');
    const flowRect = figure.getBoundingClientRect();
    const outputRect = output.getBoundingClientRect();
    return [
      outputRect.left + outputRect.width / 2 - flowRect.left,
      outputRect.top + outputRect.height / 2 - flowRect.top,
    ];
  });
  const actualEnd = [...String(signalFrames[3] ?? '').matchAll(/-?\d+(?:\.\d+)?/g)].map(([value]) => Number(value));
  expect(actualEnd).toHaveLength(3);
  expect(actualEnd[0]).toBeCloseTo(expectedEnd[0], 2);
  expect(actualEnd[1]).toBeCloseTo(expectedEnd[1], 2);
  expect(actualEnd[2]).toBe(0.2);
  await expect
    .poll(() => signal.evaluate((element) => element.getAnimations()[0]?.effect?.getTiming().duration))
    .toBe(700);
  await expect(live).toHaveClass(/is-complete/, { timeout: 3000 });
  await expect(signal).toBeHidden();
  await expect(live.locator('[data-df-flow-output]')).toHaveClass(/is-active/);
  await expect(status).toContainText('Both branches read the same wallpaper state.');
  await expect(fallback).not.toHaveClass(/is-active|is-complete/);
  await flow.screenshot({ path: testInfo.outputPath('smart-colors-live-path.png') });

  await flow.getByRole('button', { name: 'Shell stopped · palette fallback' }).click();
  await expect(flow).toHaveAttribute('data-trace-state', 'running');
  await expect(live).not.toHaveClass(/is-active|is-complete/);
  await expect(fallback).toHaveClass(/is-complete/, { timeout: 3000 });
  await expect(fallback.locator('[data-df-flow-output]')).toHaveClass(/is-active/);
  await expect(status).toContainText('apply-appearance.sh runs pywal');
});

test('Smart Colors completes immediately when reduced motion is enabled', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/dotfiles');

  const flow = page.locator('.df-color-flow');
  const live = flow.locator('[data-df-flow-route="live"]');
  await flow.getByRole('button', { name: 'Shell running · Quickshell IPC' }).click();

  await expect(flow).toHaveAttribute('data-trace-state', 'complete');
  await expect(live).toHaveClass(/is-complete/);
  await expect.poll(() => live.evaluate((route) => route.getAnimations().length)).toBe(0);
  await expect(flow.locator('[data-df-flow-signal]')).toBeHidden();
});

test('Smart Colors finishes its active trace if reduced motion becomes enabled', async ({ page }) => {
  await page.goto('/dotfiles');

  const flow = page.locator('.df-color-flow');
  const fallback = flow.locator('[data-df-flow-route="fallback"]');
  await flow.getByRole('button', { name: 'Shell stopped · palette fallback' }).click();
  await expect(flow).toHaveAttribute('data-trace-state', 'running');
  await page.emulateMedia({ reducedMotion: 'reduce' });

  await expect(flow).toHaveAttribute('data-trace-state', 'complete');
  await expect(fallback).toHaveClass(/is-complete/);
  await expect.poll(() => fallback.evaluate((route) => route.getAnimations().length)).toBe(0);
  await expect(flow.locator('[data-df-flow-signal]')).toBeHidden();
});

test('Smart Colors trace controls remain usable at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto('/dotfiles');

  const flow = page.locator('.df-color-flow');
  const buttons = flow.locator('[data-df-flow]');
  await expect(buttons).toHaveCount(2);
  for (const button of await buttons.all()) {
    expect((await button.boundingBox())?.height).toBeGreaterThanOrEqual(44);
  }
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth))
    .toBe(true);
});

test('Smart Colors keeps the whole explanation available without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 720 } });
  const page = await context.newPage();
  await page.goto('/dotfiles');

  const flow = page.locator('.df-color-flow');
  await expect(flow.locator('[data-df-flow-source]')).toContainText('Wallpaper selected');
  await expect(flow.locator('[data-df-flow-route]')).toHaveCount(2);
  await expect(flow.getByRole('button', { name: 'Shell running · Quickshell IPC' })).toBeHidden();
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth))
    .toBe(true);

  await context.close();
});
