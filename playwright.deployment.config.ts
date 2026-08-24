import { defineConfig, devices } from '@playwright/test';

const deploymentBaseUrl = process.env.DEPLOYMENT_BASE_URL;

if (!deploymentBaseUrl) {
  throw new Error('DEPLOYMENT_BASE_URL is required for external deployment smoke tests.');
}

const parsedDeploymentUrl = new URL(deploymentBaseUrl);
const isProduction = parsedDeploymentUrl.origin === 'https://www.ulises-jeremias.dev';
const isProjectPreview =
  parsedDeploymentUrl.hostname.startsWith('website-odsf-git-') &&
  parsedDeploymentUrl.hostname.endsWith('-create-node-app.vercel.app');

if (
  parsedDeploymentUrl.protocol !== 'https:' ||
  parsedDeploymentUrl.username ||
  parsedDeploymentUrl.password ||
  parsedDeploymentUrl.port ||
  (!isProduction && !isProjectPreview)
) {
  throw new Error(`DEPLOYMENT_BASE_URL is not an approved HTTPS deployment, received ${deploymentBaseUrl}.`);
}

const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

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
    extraHTTPHeaders:
      bypassSecret && isProjectPreview
        ? {
            'x-vercel-protection-bypass': bypassSecret,
            'x-vercel-set-bypass-cookie': 'true',
          }
        : undefined,
    trace: 'off',
  },
  projects: [
    {
      name: 'deployment-chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
