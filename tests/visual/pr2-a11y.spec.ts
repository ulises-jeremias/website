import { expect, test } from '@playwright/test';

const semanticRoutes = ['/dotfiles', '/agentic-workstation', '/agent-toolkit', '/community', '/projects'] as const;

test.describe('PR 2 value and group semantics', () => {
  for (const width of [390, 1440]) {
    test(`exposes valid value and group semantics at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });

      for (const route of semanticRoutes) {
        await page.goto(route);

        const meters = page.locator('.vf-meter');
        for (const meter of await meters.all()) {
          await expect(meter).toHaveAttribute('role', 'progressbar');
          await expect(meter).toHaveAttribute('aria-label');
          await expect(meter).toHaveAttribute('aria-valuemin', '0');
          await expect(meter).toHaveAttribute('aria-valuemax', '100');
          await expect(meter).toHaveAttribute('aria-value' + 'now', /^(?:100|[0-9]{1,2})$/);
          await expect(meter).toHaveAttribute('aria-value' + 'text');
        }

        await expect(page.locator('.df-world__fact-line')).toHaveCount(route === '/dotfiles' ? 1 : 0);
        await expect(page.locator('.df-world__fact-line[aria-label]')).toHaveCount(0);
        await expect(page.locator('.atk-nexus__domains[aria-label]')).toHaveCount(0);
        await expect(page.locator('.atk-swarm__budget[aria-label]')).toHaveCount(0);
        await expect(page.locator('.cm-plaza__incubating[aria-label]')).toHaveCount(0);
        await expect(page.locator('.projects-ledger__badge[aria-label]')).toHaveCount(0);
      }
    });
  }

  test('keeps the Workstation meter synchronized after selecting a later boot stage', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/agentic-workstation');

    const meter = page.locator('[data-boot] .vf-meter');
    await page.locator('[data-boot] [data-stage-index="3"]').click();

    await expect(meter).toHaveAttribute('aria-value' + 'now', '67');
    await expect(meter).toHaveAttribute('aria-value' + 'text', 'Step 4/6');
    await expect(meter.locator('[data-vf-meter-value]')).toHaveText('Step 4/6');
  });

  test('pairs the boot sequence with the Workstation overview on wide screens', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/agentic-workstation');

    const intro = page.locator('.ws-map__intro');
    const bootConsole = page.locator('.ws-map__hero-console');
    await expect(intro).toBeVisible();
    await expect(bootConsole).toBeVisible();
    await expect(bootConsole.getByRole('heading', { name: 'Boot sequence (illustrative)' })).toBeVisible();
    await page.waitForTimeout(2600);
    await expect(page.locator('[data-boot] .vf-meter')).toHaveAttribute('aria-valuetext', 'Step 1/6');

    const { introRight, consoleLeft } = await page.evaluate(() => ({
      introRight: document.querySelector('.ws-map__intro')!.getBoundingClientRect().right,
      consoleLeft: document.querySelector('.ws-map__hero-console')!.getBoundingClientRect().left,
    }));
    expect(consoleLeft).toBeGreaterThanOrEqual(introRight);

    await page.setViewportSize({ width: 390, height: 844 });
    await expect(bootConsole).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    const [consoleTop, railTop] = await Promise.all([
      bootConsole.evaluate((element) => element.getBoundingClientRect().top),
      page.locator('.ws-map__header-rail').evaluate((element) => element.getBoundingClientRect().top),
    ]);
    expect(consoleTop).toBeLessThan(railTop);
  });

  test('exposes the Projects ledger as named articles rather than a fake table', async ({ page }) => {
    await page.goto('/projects');

    const ledger = page.getByTestId('projects-ledger');
    await expect(ledger.locator('[role="table"], [role="row"], [role="cell"], [role="columnheader"]')).toHaveCount(0);
    const articles = ledger.locator('article');
    expect(await articles.count()).toBeGreaterThan(0);
    for (const article of await articles.all()) {
      await expect(article).toHaveAttribute('aria-labelledby', /project-.+-title/);
      await expect(article.locator('h4[id]')).toHaveCount(1);
    }
  });

  test('restores high-contrast focus on atlas and project links', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });

    for (const target of [
      { route: '/', selector: '.atlas-world' },
      { route: '/projects', selector: '.archipelago__link' },
      { route: '/projects', selector: '.projects-ledger__row h4 a' },
    ]) {
      await page.goto(target.route);
      const link = page.locator(target.selector).first();
      await link.focus();
      const outline = await link.evaluate((element) => {
        const style = getComputedStyle(element);
        return { style: style.outlineStyle, width: Number.parseFloat(style.outlineWidth) };
      });
      expect(outline.style).not.toBe('none');
      expect(outline.width).toBeGreaterThanOrEqual(2);
    }
  });

  test('outlines the visible Agent Toolkit family proxy in forced colors', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
    await page.goto('/agent-toolkit');

    await page.locator('#atk-family-agents').focus();
    const outline = await page.locator('label[for="atk-family-agents"]').evaluate((element) => {
      const style = getComputedStyle(element);
      return { style: style.outlineStyle, width: Number.parseFloat(style.outlineWidth) };
    });
    expect(outline.style).not.toBe('none');
    expect(outline.width).toBeGreaterThanOrEqual(2);
  });

  test('keeps forced-colors focus visible on the newer portfolio routes', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });

    for (const target of [
      { route: '/about', selector: 'a[href="/projects"]' },
      { route: '/agentic', selector: 'a[href="/agent-toolkit"]' },
      { route: '/open-source', selector: 'a' },
    ]) {
      await page.goto(target.route);
      const link = page.locator(target.selector).first();
      await link.focus();
      const outline = await link.evaluate((element) => {
        const style = getComputedStyle(element);
        return { style: style.outlineStyle, width: Number.parseFloat(style.outlineWidth) };
      });
      expect(outline.style, `${target.route} focus outline`).not.toBe('none');
      expect(outline.width).toBeGreaterThanOrEqual(2);
    }
  });
});

test.describe('PR 2 keyboard-scrollable install code', () => {
  for (const width of [320, 390, 1440]) {
    test(`names and focuses the install command at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/agent-toolkit');

      const command = page.locator('#install-panel > pre');
      await expect(command).toHaveAttribute('role', 'region');
      await expect(command).toHaveAttribute('tabindex', '0');
      await expect(command).toHaveAttribute('aria-label', 'Install command');
      await expect(command).toHaveAttribute('aria-described' + 'by', 'install-scroll-hint');
      await expect(page.locator('#install-scroll-hint')).toBeVisible();
      await expect(page.locator('[data-install-copy]')).toBeVisible();

      const overflow = await command.evaluate((element) => element.scrollWidth > element.clientWidth + 1);
      await command.focus();
      await expect(command).toBeFocused();
      if (overflow) {
        await page.keyboard.press('ArrowRight');
        await expect.poll(() => command.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
      }
    });
  }

  test('preserves the named code region in forced colors', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
    await page.goto('/agent-toolkit');
    const command = page.locator('#install-panel > pre');
    await command.focus();
    await expect(command).toBeFocused();
    await expect(command).toHaveAttribute('aria-label', 'Install command');
  });
});
