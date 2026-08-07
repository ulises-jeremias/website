import type { BudgetItem, CapabilityItem, InstallSnippet, SwarmScene, ToolkitOverviewSection } from '../types/index.js';

export const toolkitOverview: ToolkitOverviewSection[] = [
  {
    id: 'principle',
    title: 'One source → many assistants',
    paragraphs: ['Agent Toolkit is a composable collection.', 'The design is explicit over implicit.'],
  },
  {
    id: 'layers',
    title: 'Three-layer stack — workstation · toolkit · overlay',
    paragraphs: ['L1 (Workstation) provisions.', 'Precedence is project overlay > toolkit defaults.'],
  },
  {
    id: 'delivery',
    title: 'Delivery, not demo',
    paragraphs: ['Toolkit capabilities are built for agentic-harness.', 'Install is one command.'],
  },
];

export const toolkitStats = [
  { label: 'skills', value: '61', hint: 'across 9 domains' },
  { label: 'agents', value: '16', hint: 'persona constraints' },
  { label: 'loops', value: '10', hint: 'L1/L2/L3 templates' },
  { label: 'profiles', value: '6', hint: 'native tool targets' },
];

export const capabilities: CapabilityItem[] = [
  {
    id: 'skills',
    title: 'Skills — reusable capability units',
    description: 'A skill is a directory with one SKILL.md.',
    icon: '🧰',
    color: '#6b4a9c',
    stats: [
      { label: 'total', value: '61' },
      { label: 'domains', value: '9' },
      { label: 'spec', value: 'SKILL.md' },
    ],
    highlights: ['delivery 21 · core 6', 'frontmatter-only', 'single source'],
    details: ['Domains: core', 'Deploy: Claude Code', 'Verify: agent-toolkit inventory'],
    href: 'https://github.com/ulises-jeremias/agent-toolkit/tree/main/skills',
  },
  {
    id: 'loops',
    title: 'Loops — recurring workflows',
    description: 'A loop is loops/<name>/loop.yaml.',
    icon: '🔄',
    color: '#ea7a18',
    stats: [
      { label: 'templates', value: '10' },
      { label: 'tiers', value: 'L1·L2·L3' },
      { label: 'cadence', value: '15m → 1w' },
    ],
    highlights: ['L1 report-only', 'L2 controlled', 'L3 high-autonomy'],
    details: ['Each loop declares allowlist', 'Resumable', 'Run: agent-toolkit loop run'],
    href: 'https://github.com/ulises-jeremias/agent-toolkit/blob/main/docs/LOOPS.md',
  },
  {
    id: 'knowledge',
    title: 'Knowledge — persistent memory',
    description: 'Filesystem-first memory.',
    icon: '🧠',
    color: '#2e6b4a',
    stats: [
      { label: 'stores', value: 'knowledge/' },
      { label: 'packs', value: '3' },
      { label: 'personas', value: '16' },
    ],
    highlights: ['memory search/add/inject', 'packs: oss-maintenance', 'personas: architect'],
    details: ['Memory lifecycle', 'Packs compose', 'Profiles never store secrets'],
    href: 'https://github.com/ulises-jeremias/agent-toolkit/blob/main/docs/ARCHITECTURE.md',
  },
  {
    id: 'devcompanion',
    title: 'DevCompanion — queued background work',
    description: 'A queue for heavy work.',
    icon: '📡',
    color: '#475569',
    stats: [
      { label: 'templates', value: '5+' },
      { label: 'backends', value: 'herdr·tmux' },
      { label: 'harness', value: 'queue→run-once' },
    ],
    highlights: ['queue: outbox→queued', 'run-once', 'status/done/log'],
    details: ['Wire workspace CLI', 'One command', 'Use for code review'],
    href: 'https://github.com/ulises-jeremias/agent-toolkit/blob/main/docs/SWARMS.md',
  },
];

export const swarmScenes: SwarmScene[] = [
  {
    id: 'catalog',
    index: 1,
    eyebrow: 'Escena 1 · Origen',
    title: 'Catálogo único — una capacidad, muchos formatos',
    description: 'Skills, agents, loops escritos una vez.',
    detail: 'Fuente: skills/ · agents/ · loops/',
    icon: '📦',
    color: '#6b4a9c',
    bullets: ['SKILL.md único → plugin', 'Validación', 'Productos en plugins/'],
  },
  {
    id: 'compile',
    index: 2,
    eyebrow: 'Escena 2 · Compilación',
    title: 'Compilación por herramienta',
    description: 'agent-toolkit build compila.',
    detail: 'Destinos: Claude Code',
    icon: '🔀',
    color: '#7c3aed',
    bullets: ['Instalación detecta', 'profiles/ es fallback', 'Un cambio propaga'],
  },
  {
    id: 'knowledge',
    index: 3,
    eyebrow: 'Escena 3 · Memoria',
    title: 'Conocimiento persistente',
    description: 'knowledge/ + personas + packs inyectan.',
    detail: 'Ciclo: memory search',
    icon: '🧠',
    color: '#2e6b4a',
    bullets: ['memory search', 'Personas', 'MCP templates'],
  },
  {
    id: 'loops',
    index: 4,
    eyebrow: 'Escena 4 · Loops',
    title: 'Loops por tiers',
    description: 'L1 report-only → L2 → L3.',
    detail: 'Ejemplo L2 ci-sweeper',
    icon: '🔄',
    color: '#ea7a18',
    bullets: ['Budgets', 'Resumable', 'Verifier'],
  },
  {
    id: 'queue',
    index: 5,
    eyebrow: 'Escena 5 · Queue',
    title: 'DevCompanion — cola durable',
    description: 'Encola trabajo pesado.',
    detail: 'Antes de encolar: llm-status',
    icon: '📡',
    color: '#475569',
    bullets: ['Handoffs', 'Trace', 'Artifacts'],
  },
  {
    id: 'recipe',
    index: 6,
    eyebrow: 'Escena 6 · Receta',
    title: 'Receta + roles — pair · team · full',
    description: 'Elige receta según riesgo.',
    detail: 'Roles: planner → implementer',
    icon: '🧩',
    color: '#1e5a8a',
    bullets: ['Handoff por SHA', 'Persona + model', 'Plan approval'],
  },
  {
    id: 'runtime',
    index: 7,
    eyebrow: 'Escena 7 · Runtime',
    title: 'Runtime — worktrees aislados',
    description: 'Un worktree por rol.',
    detail: 'Backends: herdr ↔ tmux',
    icon: '🖥️',
    color: '#7c3aed',
    bullets: ['Herdr recomendado', 'Budgets', 'Permisos'],
  },
  {
    id: 'observe',
    index: 8,
    eyebrow: 'Escena 8 · Observabilidad',
    title: 'Observabilidad — trace, budgets',
    description: 'Cada run deja run.yaml.',
    detail: 'Consultas: swarm status',
    icon: '📊',
    color: '#0f766e',
    bullets: ['Machine-readable', 'Control', 'Offline'],
  },
];

export const installSnippets: InstallSnippet[] = [
  {
    label: 'Preferido (uv)',
    command: 'uvx --from agent-toolkit-cli agent-toolkit install\nagent-toolkit doctor',
    note: 'Autodetecta.',
  },
  {
    label: 'Instalación persistente',
    command: 'uv tool install agent-toolkit-cli\nagent-toolkit install',
    note: 'Persistente.',
  },
  {
    label: 'Claude Code marketplace',
    command: '/plugin marketplace add ulises-jeremias/agent-toolkit\n/plugin install agent-toolkit-core@agent-toolkit',
    note: 'Plugins nativos.',
  },
];

export const budgetItems: BudgetItem[] = [
  { label: 'tokens', value: 'max_total_tokens / max_role_tokens', description: 'techo por run' },
  { label: 'costo', value: 'max_cost_usd', description: 'gate' },
  { label: 'tiempo', value: 'max_wall_seconds', description: 'wall-clock' },
  { label: 'concurrencia', value: 'max_concurrency 2', description: 'limita' },
  { label: 'round-trips', value: 'max_role_round_trips 2', description: 'máx' },
  { label: 'artefactos', value: 'artifact_size + handoffs', description: 'limita' },
];

export const toolkitMeta = {
  title: 'Agent Toolkit — Skills, Agents, Loops, Swarms',
  description: 'One source.',
  accent: '#6b4a9c',
  accentStrong: '#543a7d',
  violet: '#6b4a9c',
  cyan: '#38bdf8',
  orange: '#ea7a18',
  slate: '#475569',
};
