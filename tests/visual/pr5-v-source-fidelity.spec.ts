import { expect, test } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const viewports = [
  { width: 320, height: 800 },
  { width: 390, height: 844 },
  { width: 768, height: 900 },
  { width: 1024, height: 900 },
  { width: 1440, height: 1100 },
] as const;

const stationIds = ['v', 'vsl', 'vtl', 'rxv', 'setup-v', 'awesome-v'] as const;
const evidenceDirectory = process.env.PR5_SCREENSHOT_DIR;

async function expectPageToFit(page: import('@playwright/test').Page) {
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    body: document.body.scrollWidth,
    document: document.documentElement.scrollWidth,
  }));

  expect(
    Math.max(dimensions.body, dimensions.document),
    `V route must fit the ${dimensions.viewport}px viewport`,
  ).toBeLessThanOrEqual(dimensions.viewport + 1);
}

async function capture(page: import('@playwright/test').Page, filename: string) {
  if (!evidenceDirectory) return;
  await mkdir(evidenceDirectory, { recursive: true });
  await page.screenshot({ path: path.join(evidenceDirectory, filename), fullPage: false });
}

test.describe('PR5 V source-fidelity route', () => {
  for (const viewport of viewports) {
    test(`keeps every V station readable at ${viewport.width}px`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setViewportSize(viewport);
      await page.goto('/v');

      for (const stationId of stationIds) {
        await page.locator(`[data-v-station="${stationId}"]`).click();
        await expect(page.locator(`[data-v-panel="${stationId}"]`)).toBeVisible();
        await expect(page.locator('[data-v-inspector-body]')).not.toBeEmpty();
        await expect(page.locator('[data-v-inspector-link]')).toHaveAttribute('href', /^https:\/\/github\.com\//);
        await expectPageToFit(page);
        await capture(page, `v-${viewport.width}-${stationId}.png`);
      }
    });
  }

  test('shows source-backed station facts and destinations', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/v');

    const expected = {
      v: {
        body: 'self-hosted compiler and C as its primary backend',
        chip: 'Built-in fmt · test · doc tooling',
        href: 'https://github.com/vlang/v',
      },
      vsl: {
        body: 'portable pure-V path and optional CPU and GPU backends',
        chip: 'Pure-V default · QR caveat documented',
        href: 'https://github.com/vlang/vsl',
      },
      vtl: {
        body: 'Beta tensor, reverse-mode autograd, and neural-network library backed by VSL',
        chip: 'Feature-scoped CUDA / Vulkan experimental',
        href: 'https://github.com/vlang/vtl',
      },
      rxv: {
        body: 'ReactiveX implementation for V',
        chip: 'filter / map_ / merge / reduce_',
        href: 'https://github.com/ulises-jeremias/rxv',
      },
      'setup-v': {
        body: 'using prebuilts when available and a source fallback otherwise',
        chip: 'Mapped prebuilt · source fallback',
        href: 'https://github.com/vlang/setup-v',
      },
      'awesome-v': {
        body: 'Community-curated catalog',
        chip: 'CC0 1.0 list license',
        href: 'https://github.com/vlang/awesome-v',
      },
    } as const;

    for (const [stationId, fact] of Object.entries(expected)) {
      await page.locator(`[data-v-station="${stationId}"]`).click();
      await expect(page.locator('[data-v-inspector-body]')).toContainText(fact.body);
      await expect(page.locator('[data-v-inspector-chips]')).toContainText(fact.chip);
      await expect(page.locator('[data-v-inspector-link]')).toHaveAttribute('href', fact.href);
      await expect(page.locator('[data-v-inspector-link]')).toHaveText(
        `Open ${new URL(fact.href).pathname.slice(1)} ↗`,
      );
    }

    const licenses = page.locator('.v-lab__licenses');
    await licenses.locator('summary').click();
    await expect(licenses).toContainText('Awesome V · CC0 1.0');
    await expect(licenses).toContainText('Veasel / V mascot · CC BY-NC 4.0');
    await expect(licenses).toContainText('This site ships no Veasel asset');
  });

  test('uses the canonical Awesome V destination in the Projects ledger', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/projects');
    await page.locator('[data-projects-query]').fill('awesome-v');

    const row = page.locator('[data-projects-row]:visible');
    await expect(row).toHaveCount(1);
    await expect(row.locator('h4 > a')).toHaveAttribute('href', 'https://github.com/vlang/awesome-v');
    await expect(row.locator('.projects-ledger__kind')).toContainText('Contributor · Aug 10, 2026');
    await row.locator('summary').click();
    await expect(row).toContainText('Community-curated list of V frameworks, libraries, software, and resources');
    await row.scrollIntoViewIfNeeded();
    await capture(page, 'projects-390-awesome-v.png');
  });

  test('keeps station facts reachable by keyboard in forced colors', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
    await page.goto('/v');

    const vTab = page.locator('[data-v-station="v"]');
    await vTab.focus();
    await page.keyboard.press('ArrowRight');

    const vslTab = page.locator('[data-v-station="vsl"]');
    await expect(vslTab).toBeFocused();
    await expect(vslTab).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('[data-v-inspector-body]')).toContainText('portable pure-V path');
    await expect(page.locator('[data-v-inspector-link]')).toHaveAccessibleName('Open vlang/vsl ↗');
  });
});

test.describe('PR5 V progressive enhancement', () => {
  test.use({ javaScriptEnabled: false });

  for (const viewport of [
    { width: 320, height: 800 },
    { width: 1440, height: 1100 },
  ]) {
    test(`keeps every source-backed station truthful without JavaScript at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/v');

      await expect(page.locator('[data-v-station-selector]')).toBeHidden();
      await expect(page.locator('[data-v-panel]')).toHaveCount(stationIds.length);
      await expect(page.locator('#v-lab-inspector')).toBeHidden();
      for (const stationId of stationIds) {
        const station = page.locator(`[data-v-panel="${stationId}"]`);
        await expect(station).toBeVisible();
        await expect(station.locator('[data-v-station-summary]')).not.toBeEmpty();
        await expect(station.locator('[data-v-station-repo]')).toHaveAttribute('href', /^https:\/\/github\.com\//);
      }
      await expectPageToFit(page);
    });
  }
});
