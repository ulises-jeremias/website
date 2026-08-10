import { expect, type Page, test } from '@playwright/test';

const viewports = [
  { width: 320, height: 800 },
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 768, height: 900 },
  { width: 1024, height: 900 },
  { width: 1440, height: 1100 },
] as const;

const workstationProfiles = [
  'technical',
  'non-technical',
  'ai',
  'node',
  'python',
  'data',
  'infra',
  'minimal',
  'custom',
] as const;

const createFamilies = ['node', 'python', 'v'] as const;

async function selectRadio(page: Page, selector: string) {
  await page.locator(selector).evaluate((element: HTMLInputElement) => {
    element.checked = true;
    element.dispatchEvent(new Event('change', { bubbles: true }));
  });
}

async function expectPageAndElementsToFit(page: Page, selectors: string[]) {
  const result = await page.evaluate((requiredSelectors) => {
    const viewportWidth = document.documentElement.clientWidth;
    const elements = requiredSelectors.flatMap((selector) => [...document.querySelectorAll(selector)]);
    const offenders = elements
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
      })
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName.toLowerCase(),
          id: element.id,
          className: element.getAttribute('class'),
          left: Number(rect.left.toFixed(2)),
          right: Number(rect.right.toFixed(2)),
          width: Number(rect.width.toFixed(2)),
          text: (element.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 120),
        };
      })
      .filter((entry) => entry.left < -1 || entry.right > viewportWidth + 1 || entry.width > viewportWidth + 1);

    return {
      viewportWidth,
      bodyScrollWidth: document.body.scrollWidth,
      documentScrollWidth: document.documentElement.scrollWidth,
      offenders,
    };
  }, selectors);

  expect(
    Math.max(result.bodyScrollWidth, result.documentScrollWidth),
    `page scroll width must fit ${result.viewportWidth}px: ${JSON.stringify(result)}`,
  ).toBeLessThanOrEqual(result.viewportWidth + 1);
  expect(result.offenders, `required elements must fit: ${JSON.stringify(result.offenders)}`).toEqual([]);
}

test.describe('PR 1 correctness baseline', () => {
  for (const viewport of viewports) {
    test(`Workstation profiles and states reflow at ${viewport.width}px`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setViewportSize(viewport);
      await page.goto('/agentic-workstation');

      for (const profile of workstationProfiles) {
        await selectRadio(page, `input[data-profile="${profile}"]`);
        await expectPageAndElementsToFit(page, [
          '[data-ws-map]',
          '.ws-map__profile',
          '#ws-profile-inspector',
          '#ws-profile-inspector [data-profile-groups]',
          '#ws-profile-inspector [data-profile-groups] > *',
        ]);
      }

      for (const layer of await page.locator('input[data-layer]').all()) {
        const id = await layer.getAttribute('data-layer');
        await selectRadio(page, `[data-layer="${id}"]`);
        await expectPageAndElementsToFit(page, ['[data-ws-map]', '#ws-layer-inspector']);
      }

      for (const stage of await page.locator('[data-boot] [data-stage-index]').all()) {
        await stage.click();
        await expectPageAndElementsToFit(page, ['[data-ws-map]', '[data-boot]', '.ws-map__stage-cmd']);
      }

      await expectPageAndElementsToFit(page, ['[data-ws-map]', '.ws-map__health', '.ws-map__health-list']);
    });

    test(`Create Awesome families and details reflow at ${viewport.width}px`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setViewportSize(viewport);
      await page.goto('/create-awesome');

      await expect(page.locator('[data-ca-static-fallback]')).toBeHidden();
      await expect(page.locator('[data-ca-composer]')).toBeVisible();
      await expect(page.locator('.ca-world__stations')).toBeVisible();

      for (const family of createFamilies) {
        await selectRadio(page, `[data-ca-station="${family}"]`);
        const panel = page.locator(`[data-ca-panel="${family}"]`);
        const select = panel.locator('[data-ca-template]');
        const longestTemplate = await select.locator('option').evaluateAll((options) =>
          options
            .map((option) => ({ value: (option as HTMLOptionElement).value, text: option.textContent ?? '' }))
            .sort((a, b) => b.text.length - a.text.length)
            .at(0),
        );
        if (longestTemplate) await select.selectOption(longestTemplate.value);

        const longestAddon = await panel.locator('[data-ca-addon]').evaluateAll((inputs) =>
          inputs
            .map((input) => (input as HTMLInputElement).value)
            .sort((a, b) => b.length - a.length)
            .at(0),
        );
        if (longestAddon) {
          await panel.locator(`[data-ca-addon][value="${longestAddon}"]`).evaluate((element: HTMLInputElement) => {
            element.checked = true;
            element.dispatchEvent(new Event('change', { bubbles: true }));
          });
        }

        await expect(page.locator(`[data-ca-panel="${family}"]`)).toBeVisible();
        await expect(page.locator('[data-ca-command]')).toContainText(family === 'node' ? 'awesome-node' : family);
        await expectPageAndElementsToFit(page, [
          '[data-ca-world]',
          '.ca-composer',
          '[data-ca-composer]',
          `[data-ca-panel="${family}"]`,
          `[data-ca-panel="${family}"] > label`,
          `[data-ca-panel="${family}"] [data-ca-template]`,
          `[data-ca-panel="${family}"] .ca-composer__addons`,
          `[data-ca-panel="${family}"] .ca-composer__addons label`,
          `[data-ca-panel="${family}"] .ca-composer__addons code`,
          '.ca-composer__preview',
        ]);
      }

      await page.locator('.ca-world__fold').evaluate((element: HTMLDetailsElement) => {
        element.open = true;
      });
      const table = page.locator('.ca-table-wrap');
      await expect(table).toBeVisible();
      await expectPageAndElementsToFit(page, ['[data-ca-world]', '.ca-world__fold', '.ca-table-wrap']);
      await expect(table).toHaveAttribute('role', 'region');
      await expect(table).toHaveAttribute('aria-label', 'Create Awesome family comparison');

      if (viewport.width <= 390) {
        await page.locator('.ca-world__fold summary').focus();
        await page.keyboard.press('Tab');
        await expect(table).toBeFocused();
        await page.keyboard.press('ArrowRight');
        await expect.poll(() => table.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
      }
    });
  }

  test('Create Awesome updates the enhanced composer after successful initialization', async ({ page }) => {
    await page.goto('/create-awesome');

    await expect(page.locator('[data-ca-composer]')).toHaveAttribute('data-ca-ready', 'true');
    await expect(page.locator('[data-ca-world]')).toHaveAttribute('data-ca-enhanced', 'true');
    await selectRadio(page, '[data-ca-station="python"]');
    await page.locator('[data-ca-project]').fill('truthful-project');

    await expect(page.locator('[data-ca-command]')).toContainText(
      'uvx create-awesome-python-app@latest truthful-project',
    );
    await expect(page.locator('#ca-runtime-inspector .vf-inspector__title')).toHaveText('create-awesome-python-app');
  });

  test('Create Awesome keeps the static fallback if enhancement initialization fails', async ({ page }) => {
    await page.addInitScript(() => {
      const original = EventTarget.prototype.addEventListener;
      EventTarget.prototype.addEventListener = function (type, listener, options) {
        if (this instanceof HTMLFormElement && this.matches('[data-ca-composer]') && type === 'change') {
          throw new Error('Intentional composer initialization failure');
        }
        return original.call(this, type, listener, options);
      };
    });
    await page.goto('/create-awesome');

    await expect(page.locator('[data-ca-static-fallback]')).toBeVisible();
    await expect(page.locator('[data-ca-composer]')).toBeHidden();
    await expect(page.locator('.ca-world__stations')).toBeHidden();
    await expect(page.locator('[data-ca-command]:visible')).toHaveCount(0);
  });

  test('Create Awesome keeps the static fallback for incomplete bootstrap data', async ({ page }) => {
    await page.addInitScript(() => {
      const originalParse = JSON.parse;
      JSON.parse = function (text, reviver) {
        const parsed = originalParse(text, reviver);
        if (typeof text === 'string' && text.includes('"families"') && parsed?.families) {
          delete parsed.families.python;
        }
        return parsed;
      };
    });
    await page.goto('/create-awesome');

    await expect(page.locator('[data-ca-static-fallback]')).toBeVisible();
    await expect(page.locator('[data-ca-composer]')).toBeHidden();
    await expect(page.locator('.ca-world__stations')).toBeHidden();
    await expect(page.locator('[data-ca-command]:visible')).toHaveCount(0);
  });
});

test.describe('PR 1 no-JavaScript baseline', () => {
  test.use({ javaScriptEnabled: false });

  for (const viewport of viewports) {
    test(`Create Awesome is truthful without JavaScript at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/create-awesome');

      const fallback = page.locator('[data-ca-static-fallback]');
      await expect(fallback).toBeVisible();
      await expect(fallback.locator('[data-ca-static-family]')).toHaveCount(3);
      await expect(fallback.locator('a')).toHaveCount(6);
      await expect(page.locator('[data-ca-composer]')).toBeHidden();
      await expect(page.locator('.ca-world__stations')).toBeHidden();
      await expect(page.locator('[data-ca-command]:visible')).toHaveCount(0);
      await expect(page.locator('[data-ca-composer] input:visible, [data-ca-composer] select:visible')).toHaveCount(0);
      expect(
        await fallback.locator('a').evaluateAll((links) => links.map((link) => link.getAttribute('href'))),
      ).toEqual([
        'https://create-awesome-node-app.vercel.app',
        'https://github.com/Create-Node-App/create-node-app',
        'https://create-awesome-python-app.vercel.app',
        'https://github.com/Create-Python-App/create-python-app',
        'https://create-awesome-vlang-app.vercel.app',
        'https://github.com/Create-Vlang-App/create-vlang-app',
      ]);
      await expectPageAndElementsToFit(page, [
        '[data-ca-world]',
        '.ca-composer',
        '[data-ca-static-fallback]',
        '[data-ca-static-family]',
        '[data-ca-static-family] code',
      ]);
    });
  }
});
