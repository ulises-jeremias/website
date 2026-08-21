import { familyCatalogs } from './catalogs.js';
import { buildCreateAwesomeCommand } from '../lib/buildCommand.js';
import type {
  ComparisonRow,
  CompositionExample,
  ContributionStep,
  CreateAwesomeVariant,
  DistributionChannel,
  FamilyIntro,
} from '../types/index.js';

export { familyCatalogs } from './catalogs.js';
export {
  createAwesomeCompatibilitySnapshot,
  getCompatibilityFamily,
  getCompatibleAddons,
  isTemplateAddonCompatible,
  validateComposition,
} from './compatibility.js';
export type {
  CompatibilityAdapter,
  CompatibilityTemplate,
  CompatibilityAddon,
  CompatibilityFamily,
  CreateAwesomeCompatibilitySnapshot,
  CompositionValidationIssueCode,
  CompositionValidationIssue,
  CompositionValidationResult,
} from './compatibility.js';
export { buildCreateAwesomeCommand } from '../lib/buildCommand.js';

export const familyIntro: FamilyIntro = {
  title: 'One command. Any stack.',
  lead: 'Family of CLIs that compose templates + addons into production-ready apps — not generators that hide files, but composers that ship real code you own.',
  principle: 'Template + addons = real files. No lock-in, no hidden runtime.',
};

export const catalogTotals = {
  node: { templates: familyCatalogs.node.templateCount, addons: familyCatalogs.node.addonCount },
  python: { templates: familyCatalogs.python.templateCount, addons: familyCatalogs.python.addonCount },
  v: { templates: familyCatalogs.v.templateCount, addons: familyCatalogs.v.addonCount },
  sources: {
    node: familyCatalogs.node.source,
    python: familyCatalogs.python.source,
    v: familyCatalogs.v.source,
  },
} as const;

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
    command: 'curl -fsSL https://create-awesome-vlang-app.vercel.app/install.sh | sh',
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
    command: 'brew tap Create-Vlang-App/tap && brew install create-vlang-app',
    note: 'V — macOS/Linux tap',
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
    templates: familyCatalogs.node.templates,
    addons: familyCatalogs.node.addons,
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
    templates: familyCatalogs.python.templates,
    addons: familyCatalogs.python.addons,
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
    install: 'curl -fsSL https://create-awesome-vlang-app.vercel.app/install.sh | sh',
    href: 'https://create-awesome-vlang-app.vercel.app',
    repo: 'Create-Vlang-App/create-vlang-app',
    templates: familyCatalogs.v.templates,
    addons: familyCatalogs.v.addons,
  },
];

export const compositionExamples: CompositionExample[] = [
  {
    id: 'node-fullstack',
    title: 'Node SaaS AI',
    variant: 'node',
    template: 'nextjs-starter',
    addons: ['nextjs-tailwindcss', 'nextjs-drizzle-postgres'],
    command: buildCreateAwesomeCommand({
      family: 'node',
      projectName: 'my-app',
      template: 'nextjs-starter',
      addons: ['nextjs-tailwindcss', 'nextjs-drizzle-postgres'],
    }),
  },
  {
    id: 'python-api',
    title: 'Python API',
    variant: 'python',
    template: 'fastapi-starter',
    addons: ['github-setup', 'fastapi-sqlalchemy', 'pre-commit'],
    command: buildCreateAwesomeCommand({
      family: 'python',
      projectName: 'my-api',
      template: 'fastapi-starter',
      addons: ['github-setup', 'fastapi-sqlalchemy', 'pre-commit'],
    }),
  },
  {
    id: 'v-web',
    title: 'V Web',
    variant: 'v',
    template: 'web-server',
    addons: ['v-sqlite', 'v-docker'],
    command: buildCreateAwesomeCommand({
      family: 'v',
      projectName: 'my-vapp',
      template: 'web-server',
      addons: ['v-sqlite', 'v-docker'],
    }),
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
  { feature: 'Install', node: 'npm create', python: 'uvx / pipx', v: 'release binary / AUR / brew' },
  {
    feature: 'Templates',
    node: String(catalogTotals.node.templates),
    python: String(catalogTotals.python.templates),
    v: `${catalogTotals.v.templates} (beta)`,
  },
  {
    feature: 'Addons',
    node: `${catalogTotals.node.addons} extensions`,
    python: String(catalogTotals.python.addons),
    v: String(catalogTotals.v.addons),
  },
  { feature: 'Status', node: 'stable', python: 'stable', v: 'beta' },
  {
    feature: 'Catalog source',
    node: 'cna-templates',
    python: 'cpa-templates',
    v: 'cva-templates',
  },
];
