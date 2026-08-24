import { expect, test } from '@playwright/test';

test.describe('PR6b Agent Toolkit capability-nexus convergence', () => {
  test('keeps the nexus SVG visual-only with native radio state', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/agent-toolkit');

    const root = page.locator('[data-atk-nexus]');
    const svg = root.locator('.atk-nexus__svg');

    await expect(svg).toHaveAttribute('aria-hidden', 'true');
    await expect(svg).toHaveAttribute('focusable', 'false');
    await expect(svg.locator('[role], [tabindex], [aria-pressed]')).toHaveCount(0);

    const radios = root.locator('input[name="atk-family"]');
    await expect(radios).toHaveCount(6);
    await expect(root.locator('input[name="atk-family"]:checked')).toHaveCount(1);
    await expect(root.locator('.atk-nexus__inspector')).not.toHaveAttribute('aria-live', /.+/);

    const status = page.locator('[data-atk-family-status]');
    await expect(status).toHaveAttribute('role', 'status');
    await expect(status).toHaveAttribute('aria-atomic', 'true');
  });

  test('converges keyboard and pointer input on native radio state', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/agent-toolkit');

    const skills = page.locator('#atk-family-skills');
    const agents = page.locator('#atk-family-agents');

    await skills.focus();
    await page.keyboard.press('ArrowRight');

    await expect(agents).toBeChecked();
    await expect(agents).toBeFocused();
    await expect(page.locator('[data-family-panel="agents"]')).toBeVisible();
    await expect(page.locator('[data-family-panel="skills"]')).toBeHidden();
    await expect(page.locator('[data-family-mark="agents"]')).toHaveClass(/is-active/);
    await expect(page.locator('[data-atk-family-status]')).toContainText('Capability family selected:');
    await expect(page.locator('[data-atk-family-status]')).toHaveText(
      'Capability family selected: Agents — 17 catalog items.',
    );

    await page.locator('label[for="atk-family-loops"]').click();
    await expect(page.locator('#atk-family-loops')).toBeChecked();
    await expect(page.locator('[data-family-panel="loops"]')).toBeVisible();
    await expect(page.locator('[data-family-mark="loops"]')).toHaveClass(/is-active/);
    await expect(page.locator('[data-atk-family-status]')).toContainText('Loops');
  });
});
