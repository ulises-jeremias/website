import { z } from 'astro/zod';

/**
 * Route metadata — single source of truth for SEO, canonicals, OG, navigation,
 * footer directory, and sitemap. Route set: ADR-001 paths, ADR-003 additions
 * (/agentic, /about), and ADR-004 additions (/hornero-os, /sponsor).
 * Subdomain-ready: `path` is route-independent; `subdomain` hints future split.
 */

export const routeThemeSchema = z.enum([
  'home',
  'about',
  'dotfiles',
  'workstation',
  'toolkit',
  'harness',
  'v',
  'create-awesome',
  'community',
  'blog',
  'projects',
  'open-source',
  'sponsor',
  'hornero-os',
]);

export type RouteTheme = z.infer<typeof routeThemeSchema>;

export const structuredDataTypeSchema = z.enum([
  'WebSite',
  'WebPage',
  'CollectionPage',
  'BlogPosting',
  'ProfilePage',
  'ItemList',
]);

/**
 * Footer directory groups (ADR-004). The footer renders the complete public
 * route directory grouped by visitor intent instead of one flat numbered list.
 */
export const footerGroupSchema = z.enum(['portfolio', 'site', 'support']);
export type FooterGroup = z.infer<typeof footerGroupSchema>;

export const footerGroupLabels: Record<FooterGroup, string> = {
  portfolio: 'Projects',
  site: 'Digital Nest',
  support: 'Support the work',
};

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
  /** Meaningful description for the route social card. */
  ogImageAlt: z.string().min(1).optional(),
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
  /** Footer directory group; required for routes listed via navOrder. */
  footerGroup: footerGroupSchema.optional(),
  /** Visual treatment in the compact header — `cta` renders as an outlined action. */
  headerVariant: z.enum(['link', 'cta']).default('link'),
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
  variant: 'link' | 'cta';
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
      'Ulises Jeremias builds open-source developer systems: agentic tooling, Linux environments, V scientific libraries, and app scaffolding.',
    ogImage: '/social/home.jpg',
    ogImageAlt: 'Digital Nest — open-source developer tooling by Ulises Jeremias',
    structuredDataType: 'WebSite',
    dataSource: 'static',
    theme: 'home',
    navLabel: 'Home',
    navOrder: 20,
    footerGroup: 'site',
  },
  {
    id: 'agentic',
    path: '/agentic',
    title: 'Agentic Developer Stack — Toolkit, Workstation, Harness',
    description:
      'Three composable open-source projects: Agent Toolkit for portable agent capabilities, Agentic Workstation for machine provisioning, Agentic Harness for persistent workspace context.',
    ogImage: '/social/agentic.jpg',
    ogImageAlt: 'Agentic Developer Stack — Agent Toolkit, Agentic Workstation, and Agentic Harness',
    structuredDataType: 'ItemList',
    dataSource: 'static',
    navLabel: 'Agentic Stack',
    navOrder: 1,
    footerGroup: 'portfolio',
    headerParentId: 'projects',
  },
  {
    id: 'toolkit',
    path: '/agent-toolkit',
    title: 'Agent Toolkit — Portable Agent Capabilities & Runtime',
    description:
      'Portable skills, agents, loops, and MCP tooling that install into many coding assistants, plus the CLI runtime that executes them.',
    ogImage: '/social/agent-toolkit.jpg',
    ogImageAlt: 'Agent Toolkit skills, agents, loops, and swarms',
    structuredDataType: 'CollectionPage',
    dataSource: 'static',
    theme: 'toolkit',
    navLabel: 'Agent Toolkit',
    navOrder: 2,
    footerGroup: 'portfolio',
    headerParentId: 'projects',
    subdomain: 'agents',
  },
  {
    id: 'workstation',
    path: '/agentic-workstation',
    title: 'Agentic Workstation — Machine Provisioning',
    description:
      'Thin AI-native workstation provisioning: chezmoi, profiles, and LLM host policy — installs Agent Toolkit rather than duplicating it.',
    ogImage: '/social/agentic-workstation.jpg',
    ogImageAlt: 'Agentic Workstation machine provisioning and policy',
    structuredDataType: 'CollectionPage',
    dataSource: 'static',
    theme: 'workstation',
    navLabel: 'Agentic Workstation',
    navOrder: 3,
    footerGroup: 'portfolio',
    headerParentId: 'projects',
    subdomain: 'workstation',
  },
  {
    id: 'harness',
    path: '/agentic-harness',
    title: 'Agentic Harness — Persistent Workspace Context',
    description:
      'Persistent workspace context for Agent Toolkit: knowledge, personas, packs, project collections, and run history that outlive any AI session.',
    ogImage: '/social/agentic-harness.jpg',
    ogImageAlt: 'Agentic Harness persistent workspace context and state',
    structuredDataType: 'CollectionPage',
    dataSource: 'static',
    theme: 'harness',
    navLabel: 'Agentic Harness',
    navOrder: 4,
    footerGroup: 'portfolio',
    headerParentId: 'projects',
    subdomain: 'harness',
  },
  {
    id: 'dotfiles',
    path: '/dotfiles',
    title: 'HorneroConfig — Reproducible Linux Desktop Configuration',
    description:
      'HorneroConfig: a chezmoi-managed Hyprland and Quickshell desktop with appearance themes and a Smart Colors wallpaper-to-scheme pipeline.',
    ogImage: '/social/dotfiles.jpg',
    ogImageAlt: 'HorneroConfig dotfiles and Smart Colors desktop',
    structuredDataType: 'CollectionPage',
    dataSource: 'static',
    theme: 'dotfiles',
    navLabel: 'HorneroConfig',
    navOrder: 5,
    footerGroup: 'portfolio',
    headerParentId: 'projects',
    subdomain: 'dotfiles',
  },
  {
    id: 'hornero-os',
    path: '/hornero-os',
    title: 'Hornero OS — An Early-Stage Arch-Based Wayland Desktop',
    description:
      'Hornero OS is an early-stage, Arch-based Wayland desktop OS project built around Hyprland and Quickshell. Not yet installable — here is what exists today.',
    ogImage: '/social/hornero-os.jpg',
    ogImageAlt: 'Hornero OS — early-stage Arch-based Wayland desktop project',
    structuredDataType: 'WebPage',
    dataSource: 'static',
    theme: 'hornero-os',
    navLabel: 'Hornero OS',
    navOrder: 6,
    footerGroup: 'portfolio',
    headerParentId: 'projects',
  },
  {
    id: 'v',
    path: '/v',
    title: 'V Ecosystem — Scientific Computing, Tensors & Tooling',
    description:
      'Work in the V language ecosystem: VSL scientific computing, VTL tensors and autograd, RxV reactive streams, setup-v for CI, and compiler contributions.',
    ogImage: '/social/v.jpg',
    ogImageAlt: 'V ecosystem systems and scientific computing projects',
    structuredDataType: 'CollectionPage',
    dataSource: 'static',
    theme: 'v',
    navLabel: 'V Ecosystem',
    navOrder: 7,
    footerGroup: 'portfolio',
    headerParentId: 'projects',
    subdomain: 'v',
  },
  {
    id: 'create-awesome',
    path: '/create-awesome',
    title: 'Create Awesome — App Scaffolding for Node, Python & V',
    description:
      'Choose a template and add-ons to scaffold an application in Node.js, Python, V, or Rust — one composition model across four CLIs.',
    ogImage: '/social/create-awesome.jpg',
    ogImageAlt: 'Create Awesome application scaffolding for Node, Python, V, and Rust',
    structuredDataType: 'CollectionPage',
    dataSource: 'static',
    theme: 'create-awesome',
    navLabel: 'Create Awesome',
    navOrder: 8,
    footerGroup: 'portfolio',
    headerParentId: 'projects',
    subdomain: 'create',
  },
  {
    id: 'projects',
    path: '/projects',
    title: 'Work — Projects by Ulises Jeremias',
    description:
      'What Ulises builds: four flagship areas of open-source developer tooling, selected work, labs, and a source-backed project ledger.',
    ogImage: '/social/projects.jpg',
    ogImageAlt: 'Digital Nest project worlds and curated project catalog',
    structuredDataType: 'CollectionPage',
    dataSource: 'generated',
    theme: 'projects',
    navLabel: 'Work',
    navOrder: 21,
    footerGroup: 'site',
    headerNavOrder: 1,
  },
  {
    id: 'open-source',
    path: '/open-source',
    title: 'Open Source — Evidence-Based Contributions',
    description:
      'Authored, maintained, organization, and upstream open-source work — each claim backed by repositories and merged pull requests.',
    ogImage: '/social/open-source.jpg',
    ogImageAlt: 'Evidence-based open-source contributions across ecosystems',
    structuredDataType: 'CollectionPage',
    dataSource: 'generated',
    theme: 'open-source',
    navLabel: 'Open Source',
    navOrder: 22,
    footerGroup: 'site',
    headerNavOrder: 2,
  },
  {
    id: 'about',
    path: '/about',
    title: 'About — Ulises Jeremias',
    description:
      'Solutions Architect and open-source builder: the path from CLI tooling and scaffolding to V scientific computing, Linux environments, and agentic workflows.',
    ogImage: '/social/about.jpg',
    ogImageAlt: 'About Ulises Jeremias — developer tooling engineer and open-source builder',
    structuredDataType: 'ProfilePage',
    dataSource: 'static',
    theme: 'about',
    navLabel: 'About',
    navOrder: 23,
    footerGroup: 'site',
    headerNavOrder: 3,
  },
  {
    id: 'community',
    path: '/community',
    title: 'Community — Digital Nest Workshop',
    description:
      'One Discord workshop across agentic tooling, Linux desktops, V, scaffolding, and experiments — plus the contribution paths for every project.',
    ogImage: '/social/community.jpg',
    ogImageAlt: 'Digital Nest community contribution workshop',
    structuredDataType: 'CollectionPage',
    dataSource: 'static',
    theme: 'community',
    navLabel: 'Community',
    navOrder: 24,
    footerGroup: 'site',
    subdomain: 'community',
  },
  {
    id: 'blog',
    path: '/blog',
    title: 'Writing — Field Notes',
    description:
      'Field notes on agentic engineering, developer experience, V, Linux, and open source — written from shipped work, not announcements.',
    ogImage: '/social/blog.jpg',
    ogImageAlt: 'Digital Nest field notes on developer experience and open source',
    structuredDataType: 'CollectionPage',
    dataSource: 'collection',
    theme: 'blog',
    navLabel: 'Writing',
    navOrder: 25,
    footerGroup: 'site',
    subdomain: 'blog',
  },
  {
    id: 'blog-post',
    path: '/blog/[slug]',
    title: 'Writing Post',
    description: 'Field note — technical writing from shipped open-source work.',
    ogImage: '/social/blog.jpg',
    ogImageAlt: 'Digital Nest field note',
    structuredDataType: 'BlogPosting',
    dataSource: 'collection',
    theme: 'blog',
    subdomain: 'blog',
  },
  {
    id: 'sponsor',
    path: '/sponsor',
    title: 'Sponsor & Partner — Open Source by Ulises Jeremias',
    description:
      'Support open-source developer tooling through GitHub Sponsors, or partner on integrations, infrastructure, Linux hardware testing, and community work.',
    ogImage: '/social/sponsor.jpg',
    ogImageAlt: 'Sponsor the work — Digital Nest open source by Ulises Jeremias',
    structuredDataType: 'WebPage',
    dataSource: 'static',
    theme: 'sponsor',
    navLabel: 'Sponsor',
    navOrder: 40,
    footerGroup: 'support',
    headerNavOrder: 4,
    headerVariant: 'cta',
  },
];

// Validate at import time in dev/test — fail fast if table drifts.
for (const route of routes) {
  const parsed = routeMetaSchema.safeParse(route);
  if (!parsed.success) {
    throw new Error(`Invalid route meta for id="${route.id}": ${parsed.error.message}`);
  }
  if (typeof route.navOrder === 'number' && !route.footerGroup) {
    throw new Error(`Route id="${route.id}" is listed in the directory but has no footerGroup`);
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

/** Complete public route directory, used by the footer, sitemap, and 404 index. */
export function getFooterRoutes(): RouteMeta[] {
  return routes
    .filter((r) => typeof r.navOrder === 'number')
    .sort((a, b) => (a.navOrder as number) - (b.navOrder as number));
}

export type FooterRouteGroup = { id: FooterGroup; label: string; routes: RouteMeta[] };

/** Public route directory grouped by visitor intent (ADR-004). */
export function getFooterRouteGroups(): FooterRouteGroup[] {
  const directory = getFooterRoutes();
  return footerGroupSchema.options.map((id) => ({
    id,
    label: footerGroupLabels[id],
    routes: directory.filter((route) => route.footerGroup === id),
  }));
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
    variant: route.headerVariant ?? 'link',
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
