import { z } from 'astro/zod';
import { inventoryStrip } from '@/features/agent-toolkit/data/inventory.js';

// ---------------------------------------------------------------------------
// Theme tokens — shared with navigation for world-aware styling.
// ---------------------------------------------------------------------------

export const themeIdSchema = z.enum([
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

export type ThemeId = z.infer<typeof themeIdSchema>;

export const worldAccentSchema = z.enum(['magenta', 'pink', 'violet', 'blue', 'cyan', 'orange']);
export type WorldAccent = z.infer<typeof worldAccentSchema>;

export const worldIllustrationSchema = z.enum([
  'desktop',
  'workstation',
  'capability-core',
  'computation-lab',
  'scaffold',
  'contributor-network',
  'field-notes',
  'project-ledger',
  'source-branch',
]);
export type WorldIllustration = z.infer<typeof worldIllustrationSchema>;

// ---------------------------------------------------------------------------
// Project world taxonomy
// ---------------------------------------------------------------------------

/**
 * Priority order controls nav and homepage rendering order. Lower number = higher priority.
 */
export const projectWorldSchema = z.object({
  id: z.string().min(1).describe('Stable identifier, kebab-case'),
  slug: z.string().min(1).describe('URL segment without leading slash'),
  title: z.string().min(1).describe('Display label'),
  description: z.string().min(1).describe('One-line description for nav/card'),
  path: z
    .string()
    .regex(/^\/[a-z0-9-]*(\/[a-z0-9-]+)*\/?$/, 'Must be an absolute path like /dotfiles')
    .describe('Absolute path, e.g. /dotfiles'),
  theme: themeIdSchema.describe('Theme token reference'),
  accent: worldAccentSchema.describe('Synthwave atlas accent family'),
  illustration: worldIllustrationSchema.describe('Original SVG environment identifier'),
  priority: z.number().int().min(0).max(100).describe('Ordering weight — lower is earlier'),
  featured: z.boolean().default(false).describe('Whether featured on homepage hero'),
  subdomain: z.string().min(1).optional().describe('Future subdomain label, e.g. dotfiles for dotfiles.ulises.dev'),
  relatedWorlds: z.array(z.string()).default([]).describe('IDs of related worlds for cross-links'),
  subWorlds: z
    .array(
      z.object({
        id: z.string().min(1),
        title: z.string().min(1),
        path: z.string().regex(/^\/[a-z0-9-]*(\/[a-z0-9-]+)*(#[a-z0-9-]+)?$/),
        description: z.string().optional(),
      }),
    )
    .optional()
    .describe('Optional sub-worlds, e.g. V → VSL/VTL/RxV/setup-v'),
});

export type ProjectWorld = z.infer<typeof projectWorldSchema>;

// ---------------------------------------------------------------------------
// World definitions — ordering rationale in comments / ADR-001
// ---------------------------------------------------------------------------

export const projectWorlds: ProjectWorld[] = [
  {
    id: 'dotfiles',
    slug: 'dotfiles',
    title: 'Dotfiles',
    description: 'HorneroConfig — Hyprland, Quickshell, Smart Colors',
    path: '/dotfiles',
    theme: 'dotfiles',
    accent: 'magenta',
    illustration: 'desktop',
    priority: 10,
    featured: true,
    subdomain: 'dotfiles',
    relatedWorlds: ['workstation', 'open-source'],
  },
  {
    id: 'toolkit',
    slug: 'agent-toolkit',
    title: 'Agent Toolkit',
    description: `${inventoryStrip()} — swarm recipes included`,
    path: '/agent-toolkit',
    theme: 'toolkit',
    accent: 'violet',
    illustration: 'capability-core',
    priority: 20,
    featured: true,
    subdomain: 'agents',
    relatedWorlds: ['workstation', 'community'],
  },
  {
    id: 'workstation',
    slug: 'agentic-workstation',
    title: 'Agentic Workstation',
    description: 'Thin machine provisioning for the Personal DX graph — chezmoi, profiles, LLM policy.',
    path: '/agentic-workstation',
    theme: 'workstation',
    accent: 'cyan',
    illustration: 'workstation',
    priority: 30,
    featured: true,
    subdomain: 'workstation',
    relatedWorlds: ['toolkit', 'dotfiles', 'community'],
  },
  {
    id: 'v',
    slug: 'v',
    title: 'V Ecosystem',
    description: 'VSL, VTL, RxV, and setup-v across scientific and systems tooling',
    path: '/v',
    theme: 'v',
    accent: 'blue',
    illustration: 'computation-lab',
    priority: 40,
    featured: true,
    subdomain: 'v',
    relatedWorlds: ['open-source', 'community'],
    subWorlds: [
      { id: 'vsl', title: 'VSL', path: '/v#vsl', description: 'V Scientific Library' },
      { id: 'vtl', title: 'VTL', path: '/v#vtl', description: 'Tensor and autograd experiments for V' },
      { id: 'rxv', title: 'RxV', path: '/v#rxv', description: 'Reactive extensions for V' },
      { id: 'setup-v', title: 'setup-v', path: '/v#setup-v', description: 'GitHub Action & installer for V' },
    ],
  },
  {
    id: 'create-awesome',
    slug: 'create-awesome',
    title: 'Create Awesome',
    description: 'Create Awesome — Node / Python / V templates + catalog',
    path: '/create-awesome',
    theme: 'create-awesome',
    accent: 'orange',
    illustration: 'scaffold',
    priority: 50,
    featured: true,
    subdomain: 'create',
    relatedWorlds: ['community', 'open-source'],
    subWorlds: [
      { id: 'create-node', title: 'create-node-app', path: '/create-awesome#node', description: 'Node templates' },
      {
        id: 'create-python',
        title: 'create-python-app',
        path: '/create-awesome#python',
        description: 'Python templates',
      },
      { id: 'create-v', title: 'create-vlang-app', path: '/create-awesome#v', description: 'V templates' },
    ],
  },
  {
    id: 'community',
    slug: 'community',
    title: 'Community',
    description: 'Shared workshop across Digital Nest projects',
    path: '/community',
    theme: 'community',
    accent: 'pink',
    illustration: 'contributor-network',
    priority: 60,
    featured: false,
    subdomain: 'community',
    relatedWorlds: ['toolkit', 'create-awesome', 'blog'],
  },
  {
    id: 'blog',
    slug: 'blog',
    title: 'Blog',
    description: 'Blog — field notes on tooling, systems, scientific computing',
    path: '/blog',
    theme: 'blog',
    accent: 'blue',
    illustration: 'field-notes',
    priority: 70,
    featured: false,
    subdomain: 'blog',
    relatedWorlds: ['community', 'projects'],
  },
  {
    id: 'projects',
    slug: 'projects',
    title: 'Projects',
    description: 'Projects — curated additional & archived projects',
    path: '/projects',
    theme: 'projects',
    accent: 'violet',
    illustration: 'project-ledger',
    priority: 80,
    featured: false,
    relatedWorlds: ['open-source', 'blog'],
  },
  {
    id: 'open-source',
    slug: 'open-source',
    title: 'Open Source',
    description: 'Open Source — evidence-based contributions',
    path: '/open-source',
    theme: 'open-source',
    accent: 'cyan',
    illustration: 'source-branch',
    priority: 90,
    featured: false,
    relatedWorlds: ['projects', 'community'],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Worlds sorted by priority (homepage / nav order). */
export const worldsByPriority: ProjectWorld[] = [...projectWorlds].sort((a, b) => a.priority - b.priority);

/** Featured subset for homepage hero. */
export const featuredWorlds: ProjectWorld[] = worldsByPriority.filter((w) => w.featured);

/** Lookup by id. */
export function getWorldById(id: string): ProjectWorld | undefined {
  return projectWorlds.find((w) => w.id === id);
}

/** Lookup by path (exact match). */
export function getWorldByPath(path: string): ProjectWorld | undefined {
  return projectWorlds.find((w) => w.path === path);
}

/** Lookup by slug. */
export function getWorldBySlug(slug: string): ProjectWorld | undefined {
  return projectWorlds.find((w) => w.slug === slug);
}

// ---------------------------------------------------------------------------
// Cross-link map — explicit edges for related-world rendering
// ---------------------------------------------------------------------------

export type CrossLink = {
  from: string;
  to: string;
  label: string;
};

/**
 * Directed cross-links between worlds. Useful for "Related" sections
 * and for validating that `relatedWorlds` arrays are consistent.
 */
export const crossLinks: CrossLink[] = [
  { from: 'workstation', to: 'toolkit', label: 'Can provision Toolkit host dependencies' },
  { from: 'toolkit', to: 'workstation', label: 'Can be installed independently' },
  { from: 'dotfiles', to: 'workstation', label: 'Optionally coexists with Workstation' },
  { from: 'workstation', to: 'dotfiles', label: 'Links to optional desktop configuration' },
  { from: 'v', to: 'open-source', label: 'V core contributions' },
  { from: 'create-awesome', to: 'community', label: 'Join the shared community' },
  { from: 'blog', to: 'community', label: 'Continue in Discord' },
  { from: 'toolkit', to: 'community', label: 'Discuss or contribute' },
  { from: 'dotfiles', to: 'community', label: 'Contribute through the Digital Nest community' },
  { from: 'workstation', to: 'community', label: 'Discuss Personal DX' },
  { from: 'projects', to: 'open-source', label: 'See contributions' },
];

// ---------------------------------------------------------------------------
// Validation — ensure taxonomy invariants at build/test time
// ---------------------------------------------------------------------------

export function validateTaxonomy(worlds: ProjectWorld[] = projectWorlds): string[] {
  const errors: string[] = [];
  const ids = new Set(worlds.map((w) => w.id));
  const paths = new Set<string>();
  const slugs = new Set<string>();

  for (const w of worlds) {
    const parsed = projectWorldSchema.safeParse(w);
    if (!parsed.success) {
      errors.push(`[${w.id}] schema: ${parsed.error.issues.map((i) => i.message).join('; ')}`);
    }
    if (paths.has(w.path)) errors.push(`Duplicate path: ${w.path}`);
    paths.add(w.path);
    if (slugs.has(w.slug)) errors.push(`Duplicate slug: ${w.slug}`);
    slugs.add(w.slug);
    for (const rel of w.relatedWorlds) {
      if (!ids.has(rel)) errors.push(`[${w.id}] relatedWorlds references unknown id: ${rel}`);
    }
    if (w.subWorlds) {
      for (const sub of w.subWorlds) {
        if (!sub.path.startsWith(w.path)) {
          errors.push(`[${w.id}] subWorld ${sub.id} path ${sub.path} must be under ${w.path}`);
        }
      }
    }
  }

  const priorities = worlds.map((w) => w.priority);
  if (new Set(priorities).size !== priorities.length) {
    errors.push('Duplicate priority values — ordering must be unambiguous');
  }

  return errors;
}
