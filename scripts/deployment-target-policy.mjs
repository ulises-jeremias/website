const PRODUCTION_ORIGIN = 'https://www.ulises-jeremias.dev';
const PROJECT_DEPLOYMENT_PATTERN = /^website-odsf-[a-z0-9-]+-create-node-app\.vercel\.app$/;
const PROJECT_BRANCH_PREVIEW_PATTERN = /^website-odsf-git-[a-z0-9-]+-create-node-app\.vercel\.app$/;

export function getDeploymentTarget(value, { preview = false } = {}) {
  let parsedUrl;
  const authority = /^[a-z][a-z\d+.-]*:\/\/([^/?#]*)/i.exec(value)?.[1] ?? '';
  const authorityHost = authority.slice(authority.lastIndexOf('@') + 1);
  const hasExplicitUserInfo = authority.includes('@');
  const hasExplicitPort = /:\d*$/.test(authorityHost);

  try {
    parsedUrl = new URL(value);
  } catch {
    throw new Error('DEPLOYMENT_BASE_URL is not an approved HTTPS deployment.');
  }

  const isProduction = parsedUrl.origin === PRODUCTION_ORIGIN;
  const isProjectDeployment = PROJECT_DEPLOYMENT_PATTERN.test(parsedUrl.hostname);
  const isProjectBranchPreview = PROJECT_BRANCH_PREVIEW_PATTERN.test(parsedUrl.hostname);

  if (
    parsedUrl.protocol !== 'https:' ||
    hasExplicitUserInfo ||
    hasExplicitPort ||
    (!isProduction && !isProjectDeployment)
  ) {
    throw new Error('DEPLOYMENT_BASE_URL is not an approved HTTPS deployment.');
  }

  if (preview && !isProjectBranchPreview) {
    throw new Error(
      'DEPLOYMENT_PREVIEW=true requires an approved Vercel branch preview URL; production and deployment aliases cannot use the preview bypass.',
    );
  }

  return {
    isProduction,
    isProjectDeployment,
    usePreviewBypass: preview && isProjectBranchPreview,
  };
}
