import type {
  ComparisonRow,
  CompositionExample,
  ContributionStep,
  CreateAwesomeVariant,
  DistributionChannel,
  FamilyIntro,
} from '../types/index.js';

export const familyIntro: FamilyIntro = {
  title: 'One command. Any stack.',
  lead: 'Family of CLIs that compose templates + addons into production-ready apps — not generators that hide files, but composers that ship real code you own.',
  principle: 'Template + addons = real files. No lock-in, no hidden runtime.',
};

export const distributionChannels: DistributionChannel[] = [
  {
    id: 'npm',
    label: 'npm / npx',
    command: 'npx create-awesome-node-app my-app --template react-vite --addons tailwind',
    note: 'Node — primary channel',
  },
  {
    id: 'pipx',
    label: 'pipx',
    command: 'pipx run create-awesome-python-app my-app --template fastapi',
    note: 'Python — isolated',
  },
  {
    id: 'uvx',
    label: 'uvx',
    command: 'uvx create-awesome-python-app my-app --template fastapi',
    note: 'Python — uv native',
  },
  {
    id: 'aur',
    label: 'AUR',
    command: 'yay -S create-awesome-vlang-app',
    note: 'V — Arch',
  },
  {
    id: 'brew',
    label: 'Homebrew',
    command: 'brew install create-awesome-vlang-app',
    note: 'V — macOS/Linux',
  },
  {
    id: 'docker',
    label: 'Docker',
    command: 'docker run ghcr.io/create-awesome/create-awesome-node-app my-app',
    note: 'All — containerized',
  },
];

export const variants: CreateAwesomeVariant[] = [
  {
    id: 'node',
    label: 'Node',
    title: 'create-awesome-node-app',
    description: 'Frontend, backend, full-stack, monorepo, AI-ready — the most mature family member.',
    status: 'stable',
    accent: '#9a6200',
    accentLight: '#fbbf24',
    bg: '#FFFBEB',
    install: 'npx create-awesome-node-app my-app --template react-vite --addons tailwind',
    href: 'https://create-awesome-node-app.vercel.app',
    repo: 'Create-Node-App/create-awesome-node-app',
    templates: [
      { id: 'react-vite', name: 'React + Vite', description: 'SPA with Vite, React 18, ESLint', stack: ['React', 'Vite'], featured: true },
      { id: 'nextjs', name: 'Next.js', description: 'SSR/SSG with App Router', stack: ['Next.js'] },
      { id: 'express', name: 'Express', description: 'API with Express + Zod', stack: ['Express', 'Zod'] },
      { id: 'monorepo', name: 'Monorepo', description: 'Turborepo + pnpm workspaces', stack: ['Turborepo', 'pnpm'] },
      { id: 'ai-starter', name: 'AI Starter', description: 'Vercel AI SDK + streaming', stack: ['AI SDK', 'OpenAI'] },
    ],
    addons: [
      { id: 'tailwind', name: 'Tailwind', description: 'Utility CSS', category: 'styling' },
      { id: 'shadcn', name: 'shadcn/ui', description: 'Copy-paste components', category: 'styling' },
      { id: 'drizzle', name: 'Drizzle ORM', description: 'Type-safe ORM', category: 'data' },
      { id: 'trpc', name: 'tRPC', description: 'End-to-end typesafe API', category: 'tooling' },
    ],
  },
  {
    id: 'python',
    label: 'Python',
    title: 'create-awesome-python-app',
    description: 'FastAPI, Django, CLI, Celery — batteries for API and workers.',
    status: 'stable',
    accent: '#1e5a8a',
    accentLight: '#3b82f6',
    bg: '#EFF6FF',
    install: 'pipx run create-awesome-python-app my-app --template fastapi',
    href: 'https://create-awesome-python-app.vercel.app',
    repo: 'Create-Python-App/create-awesome-python-app',
    templates: [
      { id: 'fastapi', name: 'FastAPI', description: 'Async API with Pydantic', stack: ['FastAPI', 'Pydantic'], featured: true },
      { id: 'django', name: 'Django', description: 'Batteries-included web', stack: ['Django', 'ORM'] },
      { id: 'cli', name: 'CLI', description: 'Typer + Rich CLI', stack: ['Typer', 'Rich'] },
      { id: 'celery', name: 'Celery Worker', description: 'Task queue', stack: ['Celery', 'Redis'] },
    ],
    addons: [
      { id: 'sqlalchemy', name: 'SQLAlchemy', description: 'ORM', category: 'data' },
      { id: 'alembic', name: 'Alembic', description: 'Migrations', category: 'data' },
      { id: 'ruff', name: 'Ruff', description: 'Linter/formatter', category: 'tooling' },
      { id: 'docker', name: 'Docker', description: 'Container deploy', category: 'deploy' },
    ],
  },
  {
    id: 'v',
    label: 'V',
    title: 'create-awesome-vlang-app',
    description: 'Fast, native, experimental — V + VSL/VTL for reactive UIs.',
    status: 'beta',
    accent: '#6b4a9c',
    accentLight: '#a78bfa',
    bg: '#F5F3FF',
    install: 'v run create-awesome-vlang-app my-app --template vweb',
    href: 'https://create-awesome-vlang-app.vercel.app',
    repo: 'Create-Vlang-App/create-awesome-vlang-app',
    templates: [
      { id: 'vweb', name: 'Vweb', description: 'Built-in web server', stack: ['Vweb'], featured: true },
      { id: 'cli', name: 'CLI', description: 'Flag + term UI', stack: ['flag', 'term'] },
      { id: 'vsl-demo', name: 'VSL Demo', description: 'V Standard Library showcase', stack: ['VSL'] },
      { id: 'fullstack', name: 'Fullstack', description: 'V backend + VTL frontend', stack: ['Vweb', 'VTL'] },
    ],
    addons: [
      { id: 'orm', name: 'ORM', description: 'V ORM (SQLite/PG)', category: 'data' },
      { id: 'veasel', name: 'Veasel', description: 'Mascot assets', category: 'styling' },
      { id: 'histoire', name: 'Histoire', description: 'Component docs', category: 'tooling' },
      { id: 'docker', name: 'Docker', description: 'Multi-stage build', category: 'deploy' },
    ],
  },
];

export const compositionExamples: CompositionExample[] = [
  {
    id: 'node-fullstack',
    title: 'Fullstack Node',
    variant: 'node',
    template: 'nextjs',
    addons: ['tailwind', 'drizzle', 'trpc'],
    command: 'npx create-awesome-node-app my-app --template nextjs --addons tailwind,drizzle,trpc',
  },
  {
    id: 'python-api',
    title: 'Python API',
    variant: 'python',
    template: 'fastapi',
    addons: ['sqlalchemy', 'alembic', 'ruff'],
    command: 'pipx run create-awesome-python-app my-api --template fastapi --addons sqlalchemy,alembic,ruff',
  },
  {
    id: 'v-web',
    title: 'V Web',
    variant: 'v',
    template: 'vweb',
    addons: ['orm', 'docker'],
    command: 'v run create-awesome-vlang-app my-vapp --template vweb --addons orm,docker',
  },
];

export const contributionSteps: ContributionStep[] = [
  { step: 1, title: 'Pick a family', description: 'Node, Python, or V — each lives in its own c*-templates repo.' },
  { step: 2, title: 'Add template or addon', description: 'PR a template (full stack) or addon (slice) with schema + docs.', href: 'https://github.com/Create-Node-App/cna-templates' },
  { step: 3, title: 'Build-time sync', description: 'Catalog stays in c*-templates; website composes at build, no duplication.' },
  { step: 4, title: 'Ship', description: 'Reviewed PR → new version → npm/pipx/AUR/Docker.', href: 'https://github.com/ulises-jeremias/website' },
];

export const comparisonRows: ComparisonRow[] = [
  { feature: 'Install', node: 'npx', python: 'pipx / uvx', v: 'v run / brew' },
  { feature: 'Templates', node: '5', python: '4', v: '4 (beta)' },
  { feature: 'Addons', node: '4', python: '4', v: '4' },
  { feature: 'Status', node: 'stable', python: 'stable', v: 'beta' },
];
