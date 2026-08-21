import { expect, test } from '@playwright/test';

test.describe('Dotfiles resilient media and copy behavior', () => {
  test('serves responsive WebP sources and keeps gallery metadata synchronized', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/dotfiles');

    const hero = page.locator('.df-world__hero-scene img');
    const galleryMain = page.locator('[data-gallery-main]');
    await expect(hero).toHaveAttribute('srcset', /\.webp 320w.+\.webp 1440w/);
    await expect(hero).toHaveAttribute('sizes');
    await expect(galleryMain).toHaveAttribute('srcset', /\.webp 320w.+\.webp 1440w/);
    await expect(galleryMain).toHaveAttribute('sizes');

    for (const thumbnail of await page.locator('.df-gallery__thumb img').all()) {
      await expect(thumbnail).toHaveAttribute('srcset', /\.webp 320w.+\.webp 1440w/);
      await expect(thumbnail).toHaveAttribute('sizes', '160px');
    }

    await page.locator('[data-gallery-id="spotlight-dark"]').click();
    await expect(galleryMain).toHaveAttribute('src', /screenshot-spotlight-dark-1440\.webp$/);
    await expect(galleryMain).toHaveAttribute('srcset', /screenshot-spotlight-dark-320\.webp 320w/);
    await expect(page.locator('[data-gallery-caption]')).toHaveText('Spotlight — dark command palette');
  });

  test('reports successful install-command copy', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: async (value: string) => {
            Reflect.set(window, '__copiedInstall', value);
          },
        },
      });
    });
    await page.goto('/dotfiles');

    const copy = page.getByRole('button', { name: 'Copy install command' });
    await expect(copy).toBeVisible();
    await copy.click();
    await expect(page.locator('[data-df-copy-status]')).toHaveText('Install command copied.');
    await expect.poll(() => page.evaluate(() => Reflect.get(window, '__copiedInstall'))).toContain('curl');
  });

  test('reports clipboard failure with a manual recovery path', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: { writeText: async () => Promise.reject(new Error('clipboard denied')) },
      });
    });
    await page.goto('/dotfiles');

    await page.getByRole('button', { name: 'Copy install command' }).click();
    await expect(page.locator('[data-df-copy-status]')).toHaveText(
      'Copy failed. Select and copy the command manually.',
    );
  });
});

test.describe('Dotfiles no-JavaScript copy fallback', () => {
  test.use({ javaScriptEnabled: false });

  test('does not expose an inert copy action', async ({ page }) => {
    await page.goto('/dotfiles');
    await expect(page.getByRole('button', { name: 'Copy install command' })).toHaveCount(0);
    await expect(page.locator('[data-df-install]')).toBeVisible();
  });
});

test.describe('Projects shareable filters', () => {
  test('restores query state and announces filtered result counts', async ({ page }) => {
    await page.goto('/projects?q=agent');

    const query = page.locator('[data-projects-query]');
    const status = page.locator('[data-projects-status]');
    await expect(query).toHaveValue('agent');
    await expect(status).toHaveText(/^[1-9]\d* projects? shown\.$/);

    const visibleRows = page.locator('[data-projects-row]:visible');
    expect(await visibleRows.count()).toBeGreaterThan(0);
    for (const row of await visibleRows.all()) {
      await expect(row).toHaveAttribute('data-search', /agent/i);
    }

    await query.fill('no-project-matches-this-query');
    await expect(status).toHaveText('0 projects shown.');
    await expect(page.locator('[data-projects-empty]')).toBeVisible();
    await expect(page).toHaveURL(/q=no-project-matches-this-query/);

    await page.reload();
    await expect(query).toHaveValue('no-project-matches-this-query');
    await expect(status).toHaveText('0 projects shown.');
  });
});

test.describe('Create Awesome truthful composer', () => {
  test('filters described addons and removes selections that conflict with the template', async ({ page }) => {
    await page.goto('/create-awesome');

    const nodePanel = page.locator('[data-ca-panel="node"]');
    const addons = nodePanel.locator('[data-ca-addon]');
    await expect(addons).toHaveCount(53);
    await expect(nodePanel.locator('[data-ca-addon-row][title]')).toHaveCount(0);
    await expect(nodePanel.locator('[data-ca-addon-row] small')).toHaveCount(53);

    const search = nodePanel.locator('[data-ca-addon-search]');
    await search.fill('drizzle postgres');
    await expect(nodePanel.locator('[data-ca-addon-row]:visible')).toHaveCount(1);
    await expect(page.locator('[data-ca-composer-status]')).toHaveText('1 addon shown.');
    await search.fill('');

    await nodePanel.locator('[data-ca-template]').selectOption('nextjs-starter');
    const tailwind = nodePanel.locator('[data-ca-addon][value="nextjs-tailwindcss"]');
    await expect(tailwind).toBeEnabled();
    await tailwind.check();
    await expect(page.locator('[data-ca-command]')).toContainText('nextjs-tailwindcss');

    await nodePanel.locator('[data-ca-template]').selectOption('nextjs-saas-ai-starter');
    await expect(tailwind).not.toBeChecked();
    await expect(tailwind).toBeDisabled();
    await expect(page.locator('[data-ca-command]')).not.toContainText('nextjs-tailwindcss');
    await expect(page.locator('[data-ca-composer-status]')).toContainText(
      'Removed incompatible addons: nextjs-tailwindcss.',
    );
  });

  test('applies a valid preset and reports command copy outcomes', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: async (value: string) => {
            Reflect.set(window, '__copiedComposerCommand', value);
          },
        },
      });
    });
    await page.goto('/create-awesome');

    const nodePanel = page.locator('[data-ca-panel="node"]');
    await nodePanel.getByRole('button', { name: 'Node SaaS AI' }).click();
    await expect(nodePanel.locator('[data-ca-template]')).toHaveValue('nextjs-starter');
    await expect(nodePanel.locator('[data-ca-addon][value="nextjs-tailwindcss"]')).toBeChecked();
    await expect(nodePanel.locator('[data-ca-addon][value="nextjs-drizzle-postgres"]')).toBeChecked();
    await expect(page.locator('[data-ca-composer-status]')).toHaveText('Node SaaS AI preset applied with 2 addons.');
    await expect(page.locator('[data-ca-command]')).toContainText(
      '--template nextjs-starter --addons nextjs-tailwindcss nextjs-drizzle-postgres',
    );

    const copy = page.getByRole('button', { name: 'Copy command' });
    await expect(copy).toBeVisible();
    await copy.click();
    await expect(page.locator('[data-ca-composer-status]')).toHaveText('Command copied.');
    await expect
      .poll(() => page.evaluate(() => Reflect.get(window, '__copiedComposerCommand')))
      .toContain('nextjs-starter');
  });

  test('does not trap the addon catalog in an internal scroller', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/create-awesome');

    const dimensions = await page.locator('[data-ca-panel="node"] .ca-composer__addons').evaluate((element) => ({
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
      overflowY: getComputedStyle(element).overflowY,
    }));
    expect(dimensions.overflowY).not.toBe('auto');
    expect(dimensions.scrollHeight).toBeLessThanOrEqual(dimensions.clientHeight + 1);
  });
});
