import { z } from 'astro/zod';
export const routeMetaSchema = z.object({
  path: z.string(),
  title: z.string(),
  description: z.string(),
  canonical: z.string().optional(),
});
export type RouteMeta = z.infer<typeof routeMetaSchema>;
export const routes: RouteMeta[] = [
  {
    path: '/',
    title: 'Ulises Jeremias — Digital Nest',
    description:
      'Solutions Architect, Core Team V, AUR Maintainer. Personal workshop, documentation atlas, living portfolio.',
  },
  {
    path: '/dotfiles',
    title: 'HorneroConfig — dotfiles',
    description: 'Hyprland + Quickshell + Smart Colors + chezmoi',
  },
  { path: '/agentic-workstation', title: 'Agentic Workstation', description: 'One command to AI-native workstation' },
  { path: '/agent-toolkit', title: 'Agent Toolkit', description: 'One source → many assistants' },
  { path: '/v', title: 'V Ecosystem', description: 'V, VSL, VTL, RxV, setup-v' },
  { path: '/create-awesome', title: 'Create Awesome', description: 'Choose template + addons' },
  { path: '/community', title: 'Community', description: 'Shared workshop — Discord' },
  { path: '/blog', title: 'Blog — Field notes', description: 'Writing desk' },
  { path: '/projects', title: 'Projects', description: 'Curated projects' },
  { path: '/open-source', title: 'Open Source', description: 'Evidence-based contributions' },
];
export function getRouteMeta(path: string): RouteMeta | undefined {
  return routes.find((r) => r.path === path);
}
export function canonicalUrl(path: string, site: string): string {
  return new URL(path, site).toString();
}
