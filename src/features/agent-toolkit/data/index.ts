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
    eyebrow: 'Scene 1 · Origin',
    title: 'Single catalog — one capability, many formats',
    description: 'Skills, agents, loops escritos una vez.',
    detail: 'Fuente: skills/ · agents/ · loops/',
    icon: '📦',
    color: '#6b4a9c',
    bullets: ['SKILL.md single → plugin', 'Validation', 'Products in plugins/'],
  },
  {
    id: 'compile',
    index: 2,
    eyebrow: 'Scene 2 · Compilation',
    title: 'Tool-target compilation',
    description: 'agent-toolkit build compiles.',
    detail: 'Targets: Claude Code',
    icon: '🔀',
    color: '#7c3aed',
    bullets: ['Install detects', 'profiles/ is fallback', 'One change propagates'],
  },
  {
    id: 'knowledge',
    index: 3,
    eyebrow: 'Scene 3 · Memory',
    title: 'Persistent knowledge',
    description: 'knowledge/ + personas + packs inject.',
    detail: 'Cycle: memory search',
    icon: '🧠',
    color: '#2e6b4a',
    bullets: ['memory search', 'Personas', 'MCP templates'],
  },
  {
    id: 'loops',
    index: 4,
    eyebrow: 'Scene 4 · Loops',
    title: 'Loops by tier',
    description: 'L1 report-only → L2 → L3.',
    detail: 'Ejemplo L2 ci-sweeper',
    icon: '🔄',
    color: '#ea7a18',
    bullets: ['Budgets', 'Resumable', 'Verifier'],
  },
  {
    id: 'queue',
    index: 5,
    eyebrow: 'Scene 5 · Queue',
    title: 'DevCompanion — durable queue',
    description: 'Queue heavy work.',
    detail: 'Before queueing: llm-status',
    icon: '📡',
    color: '#475569',
    bullets: ['Handoffs', 'Trace', 'Artifacts'],
  },
  {
    id: 'recipe',
    index: 6,
    eyebrow: 'Scene 6 · Recipe',
    title: 'Recipe + roles — pair · team · full',
    description: 'Choose recipe by risk.',
    detail: 'Roles: planner → implementer',
    icon: '🧩',
    color: '#1e5a8a',
    bullets: ['Handoff por SHA', 'Persona + model', 'Plan approval'],
  },
  {
    id: 'runtime',
    index: 7,
    eyebrow: 'Scene 7 · Runtime',
    title: 'Runtime — isolated worktrees',
    description: 'Un worktree por rol.',
    detail: 'Backends: herdr ↔ tmux',
    icon: '🖥️',
    color: '#7c3aed',
    bullets: ['Herdr recomendado', 'Budgets', 'Permisos'],
  },
  {
    id: 'observe',
    index: 8,
    eyebrow: 'Scene 8 · Observability',
    title: 'Observability — trace, budgets',
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
    label: 'Persistent install',
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
  { label: 'tokens', value: 'max_total_tokens / max_role_tokens', description: 'cap per run' },
  { label: 'cost', value: 'max_cost_usd', description: 'gate' },
  { label: 'time', value: 'max_wall_seconds', description: 'wall-clock' },
  { label: 'concurrency', value: 'max_concurrency 2', description: 'limit' },
  { label: 'round-trips', value: 'max_role_round_trips 2', description: 'max' },
  { label: 'artifacts', value: 'artifact_size + handoffs', description: 'limit' },
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
