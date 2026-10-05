import { expect, test } from '@playwright/test';

test.describe('Agentic Developer Stack system map', () => {
  test('shows three distinct projects and their optional relationships on desktop', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.goto('/agentic');

    const map = page.getByRole('figure', { name: 'One capability plane, two optional extensions' });
    await expect(map).toBeVisible();
    await expect(map.getByRole('article')).toHaveCount(3);
    await expect(map.getByRole('link', { name: 'Agentic Workstation' })).toHaveAttribute(
      'href',
      '/agentic-workstation',
    );
    await expect(map.getByRole('link', { name: 'Agent Toolkit' })).toHaveAttribute('href', '/agent-toolkit');
    await expect(map.getByRole('link', { name: 'Agentic Harness' })).toHaveAttribute('href', '/agentic-harness');
    await expect(map.getByText('can install', { exact: true })).toBeVisible();
    await expect(map.getByText('uses runtime', { exact: true })).toBeVisible();
    await expect(map).toContainText('not setup requirements');

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    expect(overflow).toBe(false);
  });

  test('keeps the map and all entry paths readable without JavaScript at mobile width', async ({ page }) => {
    await page.route('**/*.js', (route) => route.abort());
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/agentic');

    const map = page.getByRole('figure', { name: 'One capability plane, two optional extensions' });
    const stations = map.getByRole('article');
    await expect(stations).toHaveCount(3);
    await expect(map.getByText('can install', { exact: true })).toBeVisible();
    await expect(map.getByText('uses runtime', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Start with the need you have' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Start with Agent Toolkit' }).first()).toBeVisible();

    const tops = await stations.evaluateAll((elements) =>
      elements.map((element) => element.getBoundingClientRect().top),
    );
    expect(tops[0]).toBeLessThan(tops[1]!);
    expect(tops[1]).toBeLessThan(tops[2]!);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    expect(overflow).toBe(false);
  });
});
