import { expect, test } from '@playwright/test';

test.describe('Blog empty state', () => {
  test('gives the field-notes desk a readable editorial share on desktop', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('/blog/');

    const desk = page.locator('.empty-desk');
    const deskBounds = await desk.boundingBox();
    expect(deskBounds?.width).toBeGreaterThanOrEqual(400);
    await expect(desk).toHaveAccessibleName(/night desk with a terminal waiting for the first entry/);
    await expect(desk.locator('.ed-terminal__cmd')).toHaveText('$ notes new --topic');
    await expect(desk.locator('.ed-pad__label')).toHaveText('next note');
    await expect(desk).toHaveScreenshot('blog-empty-desk-desktop.png', { animations: 'disabled' });
  });

  test('reveals an honest, keyboard-operable publication path', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('/blog/');

    const path = page.locator('.blog-path');
    const summary = path.locator('summary');
    await expect(summary).toHaveText('Trace the publication path');
    await expect(summary).toHaveCSS('min-block-size', '44px');
    await expect(path).not.toHaveAttribute('open', '');

    await summary.focus();
    await page.keyboard.press('Enter');
    await expect(path).toHaveAttribute('open', '');
    await expect(path.locator('.blog-path__steps li')).toHaveCount(3);
    await expect(path).toContainText('Work ships');
    await expect(path).toContainText('Sources check out');
    await expect(path).toContainText('A note lands');
    await expect(path).toContainText('explanatory, not live');
    await expect(path.locator('.blog-path__track span')).toHaveCSS('display', 'none');
    await summary.evaluate((element) => (element as HTMLElement).blur());
    await expect(path).toHaveScreenshot('blog-publication-path-desktop.png');
  });

  test('keeps the publication path available without JavaScript', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/blog/');
    const path = page.locator('.blog-path');
    await expect(path.locator('summary')).toBeVisible();
    await path.locator('summary').click();
    await expect(path).toHaveAttribute('open', '');
    await expect(path).toContainText('Sources check out');
    await context.close();
  });

  for (const width of [320, 390]) {
    test(`keeps publication routes usable at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto('/blog/');

      await expect(page.locator('.blog-page__contract')).toContainText('desk open');
      await expect(page.locator('.blog-empty')).toBeVisible();
      await expect(page.locator('.blog-empty__routes li')).toHaveCount(3);
      await expect(page.locator('.blog-empty__routes')).toContainText('Explore the current work');
      await expect(page.locator('.blog-empty__routes a')).toHaveCount(3);
      const publicationPath = page.locator('.blog-path');
      await publicationPath.locator('summary').click();
      await expect(publicationPath.locator('.blog-path__steps li')).toHaveCount(3);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      if (width === 320) {
        await expect(page.locator('.blog-empty')).toHaveScreenshot('blog-empty-publication-path-320.png');
      }

      for (const link of await page.locator('.blog-empty__routes a').all()) {
        await expect(link).toBeVisible();
        await expect(link).toHaveCSS('min-block-size', '44px');
      }
    });
  }
});
