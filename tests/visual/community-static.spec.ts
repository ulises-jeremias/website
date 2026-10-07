import { expect, test } from '@playwright/test';

test.describe('Community no-JavaScript fallback', () => {
  test.use({ javaScriptEnabled: false });

  test('keeps every station and contribution path readable', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/community/');

    const root = page.locator('[data-testid="community-plaza"]');
    const index = root.locator('[data-cm-static-index]');
    const controls = root.locator('[data-visual-node]');
    const filters = root.locator('[data-cm-filter]');

    await expect(index).toBeVisible();
    // 14 stations since the Create Awesome Rust family joined.
    await expect(index.locator('li')).toHaveCount(14);
    await expect(index).toContainText('Agent Toolkit');
    await expect(index).toContainText('Join the Discord');
    await expect(controls).toHaveCount(14);
    for (const control of await controls.all()) await expect(control).toBeDisabled();
    for (const filter of await filters.all()) await expect(filter).toBeDisabled();
    await expect(root.locator('[data-cm-status]')).toHaveText('');
    await expect(index.locator('a[href="/agent-toolkit"]')).not.toHaveAttribute('target', '_blank');
  });
});

test('Community enables the station inspector after enhancement initializes', async ({ page }) => {
  const root = page.locator('[data-testid="community-plaza"]');

  await page.goto('/community/');

  await expect(root.locator('[data-cm-static-index]')).toBeHidden();
  for (const control of await root.locator('[data-visual-node]').all()) await expect(control).not.toBeDisabled();
  await root.locator('[data-visual-node="agent-toolkit"]').click();
  await expect(root.locator('[data-cm-status]')).toHaveText(/Station selected: Agent Toolkit/);
  await expect(root.locator('.cm-plaza__station[data-cm-cluster="agents"]')).toHaveClass(/is-lit/);
  const desktopRoute = root.locator('.cm-plaza__svg--desktop [data-cm-route="agents"]');
  await expect(desktopRoute).toHaveClass(/is-lit/);
  await expect.poll(async () => desktopRoute.evaluate((path) => path.getAnimations()[0]?.playState)).toBe('running');
  await expect
    .poll(async () => desktopRoute.evaluate((path) => path.getAnimations()[0]?.currentTime as number))
    .toBeLessThan(1_240);
  await expect
    .poll(async () => desktopRoute.evaluate((path) => Number.parseFloat(getComputedStyle(path).strokeDashoffset)))
    .not.toBe(0);
});

test('Community station signal animates only on the visible map and respects reduced motion', async ({ page }) => {
  const root = page.locator('[data-testid="community-plaza"]');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/community/');

  await expect(root.locator('.cm-plaza__svg--mobile')).toBeVisible();
  await expect(root.locator('.cm-plaza__svg--desktop')).toBeHidden();
  const [discordBox, horneroBox] = await Promise.all([
    root.locator('.cm-plaza__nodes [data-visual-node="discord"]').boundingBox(),
    root.locator('.cm-plaza__nodes [data-visual-node="horneroconfig"]').boundingBox(),
  ]);
  expect(discordBox?.height).toBeGreaterThanOrEqual(44);
  expect(horneroBox?.height).toBeGreaterThanOrEqual(44);
  expect(Math.abs((discordBox?.y ?? 0) - (horneroBox?.y ?? 0))).toBeLessThanOrEqual(1);
  const mobileRoute = root.locator('.cm-plaza__svg--mobile [data-cm-route="agents"]');
  const toolkit = root.locator('[data-visual-node="agent-toolkit"]');
  await toolkit.focus();
  await toolkit.press('Enter');
  await expect(mobileRoute).toHaveClass(/is-lit/);
  await expect.poll(async () => mobileRoute.evaluate((path) => path.getAnimations().length)).toBe(1);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await root.locator('[data-visual-node="create-awesome-node"]').click();
  await expect(root.locator('.cm-plaza__svg--mobile [data-cm-route="create"]')).toHaveClass(/is-lit/);
  await expect
    .poll(async () =>
      root.locator('.cm-plaza__svg--mobile [data-cm-route="create"]').evaluate((path) => path.getAnimations().length),
    )
    .toBe(0);

  await page.setViewportSize({ width: 320, height: 700 });
  await expect.poll(async () => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});
