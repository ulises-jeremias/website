import { expect, test } from '@playwright/test';

test.describe('Responsive system maps', () => {
  test('keeps the Toolkit to Harness relationship attached at tablet and mobile widths', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });

    for (const width of [768, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto('/agentic');

      const toolkit = page.locator('.agentic-map__station--platform');
      const connection = page.locator('.agentic-map__link--context');
      const workspace = page.locator('.agentic-map__station--workspace');
      const arrow = connection.locator('.agentic-map__arrow');

      const positions = await Promise.all([toolkit.boundingBox(), connection.boundingBox(), workspace.boundingBox()]);
      expect(positions[0]).not.toBeNull();
      expect(positions[1]).not.toBeNull();
      expect(positions[2]).not.toBeNull();
      expect(positions[1]!.y).toBeGreaterThan(positions[0]!.y);
      expect(positions[2]!.y).toBeGreaterThan(positions[1]!.y);
      await expect(arrow).toHaveCSS('transform', 'matrix(0, 1, -1, 0, 0, 0)');
    }
  });

  test('fits the three verified Dotfiles facts to the available width', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });

    for (const [width, columns] of [
      [390, 1],
      [768, 3],
    ]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto('/dotfiles');

      const facts = page.locator('.dotfiles-narrative__facts');
      await expect(facts.locator('[role="listitem"]')).toHaveCount(3);
      const columnCount = await facts.evaluate(
        (element) => getComputedStyle(element).gridTemplateColumns.split(' ').length,
      );
      expect(columnCount).toBe(columns);
    }
  });
});
