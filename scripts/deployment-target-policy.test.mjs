import { describe, expect, it } from 'vitest';
import { getDeploymentTarget } from './deployment-target-policy.mjs';

const productionUrl = 'https://www.ulises-jeremias.dev';
const deploymentUrl = 'https://website-odsf-9nvb6mvol-create-node-app.vercel.app';
const branchPreviewUrl = 'https://website-odsf-git-feature-create-node-app.vercel.app';
const credentialUrl = new URL(branchPreviewUrl);
credentialUrl.username = 'user';
credentialUrl.password = 'password';

describe('deployment target policy', () => {
  it('accepts the public production origin without a preview bypass', () => {
    expect(getDeploymentTarget(productionUrl)).toEqual({
      isProduction: true,
      isProjectDeployment: false,
      usePreviewBypass: false,
    });
  });

  it('accepts a Vercel deployment alias without enabling a bypass', () => {
    expect(getDeploymentTarget(deploymentUrl)).toEqual({
      isProduction: false,
      isProjectDeployment: true,
      usePreviewBypass: false,
    });
  });

  it('requires explicit preview mode before enabling a bypass', () => {
    expect(getDeploymentTarget(branchPreviewUrl, { preview: true }).usePreviewBypass).toBe(true);
  });

  it.each([productionUrl, deploymentUrl])('rejects preview mode for non-preview URL: %s', (value) => {
    expect(() => getDeploymentTarget(value, { preview: true })).toThrow(
      'DEPLOYMENT_PREVIEW=true requires an approved Vercel branch preview URL',
    );
  });

  it.each([
    'https://example.com',
    'http://website-odsf-git-feature-create-node-app.vercel.app',
    credentialUrl.toString(),
    'https://@www.ulises-jeremias.dev',
    'https://www.ulises-jeremias.dev:443',
    'https://website-odsf-git-feature-create-node-app.vercel.app:8443',
  ])('rejects an unapproved deployment URL: %s', (value) => {
    expect(() => getDeploymentTarget(value)).toThrow('not an approved HTTPS deployment');
  });
});
