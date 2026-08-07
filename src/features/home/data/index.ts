import { profile } from '@/data/profile.js';
import { featuredWorlds as canonicalFeaturedWorlds, worldsByPriority } from '@/data/project-worlds.js';
import type { AtlasWorld, ContactLink, FeaturedProjectRow, NestStatusItem } from '../types/index.js';

export const atlasWorlds: AtlasWorld[] = worldsByPriority.map((world, index) => ({
  id: world.id,
  number: String(index + 1).padStart(2, '0'),
  title: world.title,
  description: world.description,
  path: world.path,
  theme: world.theme,
  accent: world.accent,
  illustration: world.illustration,
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
    label: 'operating_mode',
    value: 'Open source · systems · documentation',
    tone: 'violet',
  },
  {
    label: 'home_base',
    value: profile.location,
    tone: 'muted',
  },
];

export const featuredProjectLedger: FeaturedProjectRow[] = canonicalFeaturedWorlds.map((world) => ({
  id: world.id,
  title: world.title,
  description: world.description,
  path: world.path,
  accent: world.accent,
  illustration: world.illustration,
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
