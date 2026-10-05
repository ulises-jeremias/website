import { expect, test } from '@playwright/test';

test('V station summaries and inspector expose project contribution paths', async ({ page }) => {
  await page.goto('/v');

  const staticPaths = page.locator('.v-lab__station-summary .v-lab__contribution-links a');
  await expect(staticPaths).toHaveCount(12);

  await page.locator('[data-v-station="vsl"]').click();
  await expect(page.locator('[data-v-inspector-contributing]')).toHaveAttribute(
    'href',
    'https://github.com/vlang/vsl/blob/main/CONTRIBUTING.md',
  );
  await expect(page.locator('[data-v-inspector-issues]')).toHaveAttribute(
    'href',
    'https://github.com/vlang/vsl/issues',
  );
});

test('HorneroConfig publishes upstream review and safety practices', async ({ page }) => {
  await page.goto('/dotfiles');

  await expect(page.getByRole('button', { name: 'Copy review command' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Review before applying' })).toBeVisible();
  await expect(page.getByText(/Contributions use temporary HOME and isolated XDG directories/i)).toBeVisible();
  await expect(
    page.getByText(/Shared source avoids secrets, personal credentials, generated caches, and host-specific values/i),
  ).toBeVisible();
  await expect(page.getByText(/tests must not apply to a live account/i)).toBeVisible();
  await expect(page.getByText(/Package installation does not run chezmoi apply automatically/)).toBeVisible();
  await expect(page.getByText(/14 themes|Smart Colors pipeline|curl -fsSL/)).toHaveCount(0);
});
