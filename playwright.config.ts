import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));
const visualPortValue = process.env.VISUAL_TEST_PORT ?? '4173';

if (!/^\d+$/.test(visualPortValue)) {
  throw new Error(`VISUAL_TEST_PORT must be an integer, received: ${visualPortValue}`);
}

const visualPort = Number.parseInt(visualPortValue, 10);

if (visualPort < 1024 || visualPort > 65_535) {
  throw new Error(`VISUAL_TEST_PORT must be between 1024 and 65535, received: ${visualPort}`);
}

const visualBaseURL = `http://127.0.0.1:${visualPort}`;

export default defineConfig({
  testDir: './tests/visual',
  globalSetup: './tests/visual/global-setup.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 4,
  reporter: 'list',
  use: {
    baseURL: visualBaseURL,
    colorScheme: 'dark',
    trace: 'on-first-retry',
  },
  webServer: {
    // Visual runs own a production build and never attach to an existing dev server.
    command: `pnpm build && python3 -m http.server ${visualPort} --bind 127.0.0.1 --directory dist`,
    cwd: projectRoot,
    url: visualBaseURL,
    reuseExistingServer: false,
    timeout: 180_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.04,
      animations: 'disabled',
      caret: 'hide',
    },
  },
});
