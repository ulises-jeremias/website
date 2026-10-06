import { expect, test } from '@playwright/test';

const focuses = [
  { id: 'agentic', label: 'Agentic Developer Stack' },
  { id: 'hornero', label: 'Hornero Linux Desktop' },
  { id: 'create-awesome', label: 'Create Awesome' },
  { id: 'v-ecosystem', label: 'V Ecosystem' },
] as const;

test('support dock follows canonical area content and keeps the funding boundary clear', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto('/sponsor');

  const dock = page.locator('[data-sp-route-dock]');
  await expect(dock).toBeVisible();
  await expect(page.locator('[data-sp-route-fallback]')).toBeHidden();
  await expect(dock.getByRole('radio', { name: /General support/ })).toBeChecked();
  await expect(dock.getByRole('heading', { name: 'General support' })).toBeVisible();
  await expect(dock.getByRole('link', { name: /Sponsor on GitHub/ })).toHaveAttribute(
    'href',
    'https://github.com/sponsors/ulises-jeremias',
  );

  for (const focus of focuses) {
    await dock.locator(`input[name="sp-route"][value="${focus.id}"]`).check();
    const source = page.locator(`#area-${focus.id}`);
    const title = (await source.locator('.sp-area__head h3').textContent())?.trim();
    const summary = (await source.locator('.sp-area__summary').textContent())?.trim();
    await expect(dock.getByRole('heading', { name: title ?? focus.label })).toBeVisible();
    await expect(dock.locator('[data-sp-route-summary]')).toContainText(summary ?? '');
    for (const item of await source.locator('.sp-area__cols .sp-list li').allTextContents()) {
      await expect(dock.locator('.sp-route__output-list')).toContainText(item.trim());
    }
    await expect(dock.locator('[data-sp-route-note]')).toContainText('does not earmark');
    const areaHref = await source.locator('.sp-area__link').evaluate((link) => (link as HTMLAnchorElement).href);
    const areaLink = dock.getByRole('link', { name: `Read about ${title}` });
    await expect(areaLink).toHaveAttribute('href', areaHref ?? '');
    await expect(areaLink).toHaveCSS('background-color', 'rgb(255, 66, 208)');
    const listLineHeight = await dock.locator('.sp-route__output-list').evaluate((list) => {
      const style = getComputedStyle(list);
      return Number.parseFloat(style.lineHeight) / Number.parseFloat(style.fontSize);
    });
    expect(listLineHeight).toBeCloseTo(1.5, 1);
    await expect(dock.getByRole('link', { name: 'Discuss a partnership' })).toHaveAttribute(
      'href',
      new RegExp(`subject=Open-source%20partnership%3A%20${encodeURIComponent(title ?? focus.label)}`),
    );
  }
});

test('support dock keeps no-JavaScript content and fits a 320px viewport', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 800 } });
  const page = await context.newPage();
  try {
    await page.goto('/sponsor');
    await expect(page.locator('[data-sp-route-fallback]')).toBeVisible();
    await expect(page.locator('[data-sp-route-dock]')).toBeHidden();
    await expect(page.locator('.sp-route__table tbody tr')).toHaveCount(4);
    for (const focus of focuses) await expect(page.locator(`#area-${focus.id}`)).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  } finally {
    await context.close();
  }
});

test('support dock responds to keyboard input and respects reduced motion changes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/sponsor');

  const dock = page.locator('[data-sp-route-dock]');
  const ports = dock.getByRole('group', { name: 'Choose a support focus to explore' });
  const radios = ports.getByRole('radio');
  await radios.first().focus();
  await page.keyboard.press('ArrowDown');
  await expect(radios.nth(1)).toBeChecked();
  await expect(radios.nth(1)).toBeFocused();

  await radios.nth(2).check();
  const output = dock.locator('[data-sp-route-output]');
  await expect.poll(() => output.evaluate((element) => element.getAnimations().length)).toBeGreaterThan(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => output.evaluate((element) => element.getAnimations().length)).toBe(0);
  await expect(dock.getByRole('heading', { name: 'Hornero Linux Desktop' })).toBeVisible();

  await page.setViewportSize({ width: 320, height: 740 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  const heights = await radios.evaluateAll((elements) =>
    elements.map((element) => element.parentElement?.getBoundingClientRect().height ?? 0),
  );
  expect(heights.every((height) => height >= 44)).toBe(true);
});
