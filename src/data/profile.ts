import { z } from 'astro/zod';
export const socialLinkSchema = z.object({ label: z.string(), href: z.string().url(), icon: z.string().optional() });
export const profileSchema = z.object({
  name: z.string(),
  tagline: z.string(),
  roles: z.array(z.object({ title: z.string(), org: z.string(), href: z.string().url().optional() })),
  focus: z.array(z.string()),
  strengths: z.array(z.string()),
  socials: z.array(socialLinkSchema),
  contact: z.object({ email: z.string().email() }),
  pronouns: z.string(),
  funFact: z.string(),
});
export type Profile = z.infer<typeof profileSchema>;
export const profile: Profile = {
  name: 'Ulises Jeremias',
  tagline:
    'Solutions Architect · Core Team Member @ V · AUR Maintainer — builder of AI workflows, CLI and infra automation',
  roles: [
    { title: 'Solutions Architect', org: 'NaNLABS', href: 'https://www.nanlabs.com' },
    { title: 'Core Team Member', org: 'V', href: 'https://vlang.io' },
    { title: 'AUR Maintainer', org: 'AUR' },
  ],
  focus: ['Linux tooling', 'CLI applications', 'AI agents', 'Scientific computing'],
  strengths: ['TypeScript', 'Go', 'Shell', 'Python', 'V'],
  socials: [
    { label: 'GitHub', href: 'https://github.com/ulises-jeremias', icon: 'github' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ulises-jeremias/', icon: 'linkedin' },
    { label: 'Discord', href: 'https://discord.gg/bR5VyATgka', icon: 'discord' },
  ],
  contact: { email: 'ulisescf.24@gmail.com' },
  pronouns: 'He/Him',
  funFact: 'Identifies with the hornero — builds his own nest from scratch.',
};
