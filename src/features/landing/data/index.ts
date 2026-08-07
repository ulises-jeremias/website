export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export const landingFeatures: FeatureItem[] = [
  {
    icon: '📄',
    title: 'Static HTML output',
    description: 'Pages ship as pre-rendered HTML. No client JavaScript is included unless you add islands.',
  },
  {
    icon: '📝',
    title: 'Content collections',
    description: 'A sample blog collection under src/content/blog with list and detail routes at /blog.',
  },
  {
    icon: '🧭',
    title: 'Layouts & SEO head',
    description: 'BaseLayout and BaseHead provide shared title and meta description across pages.',
  },
  {
    icon: '🚀',
    title: 'Astro 7',
    description: 'File-based routing, TypeScript, and astro check for template-aware type safety.',
  },
  {
    icon: '🛠️',
    title: 'Lint & format',
    description: 'ESLint with eslint-plugin-astro and Prettier with prettier-plugin-astro are preconfigured.',
  },
  {
    icon: '🏝️',
    title: 'Islands-ready',
    description: 'Add @astrojs/react (or another integration) when you need interactive components — not bundled yet.',
  },
];

export const docsLinks = [
  { label: 'Project overview', href: './docs/README.md' },
  { label: 'Project structure', href: './docs/PROJECT_STRUCTURE.md' },
  { label: 'Components & styling', href: './docs/COMPONENTS_AND_STYLING.md' },
  { label: 'State management', href: './docs/STATE_MANAGEMENT.md' },
  { label: 'Project configuration', href: './docs/PROJECT_CONFIGURATION.md' },
];
