import { expect, test } from '@playwright/test';

const pages = [
  { route: '/dotfiles', current: 'dotfiles', next: '/hornero-os' },
  { route: '/hornero-os', current: 'hornero-os', next: '/dotfiles' },
] as const;

test.describe('HorneroConfig to Hornero OS extraction path', () => {
  for (const width of [320, 360, 390, 768, 1024, 1440]) {
    test(`keeps the shared lineage readable and in bounds at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.emulateMedia({ reducedMotion: 'reduce' });

      for (const route of pages) {
        await page.goto(route.route);
        const bridge = page.locator('[data-hornero-extraction]');

        await expect(bridge).toHaveAttribute('data-current-page', route.current);
        await expect(bridge.getByRole('heading', { level: 2 })).toHaveText(
          'From a personal desktop to a shared system',
        );
        await expect(bridge.locator('[data-stage]')).toHaveCount(3);
        await expect(bridge.locator('[data-stage="personal"]')).toContainText('daily use');
        await expect(bridge.locator('[data-stage="personal"]')).toContainText('experiments');
        await expect(bridge.locator('[data-stage="components"]')).toContainText('HorneroOS repositories own');
        await expect(bridge.locator('[data-stage="composition"]')).toContainText('pins the shell');
        await expect(bridge.locator('[data-stage="composition"]')).toContainText('builds horneroctl from');
        await expect(bridge.locator('[data-stage="composition"]')).toContainText('no installer or ISO');
        await expect(bridge.locator('.hornero-extraction__repositories a')).toHaveCount(4);
        await expect(bridge.locator(`a[href="${route.next}"]`)).toBeVisible();
        await expect(bridge.locator('.hornero-extraction__manifest-link')).toHaveAttribute(
          'href',
          'https://github.com/HorneroOS/hornero',
        );
        await expect(bridge.locator('[data-stage="personal"] [aria-current="page"]')).toHaveCount(
          route.current === 'dotfiles' ? 1 : 0,
        );
        await expect(bridge.locator('[data-stage="composition"] [aria-current="page"]')).toHaveCount(
          route.current === 'hornero-os' ? 1 : 0,
        );

        const responsiveColumns = await bridge.evaluate((element) => ({
          stages: getComputedStyle(element.querySelector('.hornero-extraction__stages')!).gridTemplateColumns.split(' ')
            .length,
          repositories: getComputedStyle(
            element.querySelector('.hornero-extraction__repositories')!,
          ).gridTemplateColumns.split(' ').length,
        }));
        expect(responsiveColumns.stages).toBe(width <= 760 ? 1 : 3);
        expect(responsiveColumns.repositories).toBe(width <= 360 ? 1 : 2);

        for (const link of await bridge.locator('.hornero-extraction__repositories a').all()) {
          const bounds = await link.boundingBox();
          expect(bounds?.height ?? 0).toBeGreaterThanOrEqual(44);
        }

        const bounds = await bridge.evaluate((element) => ({
          width: element.clientWidth,
          scrollWidth: element.scrollWidth,
          left: element.getBoundingClientRect().left,
          right: element.getBoundingClientRect().right,
          viewport: document.documentElement.clientWidth,
        }));
        expect(bounds.scrollWidth).toBeLessThanOrEqual(bounds.width + 1);
        expect(bounds.left).toBeGreaterThanOrEqual(-1);
        expect(bounds.right).toBeLessThanOrEqual(bounds.viewport + 1);
      }
    });
  }
});

test.describe('Hornero extraction path without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  for (const route of pages) {
    test(`${route.route} retains all stages and destinations as static content`, async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 844 });
      await page.goto(route.route);

      const bridge = page.locator('[data-hornero-extraction]');
      await expect(bridge.locator('ol > li')).toHaveCount(3);
      await expect(bridge.locator(`a[href="${route.next}"]`)).toBeVisible();
      await expect(bridge.getByRole('link', { name: 'Inspect the composition repository' })).toHaveAttribute(
        'href',
        'https://github.com/HorneroOS/hornero',
      );
      await expect(bridge.locator('.hornero-extraction__current')).toHaveCount(1);
    });
  }
});
