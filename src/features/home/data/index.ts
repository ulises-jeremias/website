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
