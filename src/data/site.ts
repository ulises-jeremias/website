/**
 * Site identity — production host, SEO defaults, build-time URL guards.
 * Prefer `https://www.ulises-jeremias.dev/` as the canonical apex for launch.
 */

export const PRODUCTION_SITE_URL = 'https://www.ulises-jeremias.dev';

/** Acceptable production hosts (www preferred; apex allowed as redirect source). */
export const PRODUCTION_HOSTS = new Set(['www.ulises-jeremias.dev', 'ulises-jeremias.dev']);

export const SITE_NAME = 'Digital Nest';
export const SITE_AUTHOR = 'Ulises Jeremias';
export const SITE_LOCALE = 'en_US';
export const SITE_THEME_COLOR = '#050317';
export const SITE_BACKGROUND_COLOR = '#040212';
export const DEFAULT_OG_IMAGE = '/assets/nest/hero-bg-sm.webp';
export const TWITTER_HANDLE = '@ulisesjcf';

export type SiteUrlWarning = {
  level: 'warn' | 'error';
  message: string;
};

/**
 * Validate the configured site URL for production builds.
 * Returns warnings for wrong hosts; does not throw (build continues).
 */
export function auditSiteUrl(siteUrl: string | undefined, opts?: { production?: boolean }): SiteUrlWarning[] {
  const warnings: SiteUrlWarning[] = [];
  const isProd = opts?.production ?? process.env.NODE_ENV === 'production';

  if (!siteUrl) {
    if (isProd) {
      warnings.push({
        level: 'warn',
        message: `[seo] Astro site URL is unset. Prefer ${PRODUCTION_SITE_URL}/ for production canonicals.`,
      });
    }
    return warnings;
  }

  let parsed: URL;
  try {
    parsed = new URL(siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`);
  } catch {
    warnings.push({ level: 'error', message: `[seo] Invalid site URL: ${siteUrl}` });
    return warnings;
  }

  if (parsed.protocol !== 'https:') {
    warnings.push({ level: 'warn', message: `[seo] Site URL should use https: got ${parsed.protocol}` });
  }

  if (isProd && !PRODUCTION_HOSTS.has(parsed.hostname)) {
    warnings.push({
      level: 'warn',
      message: `[seo] Production site host is "${parsed.hostname}". Canonical host should be www.ulises-jeremias.dev (configured: ${PRODUCTION_SITE_URL}).`,
    });
  }

  if (isProd && parsed.hostname === 'ulises-jeremias.dev') {
    warnings.push({
      level: 'warn',
      message: `[seo] Apex host without www. Prefer ${PRODUCTION_SITE_URL}/ and 301 apex → www.`,
    });
  }

  return warnings;
}

/** Log site URL audit results (used by Astro integration / scripts). */
export function warnOnSiteUrl(siteUrl: string | undefined, opts?: { production?: boolean }): void {
  for (const w of auditSiteUrl(siteUrl, opts)) {
    if (w.level === 'error') {
      console.error(w.message);
    } else {
      console.warn(w.message);
    }
  }
}
