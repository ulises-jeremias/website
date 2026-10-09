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
      const selectedMapStations = page.locator('.v-lab__map-station.is-current');
      if (stationId === 'vsl' || stationId === 'vtl' || stationId === 'rxv') {
        await expect(selectedMapStations).toHaveCount(1);
        await expect(selectedMapStations).toHaveAttribute('data-v-map-station', stationId);
      } else {
        await expect(selectedMapStations).toHaveCount(0);
      }
    }

    const licenses = page.locator('.v-lab__licenses');
    await expect(licenses.locator('h2')).toHaveText('Licenses');
    await expect(licenses).toContainText('Awesome V · CC0 1.0');
    await expect(licenses).not.toContainText(/Veasel|v-mascot/i);
    await expect(page.getByRole('img', { name: 'Selected V ecosystem projects' })).toBeVisible();
    await expect(page.locator('img[src*="veasel"]')).toHaveCount(0);
    const map = page.locator('.v-lab__ecosystem-map');
    await expect(map).toContainText('Scientific computing');
    await expect(map).toContainText('Tensors · autograd');
    await expect(map).toContainText('Reactive channels');
    const provenance = page.locator('.flagship-provenance');
    await expect(provenance.locator('.flagship-provenance__role')).toContainText(
      'Organization member and compiler contributor',
    );
    await expect(provenance).toContainText('scale belongs to the ecosystem, not to personal ownership');
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.locator('.flagship-provenance__role > [aria-hidden="true"]')).toBeHidden();
  });

  test('lights the matching map station and preserves a still selected state for reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/v#vsl');

    const scienceStation = page.locator('[data-v-map-station="vsl"]');
    await expect(scienceStation).toHaveClass(/is-current/);
    await expect(page.locator('.v-lab__map-station.is-current')).toHaveCount(1);
    await expect
      .poll(() => scienceStation.locator('circle').evaluate((circle) => getComputedStyle(circle).transform))
      .toBe('none');
    await expect.poll(() => scienceStation.evaluate((station) => station.getAnimations().length)).toBe(0);

    await page.locator('[data-v-station="vtl"]').click();
    await expect(page.locator('[data-v-map-station="vsl"]')).not.toHaveClass(/is-current/);
    await expect(page.locator('[data-v-map-station="vtl"]')).toHaveClass(/is-current/);
    await expect(page.locator('[data-v-station-status]')).toContainText('VTL');
  });

  test('animates the selected project node as concise map feedback', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.goto('/v');
    await page.locator('[data-v-station="vsl"]').click();

    const selectedNode = page.locator('[data-v-map-station="vsl"] circle');
    await expect(selectedNode).toHaveCSS('animation-name', 'v-lab-node-arrive');
    await expect
      .poll(() =>
        selectedNode.evaluate((node) => node.getAnimations().some((animation) => animation.playState === 'running')),
      )
      .toBe(true);
  });

  test('traces the documented VTL → VSL → V foundation path on request', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.goto('/v');

    const instrument = page.locator('[data-v-architecture]');
    const traceButton = instrument.locator('[data-v-architecture-run]');
    const topology = instrument.locator('[data-v-architecture-topology]');

    await expect(instrument).toContainText('VTL builds on VSL');
    await expect(instrument).toContainText("VSL's default path is pure V");
    await expect(traceButton).toBeVisible();
    await traceButton.click();
    await expect(topology).toHaveAttribute('data-tracing', 'true');
    await expect
      .poll(() =>
        topology
          .locator('.v-lab__topology-node')
          .first()
          .evaluate((node) => node.getAnimations().some((animation) => animation.playState === 'running')),
      )
      .toBe(true);
    await expect(instrument.locator('[data-v-architecture-status]')).toContainText('Tracing VTL');
    await expect(instrument.locator('[data-v-architecture-status]')).toContainText('Trace complete', {
      timeout: 3000,
    });
    await expect(topology).not.toHaveAttribute('data-tracing', 'true');
    await capture(page, 'v-foundation-instrument-desktop.png');
    const rxvLink = instrument.locator('[data-v-quick-station="rxv"]');
    await rxvLink.click();
    await expect(rxvLink).toHaveAttribute('aria-current', 'location');
    await expect(page.locator('[data-v-station="rxv"]')).toHaveAttribute('aria-selected', 'true');
    await expect(page).toHaveURL(/#rxv$/);
  });

  test('keeps the foundation path legible on mobile and still under reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });

    for (const width of [320, 390, 768]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto('/v');

      const instrument = page.locator('[data-v-architecture]');
      const traceButton = instrument.locator('[data-v-architecture-run]');
      const topology = instrument.locator('[data-v-architecture-topology]');

      await expect(instrument).toContainText('VTL builds on VSL');
      await expect(instrument.locator('.v-lab__topology-node')).toHaveCount(3);
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth))
        .toBe(true);
      if (width <= 390) await capture(page, `v-foundation-instrument-${width}.png`);
      await traceButton.click();
      await expect(instrument.locator('[data-v-architecture-status]')).toContainText('Motion is disabled');
      await expect(topology).not.toHaveAttribute('data-tracing', 'true');
      await expect.poll(() => topology.evaluate((element) => element.getAnimations().length)).toBe(0);
    }
  });

  test('keeps the relationship readable when JavaScript is unavailable', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto('/v');

    const instrument = page.locator('[data-v-architecture]');
    await expect(instrument).toContainText('VTL builds on VSL');
    await expect(instrument).toContainText("VSL's default path is pure V");
    await expect(instrument.locator('.v-lab__topology-node')).toHaveCount(3);
    await expect(instrument.locator('[data-v-architecture-run]')).toBeHidden();
    await expect(instrument.locator('[data-v-quick-station="rxv"]')).toHaveAttribute('href', '#rxv');
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth))
      .toBe(true);

    await context.close();
  });

  test('uses the canonical Awesome V destination in the Projects ledger', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/projects');
    await page.locator('[data-projects-query]').fill('awesome-v');

    const row = page.locator('[data-projects-row]:visible');
    await expect(row).toHaveCount(1);
    await expect(row.locator('h4 > a')).toHaveAttribute('href', 'https://github.com/vlang/awesome-v');
    await expect(row.locator('.projects-ledger__kind')).toContainText('Contributor · Aug 10, 2026');
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
      await expect(page.locator('.flagship-provenance')).toContainText(
        'scale belongs to the ecosystem, not to personal ownership',
      );
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
