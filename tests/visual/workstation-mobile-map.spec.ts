import { expect, test } from '@playwright/test';

const stations = ['HorneroConfig', 'Agentic Workstation', 'Agent Toolkit', 'Agentic Harness'] as const;
const relationships = [
  'optionally coexists with',
  'can provision host dependencies for',
  'provides capabilities and workspace commands to',
] as const;

for (const width of [320, 390, 680]) {
  test(`shows the complete Workstation relationship path at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/agentic-workstation');

    const mobileMap = page.locator('figure');
    await expect(mobileMap).toBeVisible();
    await expect(page.locator('.ws-map__svg')).toBeHidden();
    await expect(mobileMap.locator('a')).toHaveCount(stations.length);
    await expect(mobileMap.locator('p')).toHaveCount(relationships.length);

    for (const station of stations) {
      await expect(mobileMap.getByRole('link', { name: new RegExp(`${station}$`) })).toBeVisible();
    }
    for (const relationship of relationships) {
      await expect(mobileMap.getByText(relationship, { exact: true })).toBeVisible();
    }
    await expect(mobileMap.getByText('Optional connections.')).toBeVisible();
    await expect(page.locator('[data-ws-layer-controls]')).toBeVisible();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    expect(overflow).toBe(false);
  });
}

test('keeps the Workstation mobile relationship path complete without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 900 },
  });
  const page = await context.newPage();
  await page.goto('/agentic-workstation');

  const mobileMap = page.locator('figure');
  await expect(mobileMap).toBeVisible();
  for (const station of stations) {
    await expect(mobileMap.getByRole('link', { name: new RegExp(`${station}$`) })).toBeVisible();
  }
  for (const relationship of relationships) {
    await expect(mobileMap.getByText(relationship, { exact: true })).toBeVisible();
  }
  await context.close();
});
