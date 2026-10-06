import { getHomepagePortfolioAreas } from '@/data/portfolio.js';
import { profile } from '@/data/profile.js';
import { worldsByPriority } from '@/data/project-worlds.js';
import { inventoryStrip } from '@/features/agent-toolkit/data/inventory.js';
import type { AtlasWorld, ContactLink, NestStatusItem } from '../types/index.js';

/** Island art filenames (under /assets/nest/), mapped from project-world ids. */
export const islandArtByWorldId: Record<string, string> = {
  dotfiles: 'island-dotfiles',
  workstation: 'island-workstation',
  toolkit: 'island-agent',
  harness: 'island-harness',
  v: 'island-v',
  'create-awesome': 'island-assembly-workshop',
  community: 'island-community',
  blog: 'island-blog',
  projects: 'island-projects-neon',
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
  'Agent Tooling',
  'Linux Desktops',
  'Scientific Computing',
  'App Scaffolding',
  'Open Source',
] as const;

/**
 * Terminal line in the hero: what is being built right now (verified against
 * the repositories on 2026-09-30) — not invented telemetry.
 */
export const terminalQuote =
  'now building: the Agent Toolkit desktop app and local API, and Hornero OS development previews.';

export const nestStatus: NestStatusItem[] = [
  {
    label: 'atlas_state',
    value: `${atlasWorlds.length} worlds mapped`,
    tone: 'magenta',
  },
  {
    label: 'primary_focus',
    value: 'Agent tooling & Linux desktops',
    tone: 'cyan',
  },
  {
    label: 'toolkit_inventory',
    value: inventoryStrip(),
    tone: 'violet',
  },
  {
    label: 'dotfiles_scope',
    value: 'Personal config layer',
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

// ---------------------------------------------------------------------------
// Featured Work — four flagship portfolio areas (ADR-003, #393/#402)
//
// Editorial facts (title, path, proposition, lens, members, proof) derive
// from the portfolio taxonomy via getHomepagePortfolioAreas() — not retyped.
// Only purely visual presentation (accent token, island art) lives here.
// ---------------------------------------------------------------------------

export interface FeaturedArea {
  id: string;
  title: string;
  path: string;
  proposition: string;
  accent: 'magenta' | 'pink' | 'violet' | 'blue' | 'cyan' | 'orange';
  island: string;
  /** Derived from member timeLens via the portfolio selector. */
  lens: 'Building now' | 'Proven over time' | 'Building now · Proven over time';
  /** Member summary when the area has more than one flagship component. */
  members?: string;
  /** Member routes, rendered as separate links inside the card. */
  memberLinks: Array<{ title: string; path: string; maturity?: string }>;
  /** Contextual proof summary from member proofLines via the selector. */
  proof?: string;
}

/** Visual-only mapping per portfolio area id (presentation, not editorial facts). */
const featuredAreaVisuals: Record<FeaturedArea['id'], { accent: FeaturedArea['accent']; island: string }> = {
  agentic: { accent: 'violet', island: 'island-agent' },
  hornero: { accent: 'magenta', island: 'island-dotfiles' },
  'v-ecosystem': { accent: 'blue', island: 'island-v' },
  'create-awesome': { accent: 'orange', island: 'island-assembly-workshop' },
};

export const featuredAreas: FeaturedArea[] = getHomepagePortfolioAreas().map((area) => {
  const visual = featuredAreaVisuals[area.id];
  if (!visual) throw new Error(`Missing featured-area visual mapping for portfolio area: ${area.id}`);
  return { ...area, accent: visual.accent, island: visual.island };
});

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
