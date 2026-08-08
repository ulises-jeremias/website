/**
 * Astro integration — warn when production builds use a non-canonical site host.
 */

const PRODUCTION_SITE_URL = 'https://www.ulises-jeremias.dev';
const PRODUCTION_HOSTS = new Set(['www.ulises-jeremias.dev', 'ulises-jeremias.dev']);

function auditSiteUrl(siteUrl, { production }) {
  const warnings = [];
  if (!siteUrl) {
    if (production) {
      warnings.push({
        level: 'warn',
        message: `[seo] Astro site URL is unset. Prefer ${PRODUCTION_SITE_URL}/ for production canonicals.`,
      });
    }
    return warnings;
  }

  let parsed;
  try {
    parsed = new URL(siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`);
  } catch {
    warnings.push({ level: 'error', message: `[seo] Invalid site URL: ${siteUrl}` });
    return warnings;
  }

  if (parsed.protocol !== 'https:') {
    warnings.push({ level: 'warn', message: `[seo] Site URL should use https: got ${parsed.protocol}` });
  }

  if (production && !PRODUCTION_HOSTS.has(parsed.hostname)) {
    warnings.push({
      level: 'warn',
      message: `[seo] Production site host is "${parsed.hostname}". Canonical host should be www.ulises-jeremias.dev.`,
    });
  }

  if (production && parsed.hostname === 'ulises-jeremias.dev') {
    warnings.push({
      level: 'warn',
      message: `[seo] Apex host without www. Prefer ${PRODUCTION_SITE_URL}/ and 301 apex → www.`,
    });
  }

  return warnings;
}

export function siteUrlGuard() {
  return {
    name: 'digital-nest-site-url-guard',
    hooks: {
      'astro:config:done': ({ config, logger }) => {
        const site = config.site ? String(config.site) : undefined;
        const isProd = process.env.NODE_ENV === 'production' || process.argv.includes('build');
        for (const warning of auditSiteUrl(site, { production: isProd })) {
          if (warning.level === 'error') logger.error(warning.message);
          else logger.warn(warning.message);
        }
        if (isProd && site) {
          logger.info(`Canonical production host preference: ${PRODUCTION_SITE_URL}/`);
        }
      },
    },
  };
}
