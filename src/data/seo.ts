import { profile } from './profile.js';
import { getCanonicalUrl, getRouteByPath, getSiteUrl, type RouteMeta } from './routes.js';
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  PRODUCTION_SITE_URL,
  SITE_AUTHOR,
  SITE_LOCALE,
  SITE_NAME,
  SITE_THEME_COLOR,
  TWITTER_HANDLE,
} from './site.js';

export type PageSeoInput = {
  path: string;
  title: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogImageAlt?: string;
  noIndex?: boolean;
  world?: string;
  siteUrl?: string;
  type?: 'website' | 'article' | 'profile';
};

export type PageSeo = {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  ogImageAlt: string;
  ogImageWidth: number;
  ogImageHeight: number;
  ogType: 'website' | 'article' | 'profile';
  robots: string;
  themeColor: string;
  author: string;
  locale: string;
  siteName: string;
  twitterCard: 'summary_large_image';
  twitterSite?: string;
  twitterCreator?: string;
  world?: string;
  jsonLd: Record<string, unknown>[];
};

function absolutize(urlOrPath: string, siteUrl: string): string {
  if (/^https?:\/\//i.test(urlOrPath)) return urlOrPath;
  return new URL(urlOrPath.startsWith('/') ? urlOrPath : `/${urlOrPath}`, `${siteUrl}/`).toString();
}

function websiteJsonLd(siteUrl: string): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: `${siteUrl}/`,
    description: profile.summary,
    author: { '@type': 'Person', name: SITE_AUTHOR, url: siteUrl },
    inLanguage: 'en',
  };
}

function personJsonLd(siteUrl: string): Record<string, unknown> {
  const sameAs = [profile.links.github, profile.links.linkedin, profile.links.discord];
  if (profile.links.twitter) sameAs.push(profile.links.twitter);
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    url: siteUrl,
    jobTitle: profile.title,
    homeLocation: { '@type': 'Place', name: profile.location },
    sameAs,
  };
}

function collectionJsonLd(input: PageSeoInput, siteUrl: string, route?: RouteMeta): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': route?.structuredDataType ?? 'CollectionPage',
    name: input.title,
    description: input.description,
    url: input.canonical ?? getCanonicalUrl(input.path, siteUrl),
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: `${siteUrl}/` },
  };
}

/** Build a complete SEO payload for a page. */
export function buildPageSeo(input: PageSeoInput): PageSeo {
  const siteUrl = getSiteUrl(input.siteUrl ?? PRODUCTION_SITE_URL);
  const route = getRouteByPath(input.path);
  const description = input.description ?? route?.description ?? profile.summary;
  const canonical = input.canonical ?? getCanonicalUrl(input.path, siteUrl);
  const ogImage = absolutize(input.ogImage ?? route?.ogImage ?? DEFAULT_OG_IMAGE, siteUrl);
  const ogImageAlt = input.ogImageAlt ?? route?.ogImageAlt ?? DEFAULT_OG_IMAGE_ALT;
  const noIndex = input.noIndex ?? route?.noIndex ?? false;
  const ogType = input.type ?? (input.path === '/' ? 'website' : 'website');

  const jsonLd: Record<string, unknown>[] = [];
  if (input.path === '/') {
    jsonLd.push(websiteJsonLd(siteUrl), personJsonLd(siteUrl));
  } else if (route?.structuredDataType) {
    jsonLd.push(collectionJsonLd(input, siteUrl, route));
  }

  return {
    title: input.title,
    description,
    canonical,
    ogImage,
    ogImageAlt,
    ogImageWidth: OG_IMAGE_WIDTH,
    ogImageHeight: OG_IMAGE_HEIGHT,
    ogType,
    robots: noIndex ? 'noindex, nofollow' : 'index, follow',
    themeColor: SITE_THEME_COLOR,
    author: SITE_AUTHOR,
    locale: SITE_LOCALE,
    siteName: SITE_NAME,
    twitterCard: 'summary_large_image',
    twitterSite: TWITTER_HANDLE,
    twitterCreator: TWITTER_HANDLE,
    world: input.world,
    jsonLd,
  };
}
