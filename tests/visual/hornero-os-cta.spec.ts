import { expect, test } from '@playwright/test';

test('Hornero OS puts its official site before source and component paths', async ({ page }) => {
  await page.goto('/hornero-os');

  const officialSite = page.getByRole('link', { name: 'Visit Hornero OS' });
  await expect(officialSite).toHaveAttribute('href', 'https://horneroos.com');
  await expect(officialSite).toHaveAttribute('target', '_blank');
  await expect(officialSite).toHaveClass(/hos-cta--primary/);

  await expect(page.getByRole('link', { name: 'Try the components' })).toHaveAttribute('href', '#try');
  await expect(page.locator('.hos-cta--quiet')).toHaveAttribute('href', 'https://github.com/HorneroOS/hornero');
});

test('Hornero OS traces the real manifest stages on request', async ({ page }, testInfo) => {
  await page.goto('/hornero-os');

  const manifest = page.locator('.hos-yaml');
  const traceButton = manifest.locator('[data-hos-trace]');
  await expect(traceButton).toBeVisible();
  await expect(traceButton).toHaveText('Trace manifest assembly');
  await expect(traceButton).toHaveAttribute('aria-controls', 'hos-manifest-slots');
  await expect(manifest.locator('#hos-manifest-slots')).toHaveCount(1);
  await traceButton.click();
  await expect(manifest).toHaveAttribute('data-trace-state', 'running');
  await expect(manifest.locator('.hos-yaml__slot.is-current')).toHaveCount(1);
  await expect(manifest.locator('.hos-yaml__slot--pinned').first()).toHaveClass(/is-current/);
  await expect(manifest.locator('[data-hos-trace-status]')).toContainText('shell: pinned 3658e1b');
  await expect
    .poll(() =>
      manifest
        .locator('.hos-yaml__slot--pinned')
        .first()
        .evaluate((slot) =>
          slot.getAnimations().some((animation) => {
            const matrix = new DOMMatrix(getComputedStyle(slot).transform);
            return (
              animation.playState === 'running' && animation.effect?.getTiming().duration === 620 && matrix.m41 < 0
            );
          }),
        ),
    )
    .toBe(true);
  await expect
    .poll(() =>
      manifest
        .locator('.hos-yaml__slot.is-current')
        .first()
        .evaluate((slot) => slot.getAnimations().length),
    )
    .toBeGreaterThan(0);
  await page.waitForTimeout(120);
  await page.evaluate(() => {
    const section = document.querySelector('.hos-manifest');
    if (section)
      window.scrollTo({ top: section.getBoundingClientRect().top + window.scrollY - 90, behavior: 'instant' });
  });
  await page.screenshot({ path: testInfo.outputPath('manifest-trace-first-pin.png') });
  await expect(manifest.locator('[data-hos-trace-status]')).toContainText('installer: future slot reserved', {
    timeout: 4500,
  });
  await expect(manifest.locator('[data-hos-trace-status]')).toContainText('iso: future slot reserved', {
    timeout: 4500,
  });
  await expect(manifest).toHaveAttribute('data-trace-state', 'complete', { timeout: 5000 });
  await expect(manifest.locator('.hos-yaml__slot.is-current')).toHaveCount(5);
  await expect(manifest.locator('[data-hos-trace-status]')).toContainText('remain reserved for future work');

  await traceButton.click();
  await expect(manifest).toHaveAttribute('data-trace-state', 'running');
  await expect(manifest.locator('.hos-yaml__slot.is-current')).toHaveCount(1);

  await page.setViewportSize({ width: 390, height: 844 });
  await traceButton.click();
  await expect(manifest.locator('.hos-yaml__slot.is-current')).toHaveCount(1);
  await expect(manifest.locator('[data-hos-trace-status]')).toContainText('shell: pinned 3658e1b');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(
    true,
  );
  await page.evaluate(() => {
    const section = document.querySelector('.hos-manifest');
    if (section)
      window.scrollTo({ top: section.getBoundingClientRect().top + window.scrollY - 90, behavior: 'instant' });
  });
  await page.screenshot({ path: testInfo.outputPath('manifest-trace-mobile.png') });
});

test('Hornero OS keeps the manifest trace still with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/hornero-os');

  const manifest = page.locator('.hos-yaml');
  await page.getByRole('button', { name: 'Trace manifest assembly' }).click();

  await expect(manifest).toHaveAttribute('data-trace-state', 'complete');
  await expect(manifest.locator('.hos-yaml__slot')).toHaveCount(5);
  await expect(manifest.locator('.hos-yaml__slot.is-current')).toHaveCount(5);
  await expect(manifest.locator('[data-hos-trace-status]')).toContainText('remain reserved for future work');
  await expect
    .poll(() =>
      manifest
        .locator('.hos-yaml__slot')
        .first()
        .evaluate((slot) => slot.getAnimations().length),
    )
    .toBe(0);
});

test('Hornero OS keeps future manifest bays still during assembly', async ({ page }) => {
  await page.goto('/hornero-os');

  const manifest = page.locator('.hos-yaml');
  const futureSlots = manifest.locator('.hos-yaml__slot--future');
  await page.getByRole('button', { name: 'Trace manifest assembly' }).click();

  for (const [index, name] of ['installer', 'iso'].entries()) {
    const slot = futureSlots.nth(index);
    await expect(manifest.locator('[data-hos-trace-status]')).toContainText(`${name}: future slot reserved`, {
      timeout: 4500,
    });
    await expect(slot).toHaveClass(/is-current/);
    await expect
      .poll(() =>
        slot.evaluate((element) => ({
          transform: getComputedStyle(element).transform,
          animations: element.getAnimations().length,
        })),
      )
      .toEqual({ transform: 'none', animations: 0 });
  }

  await expect(manifest).toHaveAttribute('data-trace-state', 'complete');
});

test('Hornero OS manifest stays keyboard-usable at 320px in forced colors', async ({ page }) => {
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto('/hornero-os');

  const manifest = page.locator('.hos-yaml');
  const traceButton = page.getByRole('button', { name: 'Trace manifest assembly' });
  await traceButton.focus();
  await expect(traceButton).toBeFocused();
  expect(await page.evaluate(() => window.matchMedia('(forced-colors: active)').matches)).toBe(true);
  await expect(traceButton).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('Enter');

  await expect(manifest).toHaveAttribute('data-trace-state', 'complete');
  await expect(manifest.locator('.hos-yaml__slot.is-current')).toHaveCount(5);
  await expect(manifest.locator('.hos-yaml__slot--future a').first()).toHaveCSS('border-top-style', 'dashed');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(
    true,
  );
});

test('Hornero OS manifest assembly has reviewed desktop and mobile states', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/hornero-os');
  await page.getByRole('button', { name: 'Trace manifest assembly' }).click();

  const manifest = page.locator('.hos-yaml');
  await expect(manifest).toHaveAttribute('data-trace-state', 'complete');
  await manifest.evaluate((figure) => {
    window.scrollTo({ top: figure.getBoundingClientRect().top + window.scrollY - 96, behavior: 'instant' });
  });
  await expect(page).toHaveScreenshot('hornero-os-manifest-complete-desktop.png');

  await page.setViewportSize({ width: 390, height: 844 });
  await manifest.evaluate((figure) => {
    window.scrollTo({ top: figure.getBoundingClientRect().top + window.scrollY - 96, behavior: 'instant' });
  });
  await expect(page).toHaveScreenshot('hornero-os-manifest-complete-mobile.png');
});

test('Hornero OS still exposes the full manifest without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 720 } });
  const page = await context.newPage();
  await page.goto('/hornero-os/');

  await expect(page.locator('.hos-yaml__slot')).toHaveCount(5);
  await expect(page.locator('.hos-yaml__slot--future')).toHaveCount(2);
  await expect(page.locator('.hos-yaml__slot--future').first()).toContainText('future slot');
  await expect(page.locator('[data-hos-trace]')).toBeHidden();
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth))
    .toBe(true);

  await context.close();
});
