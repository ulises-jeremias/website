import { expect, test } from '@playwright/test';

test.describe('404 signal finder', () => {
  test('uses restrained feedback motion only when motion is allowed', async ({ page }) => {
    await page.goto('/404.html');

    const query = page.getByRole('searchbox', { name: 'Tune the lost signal' });
    const sweep = page.locator('.lost-world__finder-sweep');
    await query.focus();
    await expect(sweep).toHaveCSS('animation-name', 'lost-world-signal-sweep');
    await query.fill('Hornero OS');

    const exactMatch = page.locator('[data-route-entry][data-exact-match="true"]');
    await expect(exactMatch).toHaveCount(1);
    await expect
      .poll(() =>
        exactMatch.evaluate((entry) => entry.getAnimations().some((animation) => animation.playState === 'running')),
      )
      .toBe(true);

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(sweep).toHaveCSS('animation-name', 'none');
    await query.fill('HorneroConfig');
    const reducedMatch = page.locator('[data-route-entry][data-exact-match="true"]');
    await expect(reducedMatch).toHaveCount(1);
    expect(await reducedMatch.evaluate((entry) => entry.getAnimations())).toHaveLength(0);
  });

  test('narrows route signals and opens the one remaining destination with Enter', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/404.html');

    const query = page.getByRole('searchbox', { name: 'Tune the lost signal' });
    const status = page.locator('#lost-route-status');
    const entries = page.locator('[data-route-entry]');
    const dotfiles = page.locator('[data-route-entry] a[href="/dotfiles"]');
    const horneroOs = page.locator('[data-route-entry] a[href="/hornero-os"]');

    await expect(query).toBeVisible();
    await expect(query).toHaveCSS('min-height', '48px');
    const originalCount = await entries.count();
    expect(originalCount).toBeGreaterThan(0);

    await query.fill('hornero');
    await expect(status).toHaveText('2 destinations remain. Refine the signal to one route.');
    await expect(dotfiles).toBeVisible();
    await expect(horneroOs).toBeVisible();
    await expect(page.locator('[data-route-entry] a[href="/v"]')).toBeHidden();
    await query.press('Enter');
    await expect(page).toHaveURL(/\/404\.html$/);

    await query.fill('Hornero OS');
    await expect(status).toHaveText('Signal acquired: Hornero OS. Press Enter to open it.');
    await expect(horneroOs.locator('xpath=..')).toHaveAttribute('data-exact-match', 'true');
    expect(await horneroOs.locator('xpath=..').evaluate((entry) => entry.getAnimations())).toHaveLength(0);
    await query.press('Enter');
    await expect(page).toHaveURL(/\/hornero-os\/?$/);
  });

  test('reports an empty scan and restores every route when cleared', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/404.html');

    const query = page.getByRole('searchbox', { name: 'Tune the lost signal' });
    const entries = page.locator('[data-route-entry]');
    const status = page.locator('#lost-route-status');
    const originalCount = await entries.count();

    await query.fill('no-such-digital-nest-coordinate');
    await expect(status).toHaveText('No destinations found. Clear the search to view every route.');
    await expect(page.locator('[data-route-empty]')).toBeVisible();
    await expect(entries.filter({ visible: true })).toHaveCount(0);

    await query.press('Escape');
    await expect(query).toHaveValue('');
    await expect(status).toHaveText(`Search is ready for ${originalCount} verified destinations.`);
    await expect(page.locator('[data-route-empty]')).toBeHidden();
    await expect(entries.filter({ visible: true })).toHaveCount(originalCount);
  });

  test('reflows the search and route atlas at 320px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/404.html');

    const query = page.getByRole('searchbox', { name: 'Tune the lost signal' });
    await expect(query).toBeVisible();
    await query.fill('/create-awesome');
    await expect(page.locator('[data-route-entry] a[href="/create-awesome"]')).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth),
    ).toBe(true);
  });
});

test.describe('404 route finder without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('keeps the verified route directory visible and hides the inactive search control', async ({ page }) => {
    await page.goto('/404.html');

    await expect(page.locator('[data-route-finder]')).toBeHidden();
    await expect(page.locator('[data-route-entry]')).not.toHaveCount(0);
    await expect(page.locator('[data-route-entry] a[href="/hornero-os"]')).toBeVisible();
    await expect(page.locator('[data-route-entry] a[href="/create-awesome"]')).toBeVisible();
  });
});
