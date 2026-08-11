import { expect, type Page, test } from '@playwright/test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const axePath = require.resolve('axe-core/axe.min.js');

const viewports = [320, 390, 768, 1024, 1440] as const;

const diagrams = [
  {
    id: 'dotfiles',
    route: '/dotfiles',
    root: '.df-world__layers-block',
    svg: '.df-layers__svg',
    visualNodes: '.df-layers__layer',
    controls: '[data-df-layer-controls]',
    legend: 'Inspect a HorneroConfig layer',
    radios: '[data-df-layer-controls] input[type="radio"]',
    radioCount: 5,
    inspector: '#df-layer-inspector',
    status: '[data-df-layer-status]',
    startRadio: '#df-layer-shell',
    keyboardRadio: '#df-layer-compositor',
    keyboardVisual: '[data-layer-visual="compositor"]',
    keyboardTitle: 'compositor',
    keyboardStatus: 'Layer selected: compositor — Modern animated Wayland desktop.',
    pointerRadio: '#df-layer-terminal',
    pointerVisual: '[data-layer-visual="terminal"]',
    pointerTitle: 'terminal',
    pointerStatus: 'Layer selected: terminal — GPU rendering and observability.',
    fallback: '[data-df-layer-fallback]',
    fallbackItems: '[data-df-layer-fallback] li',
  },
  {
    id: 'workstation',
    route: '/agentic-workstation',
    root: '[data-ws-machine]',
    svg: '.ws-map__svg',
    visualNodes: '.ws-map__node',
    controls: '[data-ws-layer-controls]',
    legend: 'Inspect a project responsibility',
    radios: '[data-ws-layer-controls] input[type="radio"]',
    radioCount: 4,
    inspector: '#ws-layer-inspector',
    status: '[data-ws-layer-status]',
    startRadio: '#ws-layer-workstation',
    keyboardRadio: '#ws-layer-toolkit',
    keyboardVisual: '[data-node="toolkit"]',
    keyboardTitle: 'Toolkit',
    keyboardStatus: 'Responsibility selected: Toolkit — capabilities · distribution.',
    pointerRadio: '#ws-layer-harness',
    pointerVisual: '[data-node="harness"]',
    pointerTitle: 'Agentic Harness',
    pointerStatus: 'Responsibility selected: Agentic Harness — runtime · persistent workspace.',
    fallback: '[data-ws-layer-fallback]',
    fallbackItems: '[data-ws-layer-fallback] li',
  },
] as const;

async function expectSurfaceToFit(page: Page, selector: string, fallbackSelector: string) {
  const bounds = await page.locator(selector).evaluate((element, fallback) => {
    const viewport = document.documentElement.clientWidth;
    const required = [element, ...element.querySelectorAll(`fieldset, legend, label, aside, ${fallback}`)];
    const offenders = required
      .map((item) => {
        const rect = item.getBoundingClientRect();
        const style = getComputedStyle(item);
        return {
          element: item.tagName.toLowerCase(),
          left: rect.left,
          right: rect.right,
          width: rect.width,
          visible: rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden',
        };
      })
      .filter((item) => item.visible && (item.left < -1 || item.right > viewport + 1 || item.width > viewport + 1));
    return { viewport, offenders };
  }, fallbackSelector);

  expect(bounds.offenders, `changed diagram surface must fit ${bounds.viewport}px`).toEqual([]);
}

async function nestedInteractiveViolations(page: Page) {
  await page.addScriptTag({ path: axePath });
  return page.evaluate(async () => {
    type AxeRuntime = {
      run: (
        context: Document,
        options: { runOnly: { type: 'rule'; values: string[] } },
      ) => Promise<{ violations: Array<{ id: string; nodes: Array<{ target: string[] }> }> }>;
    };

    const axe = Reflect.get(window, 'axe') as AxeRuntime;
    const report = await axe.run(document, {
      runOnly: { type: 'rule', values: ['nested-interactive'] },
    });
    return report.violations;
  });
}

test.describe('PR6 native interactive-diagram grammar', () => {
  for (const width of viewports) {
    test(`keeps native diagram controls usable and contained at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: width <= 390 ? 844 : 1000 });
      await page.emulateMedia({ reducedMotion: 'reduce' });

      for (const diagram of diagrams) {
        await page.goto(diagram.route);

        const root = page.locator(diagram.root);
        const svg = root.locator(diagram.svg);
        const controls = root.locator(diagram.controls);
        const labels = controls.locator('label');

        await expect(svg).toHaveAttribute('aria-hidden', 'true');
        await expect(svg).toHaveAttribute('focusable', 'false');
        await expect(svg).not.toHaveAttribute('role', /.+/);
        await expect(svg.locator('[role="button"], [role="radio"], [tabindex]')).toHaveCount(0);
        await expect(svg.locator('[aria-pressed]')).toHaveCount(0);
        const focusableVisualDescendants = await svg
          .locator('*')
          .evaluateAll((elements) =>
            elements
              .filter((element) => (element as SVGElement).tabIndex >= 0)
              .map((element) => element.tagName.toLowerCase()),
          );
        expect(focusableVisualDescendants).toEqual([]);
        await expect(controls).toBeEnabled();
        await expect(controls.locator('legend')).toBeVisible();
        await expect(controls.locator('legend')).toHaveText(diagram.legend);
        await expect(controls.locator('input[type="radio"]')).toHaveCount(diagram.radioCount);
        await expect(controls.locator('input[type="radio"]:checked')).toHaveCount(1);
        for (const radio of await controls.locator('input[type="radio"]').all()) {
          await expect(radio).toHaveAttribute('aria-controls', diagram.inspector.slice(1));
        }
        await expect(root.locator(diagram.inspector)).not.toHaveAttribute('aria-live', /.+/);
        await expect(page.locator(diagram.status)).toHaveAttribute('role', 'status');
        await expect(page.locator(diagram.status)).toHaveAttribute('aria-atomic', 'true');
        await expect(page.locator(diagram.status)).not.toHaveAttribute('aria-live', /.+/);

        for (const label of await labels.all()) {
          const box = await label.boundingBox();
          expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
          expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
        }

        const sourceOrder = await root.evaluate(
          (element, selectors) => {
            const visual = element.querySelector(selectors.svg);
            const selector = element.querySelector(selectors.controls);
            const inspector = element.querySelector(selectors.inspector);
            if (!visual || !selector || !inspector) return false;
            return Boolean(
              visual.compareDocumentPosition(selector) & Node.DOCUMENT_POSITION_FOLLOWING &&
              selector.compareDocumentPosition(inspector) & Node.DOCUMENT_POSITION_FOLLOWING,
            );
          },
          { svg: diagram.svg, controls: diagram.controls, inspector: diagram.inspector },
        );
        expect(sourceOrder).toBe(true);

        const aria = await root.ariaSnapshot();
        expect(aria).not.toMatch(/^\s*-\s*img\b/m);
        expect(aria).not.toMatch(/^\s*-\s*button\b/m);
        expect(aria).toContain(`group "${diagram.legend}"`);
        expect(aria.match(/^\s*-\s*radio\b/gm) ?? []).toHaveLength(diagram.radioCount);
        await expectSurfaceToFit(page, diagram.root, diagram.fallback);
      }
    });
  }

  for (const diagram of diagrams) {
    test(`${diagram.id} converges keyboard and pointer input on native radio state`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(diagram.route);

      const startRadio = page.locator(diagram.startRadio);
      const keyboardRadio = page.locator(diagram.keyboardRadio);
      await page.locator(`label[for="${diagram.startRadio.slice(1)}"]`).click();
      await startRadio.focus();
      await page.keyboard.press('ArrowRight');

      await expect(keyboardRadio).toBeChecked();
      await expect(keyboardRadio).toBeFocused();
      await expect(page.locator(diagram.keyboardVisual)).toHaveClass(/is-selected/);
      await expect(page.locator(`${diagram.inspector} .vf-inspector__title`)).toHaveText(diagram.keyboardTitle);
      await expect(page.locator(diagram.status)).toHaveText(diagram.keyboardStatus);

      await page.locator(diagram.pointerVisual).click();
      await expect(page.locator(diagram.pointerRadio)).toBeChecked();
      await expect(page.locator(diagram.pointerVisual)).toHaveClass(/is-selected/);
      await expect(page.locator(`${diagram.inspector} .vf-inspector__title`)).toHaveText(diagram.pointerTitle);
      await expect(page.locator(diagram.status)).toHaveText(diagram.pointerStatus);
    });
  }

  for (const width of [390, 1440]) {
    test(`removes nested interactive axe violations at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });

      for (const diagram of diagrams) {
        await page.goto(diagram.route);
        expect(await nestedInteractiveViolations(page)).toEqual([]);
      }
    });
  }

  for (const diagram of diagrams) {
    test(`${diagram.id} retains native focus in forced colors`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
      await page.goto(diagram.route);

      const radio = page.locator(diagram.keyboardRadio);
      await radio.focus();
      await expect(radio).toBeFocused();
      const label = page.locator(`label[for="${diagram.keyboardRadio.slice(1)}"]`);
      const outline = await label.evaluate((element) => {
        const style = getComputedStyle(element);
        return { style: style.outlineStyle, width: Number.parseFloat(style.outlineWidth) };
      });
      expect(outline.style).not.toBe('none');
      expect(outline.width).toBeGreaterThanOrEqual(2);
    });
  }
});

test.describe('PR6 no-JavaScript diagram fallback', () => {
  test.use({ javaScriptEnabled: false });

  for (const width of [320, 390]) {
    test(`exposes complete static diagram content at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });

      for (const diagram of diagrams) {
        await page.goto(diagram.route);
        const root = page.locator(diagram.root);
        const controls = root.locator(diagram.controls);

        await expect(root.locator(diagram.svg)).toHaveAttribute('aria-hidden', 'true');
        await expect(root.locator(`${diagram.svg} [role="button"], ${diagram.svg} [tabindex]`)).toHaveCount(0);
        await expect(controls).toHaveAttribute('disabled', '');
        for (const radio of await controls.locator('input[type="radio"]').all()) {
          await expect(radio).toBeDisabled();
        }
        await expect(root.locator(diagram.fallback)).toBeVisible();
        await expect(root.locator(diagram.fallbackItems)).toHaveCount(diagram.radioCount);
        await expectSurfaceToFit(page, diagram.root, diagram.fallback);
      }
    });
  }
});
