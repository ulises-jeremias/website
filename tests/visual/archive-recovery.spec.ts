import { expect, test } from '@playwright/test';

test.describe('Archive and recovery routes', () => {
  for (const width of [320, 360, 390]) {
    test(`keeps archive reading and recovery paths usable at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.emulateMedia({ reducedMotion: 'reduce' });

      await page.goto('/projects/');
      await expect(page.locator('#work-title')).toHaveText('What I build');
      await expect(page.locator('.work-header__readout')).toContainText('Areas');
      await expect(page.locator('[data-projects-row]')).not.toHaveCount(0);
      // Work tiers (#404): featured → maintained → selected → labs precede the ledger.
      await expect(page.locator('[data-testid="work-tiers"]')).toContainText('Flagship systems');
      await expect(page.locator('[data-testid="work-tiers"]')).toContainText('Recoil DevTools');
      await expect(page.locator('.work-tiers__plate')).toHaveCount(4);
      await expect(page.locator('.work-tiers__plate').first()).toBeVisible();
      await expect(page.locator('.work-tiers__featured-grid')).toHaveAttribute(
        'aria-label',
        'Four flagship work areas',
      );
      const atlasRail = await page.locator('.work-tiers__featured-grid').evaluate((list) => {
        const rail = getComputedStyle(list, '::before');
        return { width: Number.parseFloat(rail.width), height: Number.parseFloat(rail.height) };
      });
      expect(atlasRail.width).toBeLessThanOrEqual(2);
      expect(atlasRail.height).toBeGreaterThan(100);
      const firstAreaCopyWidth = await page
        .locator('.work-tiers__plate-main')
        .first()
        .evaluate((copy) => copy.getBoundingClientRect().width);
      expect(firstAreaCopyWidth).toBeGreaterThan(width < 380 ? 200 : 150);
      await expect(page.locator('.archipelago__header')).toContainText('Explore project worlds');
      expect(
        await page.evaluate(() => {
          const tiers = document.querySelector('[data-testid="work-tiers"]');
          const worlds = document.querySelector('[data-testid="projects-archipelago"]');
          return Boolean(tiers && worlds && tiers.compareDocumentPosition(worlds) & Node.DOCUMENT_POSITION_FOLLOWING);
        }),
      ).toBe(true);

      await page.goto('/open-source/');
      await expect(page.locator('#constellation-title')).toHaveText('Open-source evidence');
      await expect(page.locator('[data-testid="oss-ledger"]')).toContainText('Primary record');
      await expect(page.locator('[data-testid="oss-row"]')).not.toHaveCount(0);
      await expect(page.locator('.constellation__lane-link')).toHaveCount(4);
      await expect(page.locator('.oss-ledger__group')).toHaveCount(4);
      for (const kind of ['owned', 'maintained', 'org', 'external']) {
        const lane = page.locator(`.constellation__lane-link[href="#evidence-${kind}"]`);
        const group = page.locator(`#evidence-${kind}`);
        await expect(lane).toBeVisible();
        await expect(group).toContainText(/record/);
        if (kind === 'owned') {
          await lane.focus();
          await expect(lane).toBeFocused();
          await expect(lane).toHaveCSS('outline-style', 'solid');
          await lane.press('Enter');
        } else {
          await lane.click();
        }
        await expect(group).toBeInViewport();
        await expect(group).not.toHaveAttribute('data-tracing', 'true');
        expect(
          await group.evaluate((target) =>
            [...target.querySelectorAll<HTMLElement>('*')].some((element) => element.getAnimations().length > 0),
          ),
        ).toBe(false);
        const headerHeight = await page
          .locator('.site-header')
          .evaluate((header) => header.getBoundingClientRect().height);
        const groupTop = await group.evaluate((section) => section.getBoundingClientRect().top);
        expect(groupTop).toBeGreaterThanOrEqual(headerHeight);
      }

      await page.goto('/404.html');
      await expect(page.locator('#lost-title')).toHaveText('This world is unlisted');
      await expect(page.locator('.lost-world__console')).toContainText('Recovery console');
      await expect(page.locator('.lost-world__atlas-link')).not.toHaveCount(0);
      await expect(page.locator('.lost-world__atlas-link code').first()).toBeVisible();
    });
  }
});

test('traces the selected evidence lane into its ledger rows on request', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/open-source/');

  const lane = page.locator('.constellation__lane-link[href="#evidence-maintained"]');
  const group = page.locator('#evidence-maintained');
  const status = page.locator('[data-evidence-trace-status]');
  await lane.click();

  await expect(page).not.toHaveURL(/#evidence-maintained$/);
  await expect
    .poll(() =>
      lane
        .locator('.constellation__lane-marker')
        .evaluateAll((markers) =>
          markers.some((marker) => marker.getAnimations().some((animation) => animation.playState === 'running')),
        ),
    )
    .toBe(true);
  await expect(page).toHaveURL(/#evidence-maintained$/);
  await expect(group).toBeInViewport();
  await expect(status).toHaveText('Tracing 3 maintained records into the evidence ledger.');
  await expect(group).toBeFocused();
  await expect(group).toHaveAttribute('data-tracing', 'true');
  await expect
    .poll(() =>
      group
        .locator('[data-evidence-trace-row]')
        .evaluateAll(
          (rows) =>
            rows.filter((row) => row.getAnimations().some((animation) => animation.playState === 'running')).length,
        ),
    )
    .toBeGreaterThan(0);
});

test('keeps evidence lane navigation native when JavaScript is disabled', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();

  await page.goto('/open-source/');
  await page.locator('.constellation__lane-link[href="#evidence-org"]').click();

  await expect(page).toHaveURL(/#evidence-org$/);
  await expect(page.locator('#evidence-org')).toBeInViewport();
  await context.close();
});

test('connects the four flagship work areas on wide screens', async ({ page }) => {
  for (const width of [768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/projects/');

    const areas = page.locator('.work-tiers__featured-grid');
    await expect(areas.locator('.work-tiers__plate')).toHaveCount(4);
    const rail = await areas.evaluate((list) => {
      const style = getComputedStyle(list, '::before');
      return { width: Number.parseFloat(style.width), height: Number.parseFloat(style.height) };
    });
    expect(rail.width).toBeGreaterThan(100);
    expect(rail.height).toBeLessThanOrEqual(2);
    expect(
      await page.evaluate(() => Math.max(document.body.scrollWidth, document.documentElement.scrollWidth)),
    ).toBeLessThanOrEqual(width);
  }
});

for (const viewport of [
  { label: 'mobile-390', width: 390, height: 844 },
  { label: 'desktop-1440', width: 1440, height: 1100 },
]) {
  test(`protects the archive tables at ${viewport.label}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.emulateMedia({ reducedMotion: 'reduce' });

    await page.goto('/projects/');
    await page.addStyleTag({ content: '.site-header { position: static !important; }' });
    for (const section of await page.locator('[data-projects-group-section]').all()) {
      const group = (await section.getAttribute('data-group')) ?? 'unknown';
      await section.scrollIntoViewIfNeeded();
      await expect(page).toHaveScreenshot(`projects-${group}-${viewport.label}.png`, {
        animations: 'disabled',
        maxDiffPixelRatio: 0.07,
      });
    }

    await page.goto('/open-source/');
    await page.addStyleTag({ content: '.site-header { position: static !important; }' });
    await page.locator('.oss-ledger__group').first().scrollIntoViewIfNeeded();
    await expect(page).toHaveScreenshot(`open-source-ledger-${viewport.label}.png`, {
      animations: 'disabled',
      maxDiffPixelRatio: 0.07,
    });
  });
}
