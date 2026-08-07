import type { WorldAccent, WorldIllustration } from '@/data/project-worlds.js';

export type AtlasWorld = {
  id: string;
  number: string;
  title: string;
  description: string;
  path: string;
  theme: string;
  accent: WorldAccent;
  illustration: WorldIllustration;
  relatedWorlds: string[];
};

export type NestStatusItem = {
  label: string;
  value: string;
  tone: 'magenta' | 'cyan' | 'violet' | 'muted';
};

export type FeaturedProjectRow = Pick<AtlasWorld, 'id' | 'title' | 'description' | 'path' | 'accent' | 'illustration'>;

export type ContactLink = {
  label: string;
  href: string;
  hint: string;
  illustration: 'github' | 'linkedin' | 'email' | 'discord';
  external: boolean;
};
