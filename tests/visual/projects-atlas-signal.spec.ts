import { expect, test } from '@playwright/test';

test('portfolio atlas signals its four connected areas on entry', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/projects');

  const atlas = page.locator('[data-work-atlas]');
  await atlas.scrollIntoViewIfNeeded();
  await expect(atlas).toHaveAttribute('data-atlas', '');
  await expect(atlas.locator('.work-tiers__plate')).toHaveCount(4);
  await expect
    .poll(() =>
      atlas
        .locator('.work-tiers__plate')
        .first()
        .evaluate((element) => getComputedStyle(element, '::before').animationName),
    )
    .toBe('pop');
});

test('portfolio atlas stays static with reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/projects');

  const atlas = page.locator('[data-work-atlas]');
  await atlas.scrollIntoViewIfNeeded();
  await expect(atlas).not.toHaveAttribute('data-atlas');
  await expect(atlas.locator('.work-tiers__plate').first()).toHaveCSS('animation-name', 'none', {
    pseudo: 'before',
  });
  await expect(atlas.locator('.work-tiers__plate')).toHaveCount(4);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('portfolio atlas route signal follows the vertical map on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/projects');

  const atlas = page.locator('[data-work-atlas]');
  await atlas.scrollIntoViewIfNeeded();
  await expect(atlas).toHaveAttribute('data-atlas', '');
  await expect(atlas.locator('.work-tiers__plate').first()).toHaveCSS('animation-name', 'pop', {
    pseudo: 'before',
  });
  await expect(atlas.locator('.work-tiers__plate')).toHaveCount(4);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('portfolio areas remain navigable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();

  try {
    await page.goto('/projects');
    const atlas = page.locator('[data-work-atlas]');
    await expect(atlas.locator('.work-tiers__plate')).toHaveCount(4);
    await expect(atlas.getByRole('link', { name: 'Agentic Developer Stack' })).toBeVisible();
    await expect(atlas.getByRole('link', { name: 'Hornero Linux Desktop' })).toBeVisible();
    await expect(atlas.getByRole('link', { name: 'V Ecosystem' })).toBeVisible();
    await expect(atlas.getByRole('link', { name: 'Create Awesome', exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  } finally {
    await context.close();
  }
});
