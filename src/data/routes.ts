import { z } from 'astro/zod';

/**
 * Route metadata — single source of truth for SEO, canonicals, OG, breadcrumbs.
 * Mirrors B-01 preferred IA: /, /dotfiles, /agentic-workstation, /agent-toolkit,
 * /v, /create-awesome, /community, /blog, /blog/[slug], /projects, /open-source.
 * Subdomain-ready: `path` is route-independent; `subdomain` hints future split.
 */

export const routeThemeSchema = z.enum([
  'home',
  'dotfiles',
  'workstation',
  'toolkit',
  'v',
  'create-awesome',
  'community',
  'blog',
  'projects',
  'open-source',
]);

export type RouteTheme = z.infer<typeof routeThemeSchema>;

export const structuredDataTypeSchema = z.enum(['WebSite', 'CollectionPage', 'BlogPosting', 'ProfilePage', 'ItemList']);

export const routeMetaSchema = z.object({
  id: z.string().min(1),
  /** Absolute path, e.g. "/" or "/blog". Dynamic segments use bracket notation, e.g. "/blog/[slug]". */
  path: z.string().startsWith('/'),
  /** SEO title (50-60 chars ideal, not enforced here). */
  title: z.string().min(1),
  /** SEO description (120-160 chars ideal). */
  description: z.string().min(1),
  /** Optional OG image path (absolute or root-relative). */
  ogImage: z.string().optional(),
  /** Structured-data @type hint. */
  structuredDataType: structuredDataTypeSchema.optional(),
  /** When true, emit noindex. Useful for draft/preview routes. */
  noIndex: z.boolean().default(false),
  /** Where content comes from. Route-independent for subdomain split. */
  dataSource: z.enum(['static', 'collection', 'generated', 'external']).default('static'),
  theme: routeThemeSchema.optional(),
  /** Label shown in nav; defaults to title if omitted. */
  navLabel: z.string().optional(),
  /** Order in the complete route directory; omitted means not listed. */
  navOrder: z.number().int().optional(),
  /** Order in the compact global header; omitted means represented by a parent route. */
  headerNavOrder: z.number().int().optional(),
  /** Header route that represents this route, for example project worlds → Projects. */
  headerParentId: z.string().min(1).optional(),
  /** Future subdomain, e.g. "dotfiles" → dotfiles.<domain>. */
  subdomain: z.string().optional(),
});

export type RouteMeta = z.input<typeof routeMetaSchema>;

export type PrimaryNavigationItem = {
  id: string;
  path: string;
  label: string;
  isActive: boolean;
};

/**
 * Canonical route table — covers all B-01 preferred paths.
 * Sorted by navOrder where applicable.
 */
export const routes: RouteMeta[] = [
  {
    id: 'home',
    path: '/',
    title: 'Ulises Jeremias — Digital Nest',
    description:
      'Ulises Jeremias builds the Digital Nest — personal workshop, documentation atlas, and open-source portfolio.',
    structuredDataType: 'WebSite',
    dataSource: 'static',
    theme: 'home',
    navLabel: 'Home',
    navOrder: 0,
    headerNavOrder: 0,
  },
  {
    id: 'dotfiles',
    path: '/dotfiles',
    title: 'HorneroConfig — Dotfiles & Workstation OS',
    description:
      'HorneroConfig: Hyprland + Quickshell + Kitty + Zsh, chezmoi, appearance themes, and Smart Colors wallpaper→scheme pipeline.',
    structuredDataType: 'CollectionPage',
    dataSource: 'static',
    theme: 'dotfiles',
    navLabel: 'Dotfiles',
    navOrder: 1,
    headerParentId: 'projects',
    subdomain: 'dotfiles',
  },
  {
    id: 'workstation',
    path: '/agentic-workstation',
    title: 'Agentic Workstation — Machine Provisioning',
    description:
      'Thin AI-native workstation: chezmoi provisioning, profile selector, LLM policy — Personal DX graph with Agentic Harness runtime.',
    structuredDataType: 'CollectionPage',
    dataSource: 'static',
    theme: 'workstation',
    navLabel: 'Workstation',
    navOrder: 2,
    headerParentId: 'projects',
    subdomain: 'workstation',
  },
  {
    id: 'toolkit',
    path: '/agent-toolkit',
    title: 'Agent Toolkit — Skills, Agents, Loops',
    description: 'One source of truth → many assistants: skills, agents, loops, swarms.',
    structuredDataType: 'CollectionPage',
    dataSource: 'static',
    theme: 'toolkit',
    navLabel: 'Toolkit',
    navOrder: 3,
    headerParentId: 'projects',
    subdomain: 'agents',
  },
  {
    id: 'v',
    path: '/v',
    title: 'V Ecosystem — Systems & Scientific',
    description: 'V, VSL, VTL, RxV, setup-v — systems programming and scientific exploration.',
    structuredDataType: 'CollectionPage',
    dataSource: 'static',
    theme: 'v',
    navLabel: 'V',
    navOrder: 4,
    headerParentId: 'projects',
    subdomain: 'v',
  },
  {
    id: 'create-awesome',
    path: '/create-awesome',
    title: 'Create Awesome — App Scaffolding Family',
    description: 'Choose template + addons → production-ready app (Node, Python, V).',
    structuredDataType: 'CollectionPage',
    dataSource: 'static',
    theme: 'create-awesome',
    navLabel: 'Create Awesome',
    navOrder: 5,
    headerParentId: 'projects',
    subdomain: 'create',
  },
  {
    id: 'community',
    path: '/community',
    title: 'Community — Digital Nest Workshop',
    description:
      'Shared Discord workshop for HorneroConfig, agentic tooling, Create Awesome, V ecosystem work, and incubating experiments — not a Create Awesome–only community.',
    structuredDataType: 'CollectionPage',
    dataSource: 'static',
    theme: 'community',
    navLabel: 'Community',
    navOrder: 6,
    headerNavOrder: 4,
    subdomain: 'community',
  },
  {
    id: 'blog',
    path: '/blog',
    title: 'Blog — Field Notes',
    description: 'Field notes on DX, systems, and open-source — writing desk.',
    structuredDataType: 'CollectionPage',
    dataSource: 'collection',
    theme: 'blog',
    navLabel: 'Blog',
    navOrder: 7,
    headerNavOrder: 2,
    subdomain: 'blog',
  },
  {
    id: 'blog-post',
    path: '/blog/[slug]',
    title: 'Blog Post',
    description: 'Blog post — field note.',
    structuredDataType: 'BlogPosting',
    dataSource: 'collection',
    theme: 'blog',
    headerParentId: 'blog',
    subdomain: 'blog',
  },
  {
    id: 'projects',
    path: '/projects',
    title: 'Projects — Curated Catalog',
    description: 'Curated additional and archived projects beyond the main worlds.',
    structuredDataType: 'CollectionPage',
    dataSource: 'generated',
    theme: 'projects',
    navLabel: 'Worlds',
    navOrder: 8,
    headerNavOrder: 1,
  },
  {
    id: 'open-source',
    path: '/open-source',
    title: 'Open Source — Evidence-Based Contributions',
    description: 'Evidence-based open-source contributions across ecosystems.',
    structuredDataType: 'CollectionPage',
    dataSource: 'generated',
    theme: 'open-source',
    navLabel: 'Open Source',
    navOrder: 9,
    headerNavOrder: 3,
  },
];

// Validate at import time in dev/test — fail fast if table drifts.
for (const route of routes) {
  const parsed = routeMetaSchema.safeParse(route);
  if (!parsed.success) {
    throw new Error(`Invalid route meta for id="${route.id}": ${parsed.error.message}`);
  }
  if (route.headerParentId) {
    const parent = routes.find((candidate) => candidate.id === route.headerParentId);
    if (!parent || typeof parent.headerNavOrder !== 'number') {
      throw new Error(`Invalid header parent "${route.headerParentId}" for route id="${route.id}"`);
    }
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Canonical production host — www is preferred; apex should redirect in hosting. */
export const DEFAULT_SITE_URL = 'https://www.ulises-jeremias.dev';

/** Resolve site base URL. Prefers explicit arg, then Astro SITE, then env, then default. */
export function getSiteUrl(explicit?: string): string {
  if (explicit) return explicit.replace(/\/$/, '');
  const astroSite = (import.meta.env.SITE as string | undefined)?.replace(/\/$/, '');
  if (astroSite) return astroSite;
  const envUrl =
    (typeof process !== 'undefined' && (process.env.PUBLIC_SITE_URL ?? process.env.SITE ?? process.env.URL)) ||
    undefined;
  if (envUrl) return envUrl.replace(/\/$/, '');
  return DEFAULT_SITE_URL;
}

/**
 * Build a canonical URL for a given path.
 * - `path` must be absolute (leading "/"). Bracket segments like "/blog/[slug]" should be interpolated before calling.
 * - `siteUrl` overrides the default resolution chain.
 *
 * @example getCanonicalUrl("/blog") // "https://example.com/blog"
 * @example getCanonicalUrl("/blog/my-post", "https://example.com")
 */
export function getCanonicalUrl(path: string, siteUrl?: string): string {
  const base = getSiteUrl(siteUrl);
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return new URL(normalizedPath, `${base}/`).toString();
}

/** Like `getCanonicalUrl` but for a dynamic blog slug. */
export function getCanonicalUrlForSlug(slug: string, siteUrl?: string): string {
  const clean = slug.replace(/^\/+|\/+$/g, '');
  return getCanonicalUrl(`/blog/${clean}`, siteUrl);
}

/** Find route meta by exact path (including bracket patterns). */
export function getRouteByPath(path: string): RouteMeta | undefined {
  return routes.find((r) => r.path === path);
}

/** Find route meta by id. */
export function getRouteById(id: string): RouteMeta | undefined {
  return routes.find((r) => r.id === id);
}

/** Routes that appear in the compact global header, sorted by headerNavOrder. */
export function getNavRoutes(): RouteMeta[] {
  return routes
    .filter((r) => typeof r.headerNavOrder === 'number')
    .sort((a, b) => (a.headerNavOrder as number) - (b.headerNavOrder as number));
}

/** Complete public route directory, used by the footer and world indexes. */
export function getFooterRoutes(): RouteMeta[] {
  return routes
    .filter((r) => typeof r.navOrder === 'number')
    .sort((a, b) => (a.navOrder as number) - (b.navOrder as number));
}

function normalizePathname(path: string): string {
  const pathname = path.split(/[?#]/, 1)[0] || '/';
  const withLeadingSlash = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return withLeadingSlash === '/' ? withLeadingSlash : withLeadingSlash.replace(/\/+$/, '');
}

function routePatternMatches(routePath: string, currentPath: string): boolean {
  if (!routePath.includes('[')) return false;
  const pattern = routePath
    .split('/')
    .map((segment) => (segment.startsWith('[') && segment.endsWith(']') ? '[^/]+' : segment))
    .join('/');
  return new RegExp(`^${pattern}/?$`).test(currentPath);
}

function getRouteForCurrentPath(currentPath: string): RouteMeta | undefined {
  const normalized = normalizePathname(currentPath);
  const exact = routes.find((route) => !route.path.includes('[') && normalizePathname(route.path) === normalized);
  if (exact) return exact;

  const dynamic = routes.find((route) => routePatternMatches(route.path, normalized));
  if (dynamic) return dynamic;

  return routes
    .filter((route) => route.path !== '/' && !route.path.includes('['))
    .sort((a, b) => b.path.length - a.path.length)
    .find((route) => normalized.startsWith(`${normalizePathname(route.path)}/`));
}

/** Canonical header items with parent-aware active state for worlds and dynamic routes. */
export function getPrimaryNavigation(currentPath: string): PrimaryNavigationItem[] {
  const currentRoute = getRouteForCurrentPath(currentPath);
  const activeId = currentRoute?.headerParentId ?? currentRoute?.id;

  return getNavRoutes().map((route) => ({
    id: route.id,
    path: route.path,
    label: getNavLabel(route),
    isActive: route.id === activeId,
  }));
}

/** Whether a href is external (http(s) or protocol-relative). */
export function isExternalHref(href: string): boolean {
  return /^(https?:)?\/\//.test(href);
}

/** Resolve navLabel fallback. */
export function getNavLabel(route: RouteMeta): string {
  return route.navLabel ?? route.title;
}
// Compat: foundation pages expect getRouteMeta(path) -> RouteMeta
export function getRouteMeta(path: string): RouteMeta | undefined {
  return getRouteByPath(path);
}
export function canonicalUrl(path: string, site: string): string {
  return getCanonicalUrl(path, site);
}
