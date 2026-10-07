import { expect, test } from '@playwright/test';

test.describe('Agentic Developer Stack system map', () => {
  for (const viewport of [
    { name: 'desktop', width: 1440, height: 1000, capture: true },
    { name: 'tablet', width: 1024, height: 900, capture: true },
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
    await expect(map.getByRole('button', { name: 'Trace a workflow' })).toBeHidden();
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

  test('traces the real optional relationships on request', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('/agentic');

    const map = page.getByRole('figure', { name: 'One capability plane, two optional extensions' });
    const stations = map.locator('.agentic-map__station');
    const links = map.locator('.agentic-map__link');
    const status = map.locator('[data-agentic-trace-status]');

    const traceButton = map.getByRole('button', { name: 'Trace a workflow' });
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
    await expect(status).toContainText('extensions remain optional');
  });

  test('keeps the system map static with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/agentic');

    const map = page.getByRole('figure', { name: 'One capability plane, two optional extensions' });
    await map.getByRole('button', { name: 'Trace a workflow' }).click();
    await expect(map).toHaveAttribute('data-trace-state', 'complete');
    await expect(map.locator('.agentic-map__station.is-current')).toHaveCount(3);
    await expect(map.locator('.agentic-map__link.is-current')).toHaveCount(2);
  });
});
