import { expect, type Page, test } from '@playwright/test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const axePath = require.resolve('axe-core/axe.min.js');

const familyIds = ['node', 'python', 'v', 'rust'] as const;
type FamilyId = (typeof familyIds)[number];

const familyFacts: Record<
  FamilyId,
  { title: string; command: RegExp; catalog: string; repository: string; install: string }
> = {
  node: {
    title: 'create-awesome-node-app',
    command: /npm create awesome-node-app@latest/,
    catalog: 'https://create-awesome-node-app.vercel.app',
    repository: 'https://github.com/Create-Node-App/create-node-app',
    install: 'npm create awesome-node-app@latest my-app',
  },
  python: {
    title: 'create-awesome-python-app',
    command: /uvx create-awesome-python-app@latest/,
    catalog: 'https://create-awesome-python-app.vercel.app',
    repository: 'https://github.com/Create-Python-App/create-python-app',
    install: 'uvx create-awesome-python-app@latest my-app',
  },
  v: {
    title: 'create-vlang-app',
    command: /create-vlang-app/,
    catalog: 'https://create-awesome-vlang-app.vercel.app',
    repository: 'https://github.com/Create-Vlang-App/create-vlang-app',
    install: 'curl -fsSL https://create-awesome-vlang-app.vercel.app/install.sh | sh',
  },
  rust: {
    title: 'create-awesome-rust-app',
    command: /create-rust-app/,
    catalog: 'https://create-awesome-rust-app.vercel.app',
    repository: 'https://github.com/Create-Rust-App/create-rust-app',
    install: 'curl -fsSL https://create-awesome-rust-app.vercel.app/install.sh | sh',
  },
};

const responsiveViewports = [
  { width: 320, height: 844 },
  { width: 390, height: 844 },
  { width: 768, height: 900 },
  { width: 1024, height: 900 },
  { width: 1440, height: 1100 },
] as const;

async function expectPageToFit(page: Page) {
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    body: document.body.scrollWidth,
    document: document.documentElement.scrollWidth,
  }));

  expect(
    Math.max(dimensions.body, dimensions.document),
    `Create Awesome must fit the ${dimensions.viewport}px viewport`,
  ).toBeLessThanOrEqual(dimensions.viewport + 1);
}

async function expectNoFamilyFocus(page: Page) {
  expect(
    await page.evaluate(
      () => document.activeElement?.matches('[data-ca-station], input[name="ca-runtime"], [data-ca-panel] *') ?? false,
    ),
    'initialization and history restoration must not move focus into family controls or composer content',
  ).toBe(false);
}

async function expectFamilyState(page: Page, familyId: FamilyId) {
  const facts = familyFacts[familyId];

  await expect(page.locator(`[data-ca-station="${familyId}"]`)).toBeChecked();
  await expect(page.locator('[data-ca-station]:checked')).toHaveCount(1);
  await expect(page.locator(`#ca-runtime-${familyId}`)).toBeChecked();
  await expect(page.locator(`[data-ca-panel="${familyId}"]`)).toBeVisible();
  await expect(page.locator('[data-ca-panel]:visible')).toHaveCount(1);
  await expect(page.locator('#ca-runtime-inspector .vf-inspector__title')).toHaveText(facts.title);
  await expect(page.locator('[data-ca-inspector-link]')).toHaveAttribute('href', facts.catalog);
  await expect(page.locator('[data-ca-command]')).toHaveText(facts.command);
  await expect(page.locator('[data-ca-dock-catalog]')).toHaveAttribute('href', facts.catalog);
  await expect(page.locator('[data-ca-dock-repo]')).toHaveAttribute('href', facts.repository);
  await expect(page.locator('[data-ca-inspector-install]')).toHaveText(facts.install);
  await expect(page.locator('[data-ca-inspector-install-label]')).toHaveText(
    familyId === 'v' || familyId === 'rust' ? 'CLI installation command' : 'Base project command',
  );
  await expect(page.locator('[data-ca-family-select]')).toHaveValue(familyId);
  await expect(page.locator(`[data-visual-node="${familyId}"]`)).toHaveClass(/is-active/);
}

async function selectFamily(page: Page, familyId: FamilyId) {
  await page.locator(`label[for="ca-station-${familyId}"]`).click();
  await expectFamilyState(page, familyId);
}

async function installHistoryProbe(page: Page) {
  await page.addInitScript(() => {
    const calls: Array<{ method: 'pushState' | 'replaceState'; url: string | null }> = [];
    Reflect.set(window, '__caHistoryCalls', calls);

    for (const method of ['pushState', 'replaceState'] as const) {
      const original = window.history[method].bind(window.history);
      Object.defineProperty(window.history, method, {
        configurable: true,
        value(state: unknown, unused: string, url?: string | URL | null) {
          calls.push({ method, url: url == null ? null : String(url) });
          return original(state, unused, url);
        },
      });
    }
  });
}

async function historyCalls(page: Page) {
  return page.evaluate(
    () =>
      Reflect.get(window, '__caHistoryCalls') as Array<{
        method: 'pushState' | 'replaceState';
        url: string | null;
      }>,
  );
}

async function traverseHistory(page: Page, direction: 'back' | 'forward', expected: RegExp) {
  await page.evaluate((requestedDirection) => window.history[requestedDirection](), direction);
  await expect(page).toHaveURL(expected);
}

async function relevantAxeViolations(page: Page) {
  await page.addScriptTag({ path: axePath });
  return page.evaluate(async () => {
    type AxeRuntime = {
      run: (
        context: unknown,
        options?: { resultTypes?: string[] },
      ) => Promise<{ violations: Array<{ id: string; impact: string | null; nodes: unknown[] }> }>;
    };

    const axe = Reflect.get(window, 'axe') as AxeRuntime;
    const report = await axe.run(
      {
        include: [['.ca-world__stations'], ['[data-ca-composer]'], ['#ca-runtime-inspector'], ['.vf-dock']],
        exclude: [['.ca-world__line']],
      },
      { resultTypes: ['violations'] },
    );
    return report.violations.filter((violation) => violation.impact === 'serious' || violation.impact === 'critical');
  });
}

test.describe('PR8 static Create Awesome targets', () => {
  test.use({ javaScriptEnabled: false });

  for (const viewport of [responsiveViewports[0], responsiveViewports[1], responsiveViewports[4]]) {
    test(`keeps all truthful family targets visible without JavaScript at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);

      for (const fragment of ['', ...familyIds.map((familyId) => `#${familyId}`)]) {
        await page.goto(`/create-awesome${fragment}`);

        await expect(page.locator('[data-ca-static-fallback]')).toBeVisible();
        await expect(page.locator('[data-ca-composer]')).toBeHidden();
        await expect(page.locator('[data-ca-static-family]')).toHaveCount(familyIds.length);
        await expect(page.locator('noscript [data-ca-static-family]')).toHaveCount(0);

        const sourceOrder = await page
          .locator('[data-ca-static-family]')
          .evaluateAll((entries) => entries.map((entry) => entry.id));
        expect(sourceOrder).toEqual(familyIds);

        for (const familyId of familyIds) {
          const target = page.locator(`#${familyId}[data-ca-static-family="${familyId}"]`);
          await expect(target).toHaveCount(1);
          await expect(target).toBeVisible();
          await expect(target.locator('h3')).toHaveText(familyFacts[familyId].title);
          await expect(target.locator('a')).toHaveCount(2);
        }

        if (fragment) {
          const familyId = fragment.slice(1) as FamilyId;
          const target = page.locator(`#${familyId}`);
          await expect.poll(() => page.evaluate(() => document.querySelector(':target')?.id)).toBe(familyId);
          await expect
            .poll(() =>
              target.evaluate((element) => {
                const targetRect = element.getBoundingClientRect();
                const headerRect = document.querySelector('[data-testid="site-header"]')?.getBoundingClientRect();
                return targetRect.top - (headerRect?.bottom ?? 0);
              }),
            )
            .toBeGreaterThanOrEqual(-1);
        }

        await expectPageToFit(page);
      }
    });
  }
});

test.describe('PR8 enhanced family restoration', () => {
  test('turns the mobile composition stages into a connected, active assembly route', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/create-awesome');

    const stages = page.locator('.ca-world__flow-index');
    await expect(stages.locator('[data-ca-step="runtime"]')).toHaveClass(/is-current/);
    await expect(stages.locator('[data-ca-step]')).toHaveCount(4);
    await expect
      .poll(() => stages.evaluate((list) => getComputedStyle(list).gridTemplateColumns.split(' ').length))
      .toBe(1);
    const railAlignment = await stages.evaluate((list) => {
      const listRect = list.getBoundingClientRect();
      const badgeRect = list.querySelector('.ca-world__flow-number')!.getBoundingClientRect();
      return {
        rail: Number.parseFloat(getComputedStyle(list).backgroundPositionX),
        badgeCenter: badgeRect.left + badgeRect.width / 2 - listRect.left,
      };
    });
    expect(Math.abs(railAlignment.rail - railAlignment.badgeCenter)).toBeLessThan(1);

    await page.getByRole('combobox', { name: 'Runtime' }).selectOption('rust');
    await expect(stages.locator('[data-ca-step="app"]')).toHaveClass(/is-current/, { timeout: 4000 });
    await expect(page.locator('[data-ca-package]')).toHaveAttribute('data-ca-package-stage', 'app');
  });

  test('opens on the assembly line and keeps a direct path into the composer', async ({ page }) => {
    for (const viewport of [responsiveViewports[1], responsiveViewports[4]]) {
      await page.setViewportSize(viewport);
      await page.goto('/create-awesome');

      const scene = page.locator('.ca-world__scene');
      const composer = page.locator('[data-ca-composer-root]');
      await expect(scene.getByRole('heading', { name: 'Runtime → template → addons → project' })).toBeVisible();
      await expect(scene.locator('[data-ca-step]')).toHaveCount(4);
      expect(
        await scene.evaluate((element) =>
          Boolean(
            element.compareDocumentPosition(document.querySelector('[data-ca-composer-root]')!) &
            Node.DOCUMENT_POSITION_FOLLOWING,
          ),
        ),
      ).toBe(true);

      const composeLink = page.getByRole('link', { name: 'Build a command' });
      await expect(composeLink).toHaveAttribute('href', '#ca-composer-title');
      await composeLink.click();
      await expect(composer.getByRole('heading', { name: 'Runtime + template + addons → command' })).toBeInViewport();
    }
  });

  test('keeps the generated command visible while configuring addons', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 844 });
    await page.goto('/create-awesome');

    const preview = page.locator('.ca-composer__preview');
    const command = page.locator('[data-ca-command]');
    const copyCommand = page.locator('[data-ca-command-copy]');
    const template = page.locator('[data-ca-panel="node"] [data-ca-template]');
    await preview.scrollIntoViewIfNeeded();
    await expect(preview).toBeVisible();
    await expect(preview).toBeInViewport({ ratio: 1 });
    await expect(preview).toHaveCSS('position', 'sticky');
    await expect.poll(() => command.evaluate((code) => code.scrollWidth > code.clientWidth)).toBe(true);

    await page.locator('[data-ca-project]').focus();
    await page.keyboard.press('Tab');
    await expect(command).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect.poll(() => command.evaluate((code) => code.scrollLeft)).toBeGreaterThan(0);
    await page.keyboard.press('Tab');
    await expect(copyCommand).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(template).toBeFocused();

    await expect
      .poll(() =>
        page.evaluate(() => {
          const projectRect = document.querySelector('[data-ca-project]')?.getBoundingClientRect();
          const templateRect = document
            .querySelector('[data-ca-panel="node"] [data-ca-template]')
            ?.getBoundingClientRect();
          const previewRect = document.querySelector('.ca-composer__preview')?.getBoundingClientRect();
          const addonRect = document
            .querySelector('[data-ca-panel="node"] .ca-composer__addon-tools')
            ?.getBoundingClientRect();
          return Boolean(
            projectRect &&
            templateRect &&
            previewRect &&
            addonRect &&
            projectRect.bottom <= previewRect.top &&
            previewRect.bottom <= templateRect.top &&
            templateRect.bottom <= addonRect.top,
          );
        }),
      )
      .toBe(true);

    await page.setViewportSize({ width: 390, height: 844 });
    await expect(preview).toBeInViewport({ ratio: 1 });
    await page.locator('[data-ca-panel="node"] [data-ca-addon]').last().scrollIntoViewIfNeeded();
    await expect(preview).toBeInViewport({ ratio: 1 });
    const dockRect = await preview.boundingBox();
    expect(dockRect).not.toBeNull();
    expect(dockRect!.y).toBeGreaterThan(0);
    expect(dockRect!.y + dockRect!.height).toBeLessThanOrEqual(844);
  });

  test('keeps the assembly line before the live project composer', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/create-awesome');

    const composer = page.locator('[data-ca-composer-root]');
    const command = page.locator('[data-ca-command]');
    await expect(composer).toBeVisible();
    await expect(command).toBeVisible();
    await expect(page.locator('[data-ca-command-copy]')).toBeVisible();
    await expect(page.getByRole('combobox', { name: 'Runtime' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Project links' })).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(() => {
          const composerElement = document.querySelector('[data-ca-composer-root]');
          const line = document.querySelector('.ca-world__scene');
          return Boolean(
            composerElement && line && line.compareDocumentPosition(composerElement) & Node.DOCUMENT_POSITION_FOLLOWING,
          );
        }),
      )
      .toBe(true);

    await page.getByRole('combobox', { name: 'Runtime' }).selectOption('rust');
    await expectFamilyState(page, 'rust');
    await expect(page).toHaveURL(/\/create-awesome\/?#rust$/);

    await expectPageToFit(page);
  });

  test('keeps the default route hash-free and exposes one native family selector', async ({ page }) => {
    await installHistoryProbe(page);
    await page.goto('/create-awesome');

    await expect(page.locator('[data-ca-world]')).toHaveAttribute('data-ca-enhanced', 'true');
    await expect(page.locator('[data-ca-static-fallback]')).toBeHidden();
    await expect(page.getByRole('radiogroup', { name: 'Runtime station' })).toBeVisible();
    await expect(page.getByRole('radio')).toHaveCount(familyIds.length);
    await expect(page).toHaveURL(/\/create-awesome\/?$/);
    await expectFamilyState(page, 'node');
    await expectNoFamilyFocus(page);
    expect(await historyCalls(page)).toEqual([]);
  });

  for (const familyId of familyIds) {
    test(`loads and reloads #${familyId} as complete ${familyId} state without history writes`, async ({ page }) => {
      await installHistoryProbe(page);
      await page.goto(`/create-awesome#${familyId}`);

      await expect(page).toHaveURL(new RegExp(`/create-awesome/?#${familyId}$`));
      await expectFamilyState(page, familyId);
      await expectNoFamilyFocus(page);
      expect(await historyCalls(page)).toEqual([]);

      await page.reload();
      await expect(page).toHaveURL(new RegExp(`/create-awesome/?#${familyId}$`));
      await expectFamilyState(page, familyId);
      await expectNoFamilyFocus(page);
      expect(await historyCalls(page)).toEqual([]);
    });
  }

  test('preserves unknown fragments without coercion, history writes, or focus theft', async ({ page }) => {
    await installHistoryProbe(page);
    await page.goto('/create-awesome#does-not-exist');

    await expect(page).toHaveURL(/\/create-awesome\/?#does-not-exist$/);
    await expectFamilyState(page, 'node');
    await expectNoFamilyFocus(page);
    expect(await historyCalls(page)).toEqual([]);
  });

  test('pushes one entry per user family change and restores every surface with Back and Forward', async ({ page }) => {
    await installHistoryProbe(page);
    await page.goto('/create-awesome');
    const initialHistoryLength = await page.evaluate(() => window.history.length);

    await selectFamily(page, 'python');
    await expect(page).toHaveURL(/\/create-awesome\/?#python$/);
    await selectFamily(page, 'v');
    await expect(page).toHaveURL(/\/create-awesome\/?#v$/);

    expect(await page.evaluate(() => window.history.length)).toBe(initialHistoryLength + 2);
    expect(await historyCalls(page)).toEqual([
      { method: 'pushState', url: '/create-awesome/#python' },
      { method: 'pushState', url: '/create-awesome/#v' },
    ]);

    const focusedElement = await page.evaluate(() => document.activeElement?.id);
    await traverseHistory(page, 'back', /\/create-awesome\/?#python$/);
    await expectFamilyState(page, 'python');
    await expect.poll(() => page.evaluate(() => document.activeElement?.id)).toBe(focusedElement);

    await traverseHistory(page, 'back', /\/create-awesome\/?$/);
    await expectFamilyState(page, 'node');
    await expect.poll(() => page.evaluate(() => document.activeElement?.id)).toBe(focusedElement);

    await traverseHistory(page, 'forward', /\/create-awesome\/?#python$/);
    await expectFamilyState(page, 'python');
    await expect.poll(() => page.evaluate(() => document.activeElement?.id)).toBe(focusedElement);

    await traverseHistory(page, 'forward', /\/create-awesome\/?#v$/);
    await expectFamilyState(page, 'v');
    await expect.poll(() => page.evaluate(() => document.activeElement?.id)).toBe(focusedElement);
    expect(await historyCalls(page)).toHaveLength(2);
  });

  test('preserves explicit #node and unknown-fragment entries during history traversal', async ({ page }) => {
    await installHistoryProbe(page);
    await page.goto('/create-awesome#node');
    await selectFamily(page, 'python');
    await traverseHistory(page, 'back', /\/create-awesome\/?#node$/);
    await expectFamilyState(page, 'node');

    await page.goto('/create-awesome#unknown');
    await selectFamily(page, 'python');
    const focusedElement = await page.evaluate(() => document.activeElement?.id);
    await traverseHistory(page, 'back', /\/create-awesome\/?#unknown$/);
    await expect(page).toHaveURL(/\/create-awesome\/?#unknown$/);
    await expect(page.locator('[data-ca-station]:checked')).toHaveCount(1);
    await expect.poll(() => page.evaluate(() => document.activeElement?.id)).toBe(focusedElement);
  });

  test('synchronizes known external hash changes and ignores unknown hashes without writing history', async ({
    page,
  }) => {
    await installHistoryProbe(page);
    await page.goto('/create-awesome');

    await page.evaluate(() => {
      window.location.hash = 'v';
    });
    await expect(page).toHaveURL(/#v$/);
    await expectFamilyState(page, 'v');

    await page.evaluate(() => {
      window.location.hash = 'python';
    });
    await expect(page).toHaveURL(/#python$/);
    await expectFamilyState(page, 'python');

    await page.evaluate(() => {
      window.location.hash = 'unknown';
    });
    await expect(page).toHaveURL(/#unknown$/);
    await expectFamilyState(page, 'python');
    await expectNoFamilyFocus(page);
    expect(await historyCalls(page)).toEqual([]);
  });

  test('does not write duplicate family history or serialize composer detail state', async ({ page }) => {
    await installHistoryProbe(page);
    await page.goto('/create-awesome');
    await selectFamily(page, 'python');
    expect(await historyCalls(page)).toHaveLength(1);

    await page.locator('[data-ca-station="python"]').evaluate((input: HTMLInputElement) => {
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await page.locator('[data-ca-project]').fill('history-free-project');
    await page.locator('[data-ca-panel="python"] [data-ca-template]').selectOption({ index: 0 });
    const addon = page.locator('[data-ca-panel="python"] [data-ca-addon]').first();
    if ((await addon.count()) > 0) await addon.check();

    await expect(page).toHaveURL(/#python$/);
    expect(await historyCalls(page)).toHaveLength(1);
    await expect(page.locator('[data-ca-command]')).toContainText('history-free-project');
  });

  test('uses native radio keyboard behavior and pushes through the authoritative family flow', async ({ page }) => {
    await page.goto('/create-awesome');
    const node = page.locator('[data-ca-station="node"]');
    await node.focus();
    await page.keyboard.press('ArrowRight');

    await expect(page.locator('[data-ca-station="python"]')).toBeFocused();
    await expect(page).toHaveURL(/#python$/);
    await expectFamilyState(page, 'python');
  });
});

test.describe('PR8 responsive and accessibility checks', () => {
  for (const viewport of responsiveViewports) {
    test(`keeps restored family state usable at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
      await page.goto('/create-awesome#python');

      await expectFamilyState(page, 'python');
      // The editorial-contract intro (#394) legitimately extends the hero;
      // usability is preserved by bringing the controls into view.
      await page.locator('.ca-world__stations').scrollIntoViewIfNeeded();
      await expect(page.locator('.ca-world__stations')).toBeInViewport();
      await expectPageToFit(page);
      for (const familyId of familyIds) {
        const target = page.locator(`label[for="ca-station-${familyId}"]`);
        const box = await target.boundingBox();
        expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
      }
      expect(await relevantAxeViolations(page)).toEqual([]);
    });
  }
});
