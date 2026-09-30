import { z } from 'zod';

export const profileLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().url(),
  rel: z.string().optional(),
});

export const profileRoleSchema = z.object({
  label: z.string().min(1),
  /** Distinguishes employment from open-source and community roles (About page). */
  kind: z.enum(['employment', 'open-source', 'community']).default('open-source'),
  organization: z.string().min(1).optional(),
  href: z.string().url().optional(),
  icon: z.string().optional(),
});

export const profileLinksSchema = z.object({
  github: z.string().url(),
  linkedin: z.string().url(),
  email: z.string().email(),
  discord: z.string().url(),
  /** Canonical individual-support link (ADR-004). */
  sponsors: z.string().url().startsWith('https://github.com/sponsors/'),
  twitter: z.string().url().optional(),
});

export const socialLinkSchema = z.object({
  label: z.string(),
  href: z.string().url(),
  icon: z.string().optional(),
});

export const profileSchema = z.object({
  name: z.string().min(1),
  displayName: z.string().min(1),
  pronouns: z.string().min(1),
  title: z.string().min(1),
  location: z.string().min(1),
  bio: z.string().min(20),
  summary: z.string().min(20),
  roles: z.array(profileRoleSchema).min(3),
  links: profileLinksSchema,
  focusAreas: z.array(z.string().min(1)).min(1),
  languages: z.array(z.string().min(1)).min(1),
});

export type ProfileLink = z.infer<typeof profileLinkSchema>;
export type ProfileRole = z.infer<typeof profileRoleSchema>;
export type ProfileLinks = z.infer<typeof profileLinksSchema>;
export type Profile = z.infer<typeof profileSchema> & {
  tagline: string;
  focus: string[];
  strengths: string[];
  socials: z.infer<typeof socialLinkSchema>[];
  contact: { email: string };
  funFact: string;
};

/**
 * Verified profile source of truth — mirrors https://github.com/ulises-jeremias
 * and https://github.com/ulises-jeremias/ulises-jeremias (README.md).
 * All URLs verified via GH profile README badges.
 */
const _base = profileSchema.parse({
  name: 'Ulises Jeremias',
  displayName: 'Ulises Jeremias',
  pronouns: 'He/Him',
  title: 'Solutions Architect @ NaNLABS',
  location: 'La Plata, Buenos Aires, Argentina',
  bio: 'Solutions Architect at NaNLABS and open-source builder. I create and maintain developer tooling — agent workflows, Linux desktops, scientific computing libraries for V, and app scaffolding — mostly in V, TypeScript, Python, Shell, and Go.',
  summary:
    'I build developer systems that reduce friction and keep the developer in control: portable agent tooling, reproducible Linux desktops, V scientific computing, and scaffolding that starts projects in a working state.',
  roles: [
    {
      label: 'Solutions Architect',
      kind: 'employment',
      organization: 'NaNLABS',
      href: 'https://github.com/nanlabs',
      icon: 'architecture',
    },
    {
      label: 'V Ecosystem Maintainer',
      organization: 'vlang — VSL, VTL, setup-v',
      href: 'https://github.com/vlang',
      icon: 'v-language',
    },
    {
      label: 'AUR Maintainer',
      organization: 'Arch User Repository',
      href: 'https://aur.archlinux.org/packages?SeB=m&K=ulises-jeremias',
      icon: 'package',
    },
    {
      label: 'Open-Source Maintainer',
      organization: 'Digital Nest projects',
      href: 'https://github.com/ulises-jeremias',
      icon: 'open-source',
    },
    {
      label: 'Community Host',
      kind: 'community',
      organization: 'Digital Nest Discord',
      href: 'https://discord.gg/bR5VyATgka',
      icon: 'community',
    },
  ],
  links: {
    github: 'https://github.com/ulises-jeremias',
    linkedin: 'https://www.linkedin.com/in/ulisesjcf/',
    email: 'ulisescf.24@gmail.com',
    discord: 'https://discord.gg/bR5VyATgka',
    sponsors: 'https://github.com/sponsors/ulises-jeremias',
    twitter: 'https://twitter.com/ulisesjcf',
  },
  focusAreas: [
    'Agentic developer tooling (Agent Toolkit, Workstation, Harness)',
    'Linux desktops (HorneroConfig, Hornero OS)',
    'Scientific computing for V (VSL, VTL)',
    'Application scaffolding (Create Awesome)',
  ],
  languages: ['V', 'TypeScript', 'Python', 'Shell', 'Go'],
});

export const profile: Profile = {
  ..._base,
  tagline:
    'Solutions Architect \u00b7 V ecosystem maintainer \u00b7 open-source builder \u2014 agent tooling, Linux desktops, scientific computing',
  focus: ['Agentic tooling', 'Linux desktops', 'Scientific computing', 'Scaffolding'],
  strengths: _base.languages,
  socials: [
    { label: 'GitHub', href: _base.links.github, icon: 'github' },
    { label: 'GitHub Sponsors', href: _base.links.sponsors, icon: 'heart' },
    { label: 'LinkedIn', href: _base.links.linkedin, icon: 'linkedin' },
    { label: 'Discord', href: _base.links.discord, icon: 'discord' },
  ],
  contact: { email: _base.links.email },
  funFact: 'Identifies with the hornero \u2014 builds his own nest from scratch.',
  roles: _base.roles.map((r) => ({
    ...r,
    title: r.label,
    org: r.organization ?? '',
  })) as unknown as Profile['roles'],
} as Profile;

export function getProfile(): Profile {
  return profile;
}

export function getProfileLinks(): ProfileLinks {
  return profile.links;
}

export function getProfileRoles(): ProfileRole[] {
  return profile.roles;
}

export function validateProfile(data: unknown): Profile {
  return profileSchema.parse(data) as Profile;
}
