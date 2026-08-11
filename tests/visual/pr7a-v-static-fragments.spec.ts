import { expect, type Page, test } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const axePath = require.resolve('axe-core/axe.min.js');

const stationIds = ['v', 'vsl', 'vtl', 'rxv', 'setup-v', 'awesome-v'] as const;
type StationId = (typeof stationIds)[number];

const stationFacts: Record<StationId, { title: string; body: string; repository: string }> = {
  v: {
    title: 'V',
    body: 'self-hosted compiler and C as its primary backend',
    repository: 'https://github.com/vlang/v',
  },
  vsl: {
    title: 'VSL',
    body: 'portable pure-V path and optional CPU and GPU backends',
    repository: 'https://github.com/vlang/vsl',
  },
  vtl: {
    title: 'VTL',
    body: 'Beta tensor, reverse-mode autograd, and neural-network library backed by VSL',
    repository: 'https://github.com/vlang/vtl',
  },
  rxv: {
    title: 'RxV',
    body: 'ReactiveX implementation for V',
    repository: 'https://github.com/ulises-jeremias/rxv',
  },
  'setup-v': {
    title: 'setup-v',
    body: 'using prebuilts when available and a source fallback otherwise',
    repository: 'https://github.com/vlang/setup-v',
  },
  'awesome-v': {
    title: 'Awesome V',
    body: 'Community-curated catalog',
    repository: 'https://github.com/vlang/awesome-v',
  },
};

const viewports = [
  { width: 320, height: 844 },
  { width: 390, height: 844 },
  { width: 768, height: 900 },
  { width: 1024, height: 900 },
  { width: 1440, height: 1100 },
] as const;

const evidenceDirectory = process.env.PR7A_SCREENSHOT_DIR;

async function capture(page: Page, filename: string, fullPage = false) {
  if (!evidenceDirectory) return;
  await mkdir(evidenceDirectory, { recursive: true });
  await page.screenshot({ path: path.join(evidenceDirectory, filename), fullPage });
}

async function expectPageToFit(page: Page) {
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

async function expectFragment(page: Page, stationId: StationId) {
  await expect(page).toHaveURL(new RegExp(`/v/?#${stationId}$`));
}

async function expectEnhancedStation(page: Page, stationId: StationId) {
  const selectedTab = page.locator(`[data-v-station="${stationId}"]`);
  const selectedPanel = page.locator(`section#${stationId}[data-v-panel="${stationId}"]`);

  await expect(selectedTab).toHaveAttribute('role', 'tab');
  await expect(selectedTab).toHaveAttribute('aria-selected', 'true');
  await expect(selectedTab).toHaveAttribute('tabindex', '0');
  await expect(selectedTab).toHaveAttribute('aria-controls', stationId);
  await expect(page.locator('[data-v-station][aria-selected="true"]')).toHaveCount(1);
  await expect(page.locator('[data-v-station][tabindex="0"]')).toHaveCount(1);
  await expect(selectedPanel).toBeVisible();
  await expect(selectedPanel).toHaveAttribute('role', 'tabpanel');
  await expect(selectedPanel).toHaveAttribute('aria-labelledby', `v-station-${stationId}`);
  await expect(page.locator('[data-v-panel]:visible')).toHaveCount(1);
  await expect(page.locator('[data-v-station-summary]:visible')).toHaveCount(0);
  await expect(page.locator('#v-lab-inspector .vf-inspector__title')).toHaveText(stationFacts[stationId].title);
  await expect(page.locator('[data-v-inspector-body]')).toContainText(stationFacts[stationId].body);
  await expect(page.locator('[data-v-inspector-link]')).toHaveAttribute('href', stationFacts[stationId].repository);
}

async function expectFragmentTargetVisibleBelowHeader(page: Page, stationId: StationId) {
  const station = page.locator(`#${stationId}`);

  await expect
    .poll(
      () =>
        station.evaluate((element) => {
          const target = element.getBoundingClientRect();
          const header = document.querySelector('[data-testid="site-header"]')?.getBoundingClientRect();
          return target.top - (header?.bottom ?? 0);
        }),
      { message: `${stationId} target must clear the sticky header` },
    )
    .toBeGreaterThanOrEqual(-1);
  await expect(
    station.locator('h2').first(),
    `${stationId} heading must be visible after fragment navigation`,
  ).toBeInViewport();
}

async function expectNoStationFocus(page: Page) {
  expect(
    await page.evaluate(() => document.activeElement?.matches('[data-v-station]') ?? false),
    'station initialization/history must not move focus to a tab',
  ).toBe(false);
}

async function relevantAxeViolations(page: Page, enhanced: boolean) {
  await page.addScriptTag({ path: axePath });
  return page.evaluate(async (isEnhanced) => {
    type AxeRuntime = {
      run: (
        context: unknown,
        options?: { resultTypes?: string[] },
      ) => Promise<{ violations: Array<{ id: string; impact: string | null; nodes: unknown[] }> }>;
    };

    const axe = Reflect.get(window, 'axe') as AxeRuntime;
    const context = isEnhanced
      ? {
          include: [['[data-v-station-selector]'], ['#v-lab-inspector']],
          exclude: [['.v-scene']],
        }
      : {
          include: [['[data-v-lab]']],
          exclude: [['.v-scene']],
        };
    const report = await axe.run(context, { resultTypes: ['violations'] });
    return report.violations.filter((violation) => violation.impact === 'serious' || violation.impact === 'critical');
  }, enhanced);
}

test.describe('PR7A static V station document', () => {
  test.use({ javaScriptEnabled: false });

  for (const viewport of viewports) {
    test(`exposes all six ordinary station sections without JavaScript at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/v');
      await capture(page, `no-js-${viewport.width}-full.png`, true);

      await expect(page.locator('[data-v-lab]')).not.toHaveAttribute('data-v-enhanced', /.+/);
      await expect(page.locator('[data-v-station-selector]')).toBeHidden();
      await expect(page.locator('section[data-v-panel]')).toHaveCount(stationIds.length);
      await expect(page.locator('#v-lab-inspector')).toBeHidden();
      await expect(page.locator('noscript section[data-v-panel]')).toHaveCount(0);

      for (const stationId of stationIds) {
        const station = page.locator(`section#${stationId}[data-v-panel="${stationId}"]`);
        await expect(station).toBeVisible();
        await expect(station.locator('h2').first()).toBeVisible();
        await expect(station.locator('[data-v-station-summary]')).toContainText(stationFacts[stationId].body);
        await expect(station.locator('[data-v-station-summary]')).toContainText(/MIT|CC0 1\.0/);
        await expect(station.locator('[data-v-station-repo]')).toHaveAttribute(
          'href',
          stationFacts[stationId].repository,
        );
      }

      await expectPageToFit(page);
    });
  }

  for (const width of [390, 1440]) {
    test(`resolves every station fragment to a visible static target at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 1100 });

      for (const stationId of stationIds) {
        await page.goto(`/v#${stationId}`);

        const station = page.locator(`section#${stationId}`);
        await expect(station).toBeVisible();
        await expect(station.locator('h2').first()).toBeVisible();
        await expectFragment(page, stationId);
        await expectFragmentTargetVisibleBelowHeader(page, stationId);
        await capture(page, `no-js-${width}-${stationId}-fragment.png`);
      }
    });
  }
});

test.describe('PR7A enhanced V station state', () => {
  test('enhances the same sections into one complete horizontal tab interface', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/v');

    const root = page.locator('[data-v-lab]');
    const selector = page.locator('[data-v-station-selector]');
    await expect(root).toHaveAttribute('data-v-enhanced', 'true');
    await expect(selector).toBeVisible();
    await expect(selector).toHaveAttribute('role', 'tablist');
    await expect(selector).toHaveAttribute('aria-label', 'Lab stations');
    await expect(selector).toHaveAttribute('aria-orientation', 'horizontal');
    await expect(selector.locator('[role="tab"]')).toHaveCount(stationIds.length);
    await expect(page.locator('section[data-v-panel]')).toHaveCount(stationIds.length);
    await expect(page).toHaveURL(/\/v\/?$/);
    await expectEnhancedStation(page, 'v');
    await expectNoStationFocus(page);
  });

  for (const width of [390, 1440]) {
    test(`loads and reloads every known enhanced fragment at ${width}px without focus theft`, async ({ page }) => {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 1100 });

      for (const stationId of stationIds) {
        await page.goto(`/v#${stationId}`);
        await expectFragment(page, stationId);
        await expectEnhancedStation(page, stationId);
        await expectNoStationFocus(page);
        await expectFragmentTargetVisibleBelowHeader(page, stationId);
        await capture(page, `enhanced-${width}-${stationId}-direct.png`);

        await page.reload();
        await expectFragment(page, stationId);
        await expectEnhancedStation(page, stationId);
        await expectNoStationFocus(page);
      }
    });
  }

  test('writes one history entry per changed station and restores complete state with Back and Forward', async ({
    page,
  }) => {
    await page.goto('/v');
    const initialLength = await page.evaluate(() => history.length);

    await page.locator('[data-v-station="v"]').click();
    await expect(page).toHaveURL(/\/v\/?$/);
    expect(await page.evaluate(() => history.length)).toBe(initialLength);

    await page.locator('[data-v-station="vsl"]').click();
    await expectFragment(page, 'vsl');
    await expectEnhancedStation(page, 'vsl');
    expect(await page.evaluate(() => history.length)).toBe(initialLength + 1);

    await page.locator('[data-v-station="vtl"]').click();
    await expectFragment(page, 'vtl');
    await expectEnhancedStation(page, 'vtl');
    expect(await page.evaluate(() => history.length)).toBe(initialLength + 2);
    await expect(page.locator('[data-v-station="vtl"]')).toBeFocused();

    await page.evaluate(() => history.back());
    await expectFragment(page, 'vsl');
    await expectEnhancedStation(page, 'vsl');
    await expect(page.locator('[data-v-station="vsl"]')).not.toBeFocused();

    await page.evaluate(() => history.back());
    await expect(page).toHaveURL(/\/v\/?$/);
    await expectEnhancedStation(page, 'v');
    await expect(page.locator('[data-v-station="v"]')).not.toBeFocused();

    await page.evaluate(() => history.forward());
    await expectFragment(page, 'vsl');
    await expectEnhancedStation(page, 'vsl');

    await page.evaluate(() => history.forward());
    await expectFragment(page, 'vtl');
    await expectEnhancedStation(page, 'vtl');
  });

  test('synchronizes known hash changes and leaves unknown fragments untouched', async ({ page }) => {
    await page.goto('/v');
    const initialLength = await page.evaluate(() => history.length);

    await page.evaluate(() => {
      location.hash = 'rxv';
    });
    await expectFragment(page, 'rxv');
    await expectEnhancedStation(page, 'rxv');
    expect(await page.evaluate(() => history.length)).toBe(initialLength + 1);

    await page.evaluate(() => {
      location.hash = 'does-not-exist';
    });
    await expect(page).toHaveURL(/\/v\/?#does-not-exist$/);
    await expectEnhancedStation(page, 'rxv');
    expect(await page.evaluate(() => history.length)).toBe(initialLength + 2);

    await page.evaluate(() => {
      location.hash = 'setup-v';
    });
    await expectFragment(page, 'setup-v');
    await expectEnhancedStation(page, 'setup-v');
    expect(await page.evaluate(() => history.length)).toBe(initialLength + 3);
  });

  test('keeps an unknown initial fragment without fabricating station state or stealing focus', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    await page.goto('/v#does-not-exist');

    await expect(page).toHaveURL(/\/v\/?#does-not-exist$/);
    await expectEnhancedStation(page, 'v');
    await expectNoStationFocus(page);
    expect(pageErrors).toEqual([]);
  });

  test('restores the complete static document if enhancement fails after binding', async ({ page }) => {
    await page.addInitScript(() => {
      const nativeSetAttribute = HTMLElement.prototype.setAttribute;
      HTMLElement.prototype.setAttribute = function setAttribute(name: string, value: string) {
        if (name === 'data-v-enhanced' && this.matches('[data-v-lab]')) {
          throw new Error('Intentional PR7A enhancement failure');
        }
        nativeSetAttribute.call(this, name, value);
      };
    });

    await page.goto('/v#vsl');

    await expect(page.locator('[data-v-lab]')).not.toHaveAttribute('data-v-enhanced', /.+/);
    await expect(page.locator('[data-v-station-selector]')).toBeHidden();
    await expect(page.locator('[data-v-station][role]')).toHaveCount(0);
    await expect(page.locator('[data-v-panel][role]')).toHaveCount(0);
    await expect(page.locator('[data-v-panel]:visible')).toHaveCount(stationIds.length);
    await expect(page.locator('[data-v-station-summary]:visible')).toHaveCount(stationIds.length);
    await expect(page).toHaveURL(/\/v\/?#vsl$/);
    expect(await relevantAxeViolations(page, false)).toEqual([]);
  });

  test('implements the complete horizontal tab keyboard contract', async ({ page }) => {
    await page.goto('/v');
    const first = page.locator('[data-v-station="v"]');

    await first.focus();
    await page.keyboard.press('Shift+Tab');
    await expectNoStationFocus(page);
    await page.keyboard.press('Tab');
    await expect(first).toBeFocused();

    await page.keyboard.press('ArrowRight');
    await expect(page.locator('[data-v-station="vsl"]')).toBeFocused();
    await expectEnhancedStation(page, 'vsl');
    await expectFragment(page, 'vsl');

    await page.keyboard.press('ArrowLeft');
    await expect(first).toBeFocused();
    await expectEnhancedStation(page, 'v');
    await expectFragment(page, 'v');

    await page.keyboard.press('ArrowLeft');
    await expect(page.locator('[data-v-station="awesome-v"]')).toBeFocused();
    await expectEnhancedStation(page, 'awesome-v');

    await page.keyboard.press('Home');
    await expect(first).toBeFocused();
    await expectEnhancedStation(page, 'v');

    await page.keyboard.press('End');
    await expect(page.locator('[data-v-station="awesome-v"]')).toBeFocused();
    await expectEnhancedStation(page, 'awesome-v');

    await page.keyboard.press('Tab');
    await expectNoStationFocus(page);
  });

  for (const viewport of viewports) {
    test(`keeps all six enhanced station controls practical at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/v');

      const tabs = page.locator('[data-v-station]');
      await expect(tabs).toHaveCount(stationIds.length);
      for (const tab of await tabs.all()) {
        await expect(tab).toBeVisible();
        const box = await tab.boundingBox();
        expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
        expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
      }

      await expectPageToFit(page);
      await capture(page, `enhanced-${viewport.width}-default.png`, true);
    });
  }

  test('retains a visible tab focus indicator in forced colors', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
    await page.goto('/v');

    const tab = page.locator('[data-v-station="vsl"]');
    await tab.focus();
    await expect(tab).toBeFocused();
    const focusStyle = await tab.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        border: style.borderStyle,
        borderWidth: Number.parseFloat(style.borderWidth),
        outline: style.outlineStyle,
        outlineWidth: Number.parseFloat(style.outlineWidth),
      };
    });
    expect(
      (focusStyle.border !== 'none' && focusStyle.borderWidth >= 1) ||
        (focusStyle.outline !== 'none' && focusStyle.outlineWidth >= 1),
    ).toBe(true);
  });

  for (const width of [390, 1440]) {
    test(`keeps the enhanced station interface free of serious axe violations at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 1100 });
      await page.goto('/v#vsl');
      expect(await relevantAxeViolations(page, true)).toEqual([]);
    });
  }
});
