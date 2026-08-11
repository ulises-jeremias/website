import { getWorldById } from '@/data/project-worlds.js';
import { groupLabels, groupOrder, type Project, type ProjectGroup, projectSchema } from '../types/index.js';

/**
 * Curated projects ledger.
 *
 * World projects use `visibility: 'world'` + `worldId` (not fake `archived`).
 * Volatile stars/downloads are omitted unless build-time metrics include verifiedAt.
 */

const RAW_PROJECTS = [
  // --- World pointers (archipelago + group anchors) ---
  {
    slug: 'dotfiles',
    title: 'HorneroConfig',
    summary: 'Reproducible operating layer — Hyprland, Quickshell, Smart Colors, chezmoi.',
    status: 'active',
    visibility: 'world',
    worldId: 'dotfiles',
    featured: true,
    tags: ['hyprland', 'chezmoi', 'linux'],
    kind: 'world',
    role: 'author',
    group: 'personal-dx',
    links: [{ label: 'World', href: '/dotfiles', kind: 'world' }],
    lastVerified: '2026-08-07',
  },
  {
    slug: 'agentic-workstation',
    title: 'Agentic Workstation',
    summary: 'Provisioning, policy, and tooling for an AI-native developer workstation.',
    status: 'active',
    visibility: 'world',
    worldId: 'workstation',
    featured: true,
    tags: ['chezmoi', 'direnv', 'llm-policy'],
    kind: 'world',
    role: 'author',
    group: 'personal-dx',
    links: [{ label: 'World', href: '/agentic-workstation', kind: 'world' }],
    lastVerified: '2026-08-07',
  },
  {
    slug: 'agent-toolkit',
    title: 'Agent Toolkit',
    summary: 'Skills, agents, loops, profiles, and MCP — one source of truth for assistants.',
    status: 'active',
    visibility: 'world',
    worldId: 'toolkit',
    featured: true,
    tags: ['skills', 'agents', 'swarm'],
    kind: 'world',
    role: 'author',
    group: 'agentic',
    links: [{ label: 'World', href: '/agent-toolkit', kind: 'world' }],
    lastVerified: '2026-08-07',
  },
  {
    slug: 'v-ecosystem',
    title: 'V Ecosystem',
    summary: 'VSL, VTL, RxV, and setup-v across scientific and systems tooling.',
    status: 'active',
    visibility: 'world',
    worldId: 'v',
    featured: true,
    tags: ['v', 'scientific', 'systems'],
    kind: 'world',
    role: 'maintainer',
    group: 'v',
    links: [{ label: 'World', href: '/v', kind: 'world' }],
    lastVerified: '2026-08-07',
  },
  {
    slug: 'create-awesome',
    title: 'Create Awesome',
    summary: 'Node / Python / V app scaffolding family and template catalog.',
    status: 'active',
    visibility: 'world',
    worldId: 'create-awesome',
    featured: true,
    tags: ['scaffolding', 'templates', 'cli'],
    kind: 'world',
    role: 'org-maintainer',
    group: 'create-awesome',
    links: [{ label: 'World', href: '/create-awesome', kind: 'world' }],
    lastVerified: '2026-08-07',
  },

  // --- Public ledger entries (additional / non-world detail) ---
  {
    slug: 'setup-v',
    title: 'setup-v',
    summary: 'GitHub Action to install V — maintained under the V org (@v1.7).',
    status: 'active',
    visibility: 'public',
    worldId: 'v',
    featured: true,
    tags: ['v', 'github-actions', 'ci'],
    kind: 'tool',
    role: 'maintainer',
    group: 'v',
    links: [
      { label: 'Repo', href: 'https://github.com/vlang/setup-v', kind: 'repo' },
      { label: 'World', href: '/v#setup-v', kind: 'world' },
    ],
    lastVerified: '2026-08-07',
  },
  {
    slug: 'awesome-v',
    title: 'awesome-v',
    summary: 'Community-curated list of V frameworks, libraries, software, and resources (CC0).',
    status: 'maintained',
    visibility: 'public',
    worldId: 'v',
    featured: true,
    tags: ['v', 'awesome', 'curated'],
    kind: 'resource',
    role: 'contributor',
    group: 'v',
    links: [
      { label: 'Repo', href: 'https://github.com/vlang/awesome-v', kind: 'repo' },
      { label: 'World', href: '/v', kind: 'world' },
    ],
    lastVerified: '2026-08-10',
  },
  {
    slug: 'rxv',
    title: 'rxv',
    summary: 'ReactiveX implementation for V with generic observables and channel-based operator pipelines.',
    status: 'experimental',
    visibility: 'public',
    worldId: 'v',
    tags: ['v', 'rx', 'reactive'],
    kind: 'library',
    role: 'author',
    group: 'v',
    links: [
      { label: 'Repo', href: 'https://github.com/ulises-jeremias/rxv', kind: 'repo' },
      { label: 'World', href: '/v#rxv', kind: 'world' },
    ],
    lastVerified: '2026-08-10',
  },
  {
    slug: 'hello-vsl',
    title: 'hello-vsl',
    summary: 'Minimal VSL example — hello world for V Scientific Library.',
    status: 'experimental',
    visibility: 'public',
    worldId: 'v',
    tags: ['v', 'vsl', 'example'],
    kind: 'template',
    role: 'author',
    group: 'v',
    links: [
      { label: 'Repo', href: 'https://github.com/ulises-jeremias/hello-vsl', kind: 'repo' },
      { label: 'World', href: '/v#vsl', kind: 'world' },
    ],
    lastVerified: '2026-08-07',
  },
  {
    slug: 'vlang-v-mascot',
    title: 'vlang/v-mascot',
    summary: 'Veasel mascot asset contributions — not a Digital Nest product surface.',
    status: 'maintained',
    visibility: 'public',
    worldId: 'v',
    featured: false,
    tags: ['v', 'branding', 'mascot'],
    kind: 'resource',
    role: 'contributor',
    group: 'v',
    links: [{ label: 'Repo', href: 'https://github.com/vlang/v-mascot', kind: 'repo' }],
    lastVerified: '2026-08-07',
    licenseNote: 'CC BY-NC 4.0 — non-commercial use only; do not embed commercially.',
  },
  {
    slug: 'recoil-devtools',
    title: 'recoil-devtools',
    summary: 'Community Recoil DevTools (log monitor, dock, logger). Experimental React tooling — not a Nest world.',
    status: 'experimental',
    visibility: 'public',
    featured: false,
    tags: ['recoil', 'devtools', 'react'],
    kind: 'tool',
    role: 'maintainer',
    group: 'dev-tools',
    links: [{ label: 'Repo', href: 'https://github.com/ulises-jeremias/recoil-devtools', kind: 'repo' }],
    lastVerified: '2026-08-07',
    // stars omitted — only attach via GENERATED_GITHUB_SOURCE metrics with verifiedAt
  },
] as const;

function parseProjects(raw: readonly unknown[]): Project[] {
  return raw.map((entry, index) => {
    const parsed = projectSchema.safeParse(entry);
    if (!parsed.success) {
      throw new Error(`Invalid project at index ${index}: ${parsed.error.message}`);
    }
    const project = parsed.data;
    if (project.worldId && !getWorldById(project.worldId) && project.visibility === 'world') {
      throw new Error(`Project ${project.slug} references unknown worldId: ${project.worldId}`);
    }
    return project;
  });
}

export const projects: Project[] = parseProjects(RAW_PROJECTS);

/** Entries shown in the dense searchable ledger (not hidden). */
export const ledgerProjects: Project[] = projects.filter((p) => p.visibility !== 'hidden');

/** World-pointer islands for the archipelago motif. */
export const worldPointerProjects: Project[] = projects.filter((p) => p.visibility === 'world');

/** Truly archived only. */
export const archivedProjects: Project[] = projects.filter((p) => p.status === 'archived');

export const featuredProjects: Project[] = projects.filter((p) => p.featured && p.visibility !== 'hidden');

export type ProjectGroupBucket = {
  id: ProjectGroup;
  label: string;
  projects: Project[];
};

export function getGroupedLedger(list: Project[] = ledgerProjects): ProjectGroupBucket[] {
  return groupOrder
    .map((id) => ({
      id,
      label: groupLabels[id],
      projects: list.filter((p) => p.group === id),
    }))
    .filter((bucket) => bucket.projects.length > 0);
}

export const groupProjects = getGroupedLedger;

export function validateProjects(list: Project[] = projects): string[] {
  const errors: string[] = [];
  const slugs = new Set<string>();
  for (const p of list) {
    const result = projectSchema.safeParse(p);
    if (!result.success) {
      errors.push(`[${p.slug}] ${result.error.message}`);
    }
    if (slugs.has(p.slug)) errors.push(`Duplicate slug: ${p.slug}`);
    slugs.add(p.slug);
    if (p.metrics && !p.metrics.verifiedAt) {
      errors.push(`[${p.slug}] metrics missing verifiedAt`);
    }
    if (p.visibility === 'world' && p.status === 'archived') {
      errors.push(`[${p.slug}] world pointers must not be archived`);
    }
    if (p.slug === 'vlang-v-mascot' && p.featured) {
      errors.push('[vlang-v-mascot] must not be featured without explicit reason');
    }
  }
  return errors;
}
