import { z } from 'zod';

export const profileLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().url(),
  rel: z.string().optional(),
});

export const profileRoleSchema = z.object({
  label: z.string().min(1),
  organization: z.string().min(1).optional(),
  href: z.string().url().optional(),
  icon: z.string().optional(),
});

export const profileLinksSchema = z.object({
  github: z.string().url(),
  linkedin: z.string().url(),
  email: z.string().email(),
  discord: z.string().url(),
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
  bio: 'Solutions Architect at NaNLABS, Core Team Member at V, and AUR Maintainer. I build developer tooling, AI-powered workflows, CLI apps, and infrastructure automation — mostly in TypeScript, Go, Shell, and Python.',
  summary:
    'I help teams ship reliable tooling: from workstation foundations (HorneroConfig) and AI workspaces to scientific libraries for the V language and community-driven CLIs.',
  roles: [
    {
      label: 'Solutions Architect',
      organization: 'NaNLABS',
      href: 'https://github.com/nanlabs',
      icon: '🏢',
    },
    {
      label: 'Core Team Member',
      organization: 'V Language',
      href: 'https://github.com/vlang',
      icon: '🦄',
    },
    {
      label: 'AUR Maintainer',
      organization: 'Arch User Repository',
      href: 'https://aur.archlinux.org/account/ulises-jeremias',
      icon: '📦',
    },
    {
      label: 'Open Source Enthusiast',
      icon: '🌱',
    },
  ],
  links: {
    github: 'https://github.com/ulises-jeremias',
    linkedin: 'https://www.linkedin.com/in/ulisesjcf/',
    email: 'ulisescf.24@gmail.com',
    discord: 'https://discord.gg/bR5VyATgka',
    twitter: 'https://twitter.com/ulisesjcf',
  },
  focusAreas: [
    'Linux tooling & workstation automation',
    'CLI apps & composable Node/Python/V tooling',
    'AI agents, skills, and agentic workstations',
    'Scientific computing (VSL, VTL)',
  ],
  languages: ['TypeScript', 'Go', 'Shell', 'Python', 'V'],
});

export const profile: Profile = {
  ..._base,
  tagline:
    'Solutions Architect \u00b7 Core Team Member @ V \u00b7 AUR Maintainer \u2014 builder of AI workflows, CLI and infra automation',
  focus: ['Linux tooling', 'CLI applications', 'AI agents', 'Scientific computing'],
  strengths: _base.languages,
  socials: [
    { label: 'GitHub', href: _base.links.github, icon: 'github' },
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
