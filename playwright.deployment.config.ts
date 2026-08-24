import { defineConfig, devices } from '@playwright/test';
import { getDeploymentTarget } from './scripts/deployment-target-policy.mjs';

const deploymentBaseUrl = process.env.DEPLOYMENT_BASE_URL;

if (!deploymentBaseUrl) {
  throw new Error('DEPLOYMENT_BASE_URL is required for external deployment smoke tests.');
}

getDeploymentTarget(deploymentBaseUrl, {
  preview: process.env.DEPLOYMENT_PREVIEW === 'true',
});

export default defineConfig({
  testDir: './tests/visual',
  testMatch: /(?:production-build-smoke|deployment-headers-smoke)\.spec\.ts/,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 4,
  reporter: 'list',
  use: {
    baseURL: deploymentBaseUrl,
    colorScheme: 'dark',
    trace: 'off',
  },
  projects: [
    {
      name: 'deployment-chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
