import { expect, test } from '@playwright/test';

test('Agent Toolkit keeps its distribution index without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  try {
    await page.goto('/agent-toolkit');

    const index = page.locator('[data-atk-static-index]');
    await expect(index).toBeVisible();
    const controls = page.locator('.atk-nexus__family-controls');
    await expect(controls).toHaveAttribute('disabled', '');
    await expect(index.locator('.atk-nexus__static-families li')).toHaveCount(6);
    await expect(index.locator('.atk-nexus__static-targets li')).toHaveCount(7);
    for (const radio of await controls.locator('input[type="radio"]').all()) {
      await expect(radio).toBeDisabled();
    }
    for (const label of ['Skills', 'Agents', 'Loops', 'Packs', 'Plugins', 'MCP', 'Claude Code', 'Copilot']) {
      await expect(index).toContainText(label);
    }
    await expect(index).toContainText('profiles/cursor/rules/*.mdc');
  } finally {
    await context.close();
  }
});
