import { expect, test } from '@playwright/test';

test.describe('About systems-builder story', () => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    test(`keeps the identity and five-stage path readable at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/about');

      await expect(page.getByRole('heading', { level: 1, name: 'Ulises Jeremias' })).toBeVisible();
      await expect(page.getByText('Solutions Architect @ NaNLABS · open-source builder')).toBeVisible();

      const path = page.getByTestId('about-build-path');
      const stops = path.locator('ol > li');
      await expect(stops).toHaveCount(5);
      await expect(path.getByRole('link')).toHaveText([
        'Developer tooling',
        'V + scientific computing',
        'App composition',
        'Linux systems',
        'Agentic workflows',
      ]);
      const nodeColors = await path
        .locator('.about-path__node')
        .evaluateAll((nodes) => nodes.map((node) => getComputedStyle(node).color));
      expect(new Set(nodeColors).size).toBe(5);

      const documentWidth = await page.locator('body').evaluate((element) => element.scrollWidth);
      expect(documentWidth, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(width);

      const stopTops = await stops.evaluateAll((items) =>
        items.map((item) => Math.round(item.getBoundingClientRect().top)),
      );
      expect(stopTops).toEqual([...stopTops].sort((a, b) => a - b));
      expect(new Set(stopTops).size).toBe(width <= 1120 ? 5 : 1);

      const stations = page.getByTestId('about-trajectory').locator(':scope > li');
      await expect(stations).toHaveCount(5);
      for (const station of await stations.all()) {
        await expect(station.locator('article')).toBeVisible();
      }
    });
  }

  test('keeps role groups, provenance, principles, and contact in static page content', async ({ page }) => {
    await page.goto('/about');

    await expect(page.getByRole('heading', { level: 2, name: 'Roles and provenance' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 3, name: 'Work', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { level: 3, name: 'Open source', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { level: 3, name: 'Community', exact: true })).toBeVisible();
    await expect(page.getByText(/work I own, work I maintain within organizations/i)).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'What I care about' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'ulisescf.24@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:ulisescf.24@gmail.com',
    );
  });

  test('preserves visible keyboard focus and the static path in forced colors', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
    await page.goto('/about');

    const link = page.getByRole('link', { name: 'Developer tooling' });
    await link.focus();
    const outline = await link.evaluate((element) => {
      const style = getComputedStyle(element);
      return { style: style.outlineStyle, width: Number.parseFloat(style.outlineWidth) };
    });

    expect(outline.style).not.toBe('none');
    expect(outline.width).toBeGreaterThanOrEqual(2);
    await expect(page.getByTestId('about-trajectory').locator(':scope > li')).toHaveCount(5);
  });
});
