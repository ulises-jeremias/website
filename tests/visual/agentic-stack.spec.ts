import { expect, test } from '@playwright/test';

test.describe('Agentic Developer Stack system map', () => {
  for (const viewport of [
    { name: 'desktop', width: 1440, height: 1000, capture: true },
    { name: 'tablet', width: 1024, height: 900, capture: true },
    // System-font wrapping differs across local and CI Chromium; the full
    // mobile route snapshot already covers the composed page with tolerance.
    { name: 'mobile', width: 390, height: 844, capture: false },
  ]) {
    test(`keeps the opening and system map composed at ${viewport.name}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/agentic');

      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.locator('.agentic-page__lead')).toBeVisible();
      await expect(page.getByRole('figure', { name: 'One capability plane, two optional extensions' })).toBeVisible();
      await page.evaluate(async () => {
        window.scrollTo(0, 0);
        await document.fonts.ready;
      });
      if (viewport.capture) {
        await expect(page.locator('.agentic-page__masthead')).toHaveScreenshot(
          `agentic-stack-intro-${viewport.name}.png`,
        );
      }
    });
  }

  test('shows three distinct projects and their optional relationships on desktop', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.goto('/agentic');

    const map = page.getByRole('figure', { name: 'One capability plane, two optional extensions' });
    await expect(map).toBeVisible();
    await expect(map.getByRole('article')).toHaveCount(3);
    await expect(map.getByRole('link', { name: 'Agentic Workstation' })).toHaveAttribute(
      'href',
      '/agentic-workstation',
    );
    await expect(map.getByRole('link', { name: 'Agent Toolkit' })).toHaveAttribute('href', '/agent-toolkit');
    await expect(map.getByRole('link', { name: 'Agentic Harness' })).toHaveAttribute('href', '/agentic-harness');
    await expect(map.getByText('can install', { exact: true })).toBeVisible();
    await expect(map.getByText('uses runtime', { exact: true })).toBeVisible();
    await expect(map).toContainText('not setup requirements');

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    expect(overflow).toBe(false);
  });

  test('keeps the map and all entry paths readable without JavaScript at mobile width', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 844 } });
    const page = await context.newPage();
    await page.goto('/agentic');

    const map = page.getByRole('figure', { name: 'One capability plane, two optional extensions' });
    await expect(map.locator('[data-agentic-trace]')).toBeHidden();
    const stations = map.getByRole('article');
    await expect(stations).toHaveCount(3);
    await expect(map.getByText('can install', { exact: true })).toBeVisible();
    await expect(map.getByText('uses runtime', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Start with the need you have' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Start with Agent Toolkit' }).first()).toBeVisible();

    const tops = await stations.evaluateAll((elements) =>
      elements.map((element) => element.getBoundingClientRect().top),
    );
    expect(tops[0]).toBeLessThan(tops[1]!);
    expect(tops[1]).toBeLessThan(tops[2]!);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    expect(overflow).toBe(false);
    await context.close();
  });

  test('traces the selected full-stack adoption path without implying every project is required', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('/agentic');

    const map = page.getByRole('figure', { name: 'One capability plane, two optional extensions' });
    const stations = map.locator('.agentic-map__station');
    const links = map.locator('.agentic-map__link');
    const status = map.locator('[data-agentic-trace-status]');

    const traceButton = map.getByRole('button', { name: 'Use all three' });
    await traceButton.focus();
    await expect(traceButton).toBeFocused();
    await traceButton.press('Enter');
    await expect(map).toHaveAttribute('data-trace-state', 'running');
    await expect(stations.nth(0)).toHaveClass(/is-current/);
    await expect(status).toContainText('HOST · MACHINE');
    await expect(stations.nth(1)).toHaveClass(/is-current/, { timeout: 1500 });
    await expect(links.nth(0)).toHaveClass(/is-current/);
    await expect(status).toContainText('CONTEXT · WORKSPACE');
    await expect(map).toHaveAttribute('data-trace-state', 'complete', { timeout: 3000 });
    await expect(map.locator('.agentic-map__station.is-current')).toHaveCount(3);
    await expect(map.locator('.agentic-map__link.is-current')).toHaveCount(2);
    await expect(status).toContainText('The highlighted path is complete; other projects remain optional.');
    await expect(traceButton).toHaveAttribute('aria-pressed', 'true');
  });

  test('shows only the selected stations and relationships with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/agentic');

    const map = page.getByRole('figure', { name: 'One capability plane, two optional extensions' });
    const stations = map.locator('.agentic-map__station.is-current');
    const edges = map.locator('.agentic-map__link.is-current');

    await map.getByRole('button', { name: 'Toolkit alone' }).click();
    await expect(map).toHaveAttribute('data-trace-state', 'complete');
    await expect(stations).toHaveCount(1);
    await expect(stations.first()).toHaveAttribute('data-agentic-station', 'platform');
    await expect(edges).toHaveCount(0);

    const machinePath = map.getByRole('button', { name: 'Provision a machine' });
    await machinePath.click();
    await expect(stations).toHaveCount(2);
    await expect(edges).toHaveCount(1);
    await expect(map).toHaveAttribute('data-active-path', 'reproducible-machine');

    const persistentPath = map.getByRole('button', { name: 'Add persistent context' });
    await persistentPath.click();
    await expect(stations).toHaveCount(2);
    await expect(edges).toHaveCount(1);
    await expect(map).toHaveAttribute('data-active-path', 'persistent-context');
    await expect(persistentPath).toHaveAttribute('aria-pressed', 'true');
    await expect(map.getByRole('button', { name: 'Toolkit alone' })).toHaveAttribute('aria-pressed', 'false');
  });

  test('keeps adoption path controls usable without horizontal overflow on narrow screens', async ({ page }) => {
    for (const width of [320, 360, 390]) {
      await page.setViewportSize({ width, height: 844 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/agentic');

      const map = page.getByRole('figure', { name: 'One capability plane, two optional extensions' });
      const options = map.getByRole('group', { name: 'Choose an optional stack path' });
      await expect(options.getByRole('button')).toHaveCount(4);
      await expect(options.getByRole('button').first()).toHaveCSS('min-height', '44px');
      await options.getByRole('button', { name: 'Toolkit alone' }).click();
      await expect(map.locator('.agentic-map__station.is-current')).toHaveCount(1);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth),
      ).toBe(true);
    }
  });
});
