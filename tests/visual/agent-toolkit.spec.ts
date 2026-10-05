import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

// The skill count comes from the committed inventory snapshot, so this spec
// follows `pnpm data:agent-toolkit:sync` instead of pinning a stale number.
const { counts } = JSON.parse(
  readFileSync(new URL('../../src/features/agent-toolkit/data/inventory.snapshot.json', import.meta.url), 'utf8'),
) as { counts: { skills: number } };

test.describe('agent-toolkit flagship', () => {
  test('desktop operations room + recipe selector', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.goto('/agent-toolkit');

    const headings = page.locator('main h1, main h2, main h3, main h4, main h5, main h6');
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(headings.first()).toHaveText('Agent Toolkit');
    await expect(page.locator('.atk-nexus')).toBeVisible();
    await expect(page.locator('.atk-qvs')).toBeVisible();
    await expect(page.locator('.atk-swarm')).toBeVisible();

    await expect(page.getByText(String(counts.skills), { exact: true }).first()).toBeVisible();
    await expect(
      page
        .locator('.atk-qvs')
        .getByText(/implementer/i)
        .first(),
    ).toBeVisible();

    await page.locator('label[for="atk-recipe-team"]').click({ force: true });
    await expect(page.locator('#atk-recipe-team')).toBeChecked();

    await expect(page).toHaveScreenshot('toolkit-desktop-1440.png', { fullPage: false });
  });

  test('mobile recomposed toolkit', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/agent-toolkit');

    await expect(page.locator('.atk-nexus')).toBeVisible();
    await expect(page.locator('.atk-swarm')).toBeVisible();

    // The editorial-contract intro (#394) reflows proportionally between CI
    // and local Chromium font rendering; allow the inspected 0.08 diff.
    await expect(page).toHaveScreenshot('toolkit-mobile-390.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.12,
    });
  });

  test('desktop surface matches the current released Electron app', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/agent-toolkit');

    const desktop = page.locator('[data-surface="desktop"]');
    await expect(desktop).toContainText('Flagship Electron app released for Linux, macOS, and Windows');
    await expect(desktop).toContainText('guided onboarding');
    await expect(desktop.getByRole('link', { name: 'Get the desktop app' })).toHaveAttribute(
      'href',
      'https://github.com/ulises-jeremias/agent-toolkit/releases/latest',
    );
    await expect(desktop.getByRole('link', { name: 'Desktop docs' })).toHaveAttribute(
      'href',
      'https://github.com/ulises-jeremias/agent-toolkit/tree/main/docs/desktop',
    );
    await expect(desktop).not.toContainText('Electron successor in progress');
  });
});
