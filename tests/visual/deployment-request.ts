import type { Page } from '@playwright/test';
import { getDeploymentTarget } from '../../scripts/deployment-target-policy.mjs';

const bypassHeaderNames = ['x-vercel-protection-bypass', 'x-vercel-set-bypass-cookie'];

function getBypassHeaders(): Record<string, string> | undefined {
  const deploymentBaseUrl = process.env.DEPLOYMENT_BASE_URL;
  const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

  if (!deploymentBaseUrl || !bypassSecret) {
    return undefined;
  }

  const target = getDeploymentTarget(deploymentBaseUrl, {
    preview: process.env.DEPLOYMENT_PREVIEW === 'true',
  });

  if (!target.usePreviewBypass) {
    return undefined;
  }

  return {
    'x-vercel-protection-bypass': bypassSecret,
    'x-vercel-set-bypass-cookie': 'true',
  };
}

export function getDeploymentRequestOptions() {
  const headers = getBypassHeaders();

  return {
    maxRedirects: 0,
    ...(headers ? { headers } : {}),
  };
}

export async function configureDeploymentPage(page: Page): Promise<void> {
  const headers = getBypassHeaders();

  if (!headers) {
    return;
  }

  const deploymentOrigin = new URL(process.env.DEPLOYMENT_BASE_URL!).origin;
  await page.setExtraHTTPHeaders(headers);
  await page.route('**/*', (route) => {
    const requestHeaders = route.request().headers();
    const requestOrigin = new URL(route.request().url()).origin;

    if (requestOrigin !== deploymentOrigin) {
      for (const headerName of bypassHeaderNames) {
        delete requestHeaders[headerName];
      }
    }

    return route.continue({ headers: requestHeaders });
  });
}
