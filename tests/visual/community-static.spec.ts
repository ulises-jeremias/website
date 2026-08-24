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
    await expect(index.locator('li')).toHaveCount(12);
    await expect(index).toContainText('Agent Toolkit');
    await expect(index).toContainText('Join the Discord');
    await expect(controls).toHaveCount(12);
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
});
