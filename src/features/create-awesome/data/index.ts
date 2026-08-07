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
    label: 'npm create',
    command: 'npm create awesome-node-app@latest my-app',
    note: 'Node — primary channel',
  },
  {
    id: 'uvx',
    label: 'uvx',
    command: 'uvx create-awesome-python-app@latest my-app',
    note: 'Python — uv native',
  },
  {
    id: 'pipx',
    label: 'pipx',
    command: 'pipx run create-awesome-python-app my-app',
    note: 'Python — isolated',
  },
  {
    id: 'cva-release',
    label: 'create-vlang-app',
    command: 'curl -fsSL https://create-vlang-app.vercel.app/install.sh | sh',
    note: 'V — release binary (primary today)',
  },
  {
    id: 'aur',
    label: 'AUR',
    command: 'yay -S create-vlang-app',
    note: 'V — Arch package name',
  },
  {
    id: 'brew',
    label: 'Homebrew',
    command: 'brew install create-vlang-app',
    note: 'V — macOS/Linux',
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
    install: 'npm create awesome-node-app@latest my-app',
    href: 'https://create-awesome-node-app.vercel.app',
    repo: 'Create-Node-App/create-node-app',
    templates: [
      {
        id: 'react-vite-boilerplate',
        name: 'React + Vite',
        description: 'SPA with Vite + React',
        stack: ['React', 'Vite'],
        featured: true,
      },
      { id: 'nextjs-starter', name: 'Next.js', description: 'SSR/SSG starter', stack: ['Next.js'] },
      { id: 'nestjs-boilerplate', name: 'NestJS', description: 'API boilerplate', stack: ['NestJS'] },
      {
        id: 'turborepo-boilerplate',
        name: 'Turborepo',
        description: 'Monorepo boilerplate',
        stack: ['Turborepo', 'pnpm'],
      },
      {
        id: 'nextjs-saas-ai-starter',
        name: 'SaaS AI',
        description: 'Next.js SaaS + AI starter',
        stack: ['Next.js', 'AI'],
      },
      { id: 'astro-starter', name: 'Astro', description: 'Content-first sites', stack: ['Astro'] },
      { id: 'hono-starter', name: 'Hono', description: 'Edge-ready API', stack: ['Hono'] },
      { id: 'remix-starter', name: 'Remix', description: 'Full-stack Remix', stack: ['Remix'] },
    ],
    addons: [
      { id: 'tailwind', name: 'Tailwind', description: 'Utility CSS', category: 'styling' },
      { id: 'drizzle', name: 'Drizzle ORM', description: 'Type-safe ORM', category: 'data' },
      { id: 'trpc', name: 'tRPC', description: 'End-to-end typesafe API', category: 'tooling' },
      { id: 'docker', name: 'Docker', description: 'Container deploy', category: 'deploy' },
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
    install: 'uvx create-awesome-python-app@latest my-app',
    href: 'https://create-awesome-python-app.vercel.app',
    repo: 'Create-Python-App/create-python-app',
    templates: [
      {
        id: 'fastapi-starter',
        name: 'FastAPI',
        description: 'Async API with Pydantic',
        stack: ['FastAPI', 'Pydantic'],
        featured: true,
      },
      { id: 'django-api', name: 'Django API', description: 'Django API starter', stack: ['Django'] },
      { id: 'cli-starter', name: 'CLI', description: 'Typer-style CLI', stack: ['CLI'] },
      { id: 'celery-worker', name: 'Celery Worker', description: 'Task queue worker', stack: ['Celery'] },
      {
        id: 'uv-workspace-starter',
        name: 'uv workspace',
        description: 'uv monorepo workspace',
        stack: ['uv'],
      },
      {
        id: 'mlops-sklearn-starter',
        name: 'MLOps sklearn',
        description: 'sklearn MLOps starter',
        stack: ['sklearn'],
      },
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
    title: 'create-vlang-app',
    description: 'Fast, native, early — V web/CLI/systems plus VSL/VTL/RxV starters. Alias: create-awesome-vlang-app.',
    status: 'beta',
    accent: '#6b4a9c',
    accentLight: '#a78bfa',
    bg: '#F5F3FF',
    install: 'curl -fsSL https://create-vlang-app.vercel.app/install.sh | sh',
    href: 'https://create-vlang-app.vercel.app',
    repo: 'Create-Vlang-App/create-vlang-app',
    templates: [
      { id: 'web-server', name: 'Web server', description: 'HTTP server starter', stack: ['V'], featured: true },
      { id: 'cli-app', name: 'CLI app', description: 'Command-line app', stack: ['flag'] },
      { id: 'library-starter', name: 'Library', description: 'Reusable module', stack: ['v.mod'] },
      { id: 'systems-app', name: 'Systems', description: 'Systems-oriented app', stack: ['V'] },
      { id: 'vsl-starter', name: 'VSL starter', description: 'V Scientific Library', stack: ['VSL'] },
      { id: 'vtl-starter', name: 'VTL starter', description: 'V Tensor Library', stack: ['VTL'] },
      { id: 'rxv-starter', name: 'RxV starter', description: 'ReactiveX for V', stack: ['RxV'] },
    ],
    addons: [
      { id: 'github-setup', name: 'GitHub setup', description: 'CI + repo bootstrap', category: 'tooling' },
      { id: 'development-container', name: 'Dev container', description: 'Devcontainer profile', category: 'tooling' },
      { id: 'v-docker', name: 'Docker', description: 'Container image', category: 'deploy' },
      { id: 'v-fmt-vet', name: 'fmt + vet', description: 'v fmt / v vet hooks', category: 'tooling' },
      { id: 'v-sqlite', name: 'SQLite', description: 'SQLite persistence', category: 'data' },
      { id: 'v-postgres', name: 'Postgres', description: 'Postgres persistence', category: 'data' },
      { id: 'vtl-nn-cpu', name: 'VTL NN CPU', description: 'Tensor NN on CPU', category: 'tooling' },
      { id: 'vtl-vsl-bridge', name: 'VTL↔VSL bridge', description: 'Compose tensors with VSL LA', category: 'tooling' },
      { id: 'vsl-classical-ml', name: 'VSL classical ML', description: 'Classical ML helpers', category: 'tooling' },
      { id: 'vsl-plotting', name: 'VSL plotting', description: 'Plotting helpers', category: 'tooling' },
      { id: 'rxv-operators', name: 'RxV operators', description: 'Extra operators', category: 'tooling' },
    ],
  },
];

export const compositionExamples: CompositionExample[] = [
  {
    id: 'node-fullstack',
    title: 'Node SaaS AI',
    variant: 'node',
    template: 'nextjs-saas-ai-starter',
    addons: ['tailwind', 'drizzle'],
    command: 'npm create awesome-node-app@latest my-app -- --template nextjs-saas-ai-starter',
  },
  {
    id: 'python-api',
    title: 'Python API',
    variant: 'python',
    template: 'fastapi-starter',
    addons: ['sqlalchemy', 'alembic', 'ruff'],
    command: 'uvx create-awesome-python-app@latest my-api --template fastapi-starter',
  },
  {
    id: 'v-web',
    title: 'V Web',
    variant: 'v',
    template: 'web-server',
    addons: ['v-sqlite', 'v-docker'],
    command: 'create-vlang-app my-vapp --template web-server --addons v-sqlite,v-docker',
  },
];

export const contributionSteps: ContributionStep[] = [
  { step: 1, title: 'Pick a family', description: 'Node, Python, or V — each lives in its own c*-templates repo.' },
  {
    step: 2,
    title: 'Add template or addon',
    description: 'PR a template (full stack) or addon (slice) with schema + docs.',
    href: 'https://github.com/Create-Node-App/cna-templates',
  },
  {
    step: 3,
    title: 'Build-time sync',
    description: 'Catalog stays in c*-templates; website composes verified IDs only — no invented catalogs.',
  },
  {
    step: 4,
    title: 'Ship',
    description: 'Reviewed PR → new version → npm/uvx/AUR/release binary.',
    href: 'https://github.com/ulises-jeremias/website',
  },
];

export const comparisonRows: ComparisonRow[] = [
  { feature: 'Install', node: 'npm create', python: 'uvx / pipx', v: 'release binary / AUR' },
  { feature: 'Templates', node: '10', python: '6', v: '7 (beta)' },
  { feature: 'Addons', node: '53 extensions', python: '18', v: '11' },
  { feature: 'Status', node: 'stable', python: 'stable', v: 'beta' },
];
