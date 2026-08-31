import { profile } from '@/data/profile.js';
import { featuredWorlds as canonicalFeaturedWorlds, worldsByPriority } from '@/data/project-worlds.js';
import { inventoryStrip } from '@/features/agent-toolkit/data/inventory.js';
import { verifiedFacts as dotfilesFacts } from '@/features/dotfiles/data/index.js';
import type { AtlasWorld, ContactLink, FeaturedProjectRow, NestStatusItem } from '../types/index.js';

/** ZIP island art filenames (under /assets/nest/), mapped from project-world ids. */
export const islandArtByWorldId: Record<string, string> = {
  dotfiles: 'island-dotfiles',
  workstation: 'island-workstation',
  toolkit: 'island-agent',
  harness: 'island-harness',
  v: 'island-v',
  'create-awesome': 'island-scaffold',
  community: 'island-community',
  blog: 'island-blog',
  projects: 'island-projects',
  'open-source': 'island-oss',
};

export const atlasWorlds: AtlasWorld[] = worldsByPriority.map((world, index) => ({
  id: world.id,
  number: String(index + 1).padStart(2, '0'),
  title: world.title,
  description: world.description,
  path: world.path,
  theme: world.theme,
  accent: world.accent,
  illustration: world.illustration,
  island: islandArtByWorldId[world.id] ?? 'island-projects',
  relatedWorlds: [...world.relatedWorlds],
}));

/** Verified focus keywords derived from profile.focusAreas — not generated copy. */
export const heroKeywords = [
  'Developer Tooling',
  'AI Workflows',
  'CLI Apps',
  'Linux Tooling',
  'Scientific Computing',
] as const;

/** ZIP terminal quote — positioning statement, not invented telemetry. */
export const terminalQuote = "Building tools that empower developers and expand what's possible.";

export const nestStatus: NestStatusItem[] = [
  {
    label: 'atlas_state',
    value: `${atlasWorlds.length} worlds mapped`,
    tone: 'magenta',
  },
  {
    label: 'primary_focus',
    value: 'Developer tooling & AI workflows',
    tone: 'cyan',
  },
  {
    label: 'toolkit_inventory',
    value: inventoryStrip(),
    tone: 'violet',
  },
  {
    label: 'dotfiles_themes',
    value: `${dotfilesFacts.themeCount} HorneroConfig themes`,
    tone: 'magenta',
  },
  {
    label: 'home_base',
    value: profile.location,
    tone: 'muted',
  },
];

export const nestStack = [
  ['Linux', 'Neovim', 'Tmux', 'Zsh', 'Git'],
  ['TypeScript', 'Go', 'Shell', 'Python', 'V'],
] as const;

export const featuredProjectLedger: FeaturedProjectRow[] = canonicalFeaturedWorlds.map((world) => ({
  id: world.id,
  title: world.title,
  description: world.description,
  path: world.path,
  accent: world.accent,
  illustration: world.illustration,
  island: islandArtByWorldId[world.id] ?? 'island-projects',
}));

// ---------------------------------------------------------------------------
// Featured Work — four flagship portfolio areas (ADR-003, #402)
// Sourced from the portfolio taxonomy; no stars, no rankings, no fabricated
// metrics. Time lens comes from verified member data.
// ---------------------------------------------------------------------------

export interface FeaturedArea {
  id: string;
  title: string;
  path: string;
  proposition: string;
  accent: 'magenta' | 'pink' | 'violet' | 'blue' | 'cyan' | 'orange';
  island: string;
  /** One-line proven/maturity cue from verified member data. */
  lens: 'Building now' | 'Proven over time' | 'Building now · Proven over time';
  /** Concise member summary for the Agentic area. */
  members?: string;
  proof?: string;
}

export const featuredAreas: FeaturedArea[] = [
  {
    id: 'agentic',
    title: 'Agentic Developer Stack',
    path: '/agentic',
    proposition:
      'Portable agentic capabilities, machine provisioning, and persistent workspace context — three composable responsibilities.',
    accent: 'violet',
    island: 'island-agent',
    lens: 'Building now',
    members: 'Agent Toolkit · Agentic Workstation · Agentic Harness',
  },
  {
    id: 'horneroconfig',
    title: 'HorneroConfig',
    path: '/dotfiles',
    proposition: 'A reproducible Linux developer environment built on Hyprland, Quickshell, Smart Colors, and chezmoi.',
    accent: 'magenta',
    island: 'island-dotfiles',
    lens: 'Building now · Proven over time',
    proof: 'Established personal dotfiles framework distributed through GitHub and AUR.',
  },
  {
    id: 'v-ecosystem',
    title: 'V Ecosystem',
    path: '/v',
    proposition:
      'Contributions to the V programming language and its scientific computing, tensor/ML, reactive, and CI tooling ecosystems.',
    accent: 'blue',
    island: 'island-v',
    lens: 'Building now · Proven over time',
    proof:
      'Maintainer and contributor roles across vlang organization projects — ecosystem scale belongs to V, not to personal ownership.',
  },
  {
    id: 'create-awesome',
    title: 'Create Awesome',
    path: '/create-awesome',
    proposition:
      'Composable application scaffolding across Node.js, Python, and V — one composition model, three runtimes.',
    accent: 'orange',
    island: 'island-scaffold',
    lens: 'Building now · Proven over time',
    proof:
      'Node App is the mature family member (maintained since 2020, npm distribution); Python and V are newer expansions.',
  },
];

export const contactLinks: ContactLink[] = [
  {
    label: 'GitHub',
    href: profile.links.github,
    hint: 'github.com/ulises-jeremias',
    illustration: 'github',
    external: true,
  },
  {
    label: 'LinkedIn',
    href: profile.links.linkedin,
    hint: 'linkedin.com/in/ulisesjcf',
    illustration: 'linkedin',
    external: true,
  },
  {
    label: 'Email',
    href: `mailto:${profile.links.email}`,
    hint: profile.links.email,
    illustration: 'email',
    external: false,
  },
  {
    label: 'Discord',
    href: profile.links.discord,
    hint: 'discord.gg/bR5VyATgka',
    illustration: 'discord',
    external: true,
  },
];
