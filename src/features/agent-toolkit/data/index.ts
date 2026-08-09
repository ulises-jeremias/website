import {
  countString,
  inventory,
  inventoryCounts,
  inventoryProvenance,
  inventoryStrip,
  inventoryVersionLabel,
  skillDomainDetail,
} from './inventory.js';
import type {
  BudgetItem,
  CapabilityNode,
  CommunityCrossLink,
  DistributionTarget,
  InstallSnippet,
  QueueVsSwarmItem,
  SkillDomain,
  SwarmRecipe,
  SwarmStage,
  ToolkitOverviewSection,
  ToolkitStat,
  UiBackend,
} from '../types/index.js';

export {
  inventory,
  inventoryCounts,
  inventoryProvenance,
  inventoryStrip,
  inventoryVersionLabel,
  countString,
  skillDomainDetail,
} from './inventory.js';

/** Provenance — do not duplicate these literals elsewhere */
export const inventoryVerifiedAt = inventory.verifiedAt;
export const inventoryCommit = inventory.commit;
export const inventoryCommitFull = inventory.commitFull;
export const inventoryVersion = inventory.version;

const GH = 'https://github.com/ulises-jeremias/agent-toolkit';

export const toolkitStats: ToolkitStat[] = [
  {
    label: 'skills',
    value: countString('skills'),
    hint: `${inventoryCounts.skillDomains} domains · core ${inventory.skillDomains.find((d) => d.id === 'core')?.count ?? 0}`,
  },
  { label: 'agents', value: countString('agents'), hint: 'persona constraints' },
  { label: 'loops', value: countString('loops'), hint: 'L1 / L2 / L3' },
  { label: 'profiles', value: countString('profiles'), hint: 'native tool targets' },
  { label: 'MCP', value: countString('mcp'), hint: 'registry templates' },
];

export const skillDomains: SkillDomain[] = inventory.skillDomains;

export const capabilityNodes: CapabilityNode[] = [
  {
    id: 'skills',
    title: 'Skills',
    count: countString('skills'),
    summary: 'Reusable capability units — one SKILL.md directory each.',
    detail: skillDomainDetail(),
    href: `${GH}/tree/main/skills`,
    color: '#a05cff',
    examples: inventory.examples.skills,
  },
  {
    id: 'agents',
    title: 'Agents',
    count: countString('agents'),
    summary: 'Persona constraints that scope allow/deny actions and handoffs.',
    detail: inventory.agentIds.slice(0, 6).join(' · ') + ' · …',
    href: `${GH}/tree/main/agents`,
    color: '#ff84f1',
    examples: inventory.examples.agents,
  },
  {
    id: 'loops',
    title: 'Loops',
    count: countString('loops'),
    summary: 'Recurring workflows declared as loops/<name>/loop.yaml.',
    detail: 'L1 report-only · L2 controlled · L3 high-autonomy · resumable budgets',
    href: `${GH}/blob/main/docs/LOOPS.md`,
    color: '#ff9a4d',
    examples: inventory.examples.loops,
  },
  {
    id: 'packs',
    title: 'Packs',
    count: countString('packs'),
    summary: 'Client/project context bundles loaded into the harness overlay.',
    detail: inventory.packs.join(' · '),
    href: `${GH}/tree/main/packs`,
    color: '#1cefff',
    examples: inventory.examples.packs,
  },
  {
    id: 'plugins',
    title: 'Plugins',
    count: countString('plugins'),
    summary: 'Native marketplace products compiled from the same catalog.',
    detail: inventory.plugins.map((p) => p.replace(/^agent-toolkit-/, '')).join(' · '),
    href: `${GH}/tree/main/plugins`,
    color: '#55b9ff',
    examples: inventory.examples.plugins,
  },
  {
    id: 'mcp',
    title: 'MCP',
    count: countString('mcp'),
    summary: 'Registry + installable templates for external tool servers.',
    detail: inventory.mcp.join(' · '),
    href: `${GH}/tree/main/mcp`,
    color: '#7358ff',
    examples: inventory.examples.mcp,
  },
];

const PROFILE_LABELS: Record<string, { label: string; path: string }> = {
  'claude-code': { label: 'Claude Code', path: '~/.claude/skills + marketplace plugins' },
  cursor: { label: 'Cursor', path: 'profiles/cursor/rules/*.mdc' },
  opencode: { label: 'OpenCode', path: 'profiles/opencode/agents + opencode.json' },
  copilot: { label: 'Copilot', path: 'profiles/copilot' },
  windsurf: { label: 'Windsurf', path: 'profiles/windsurf/memories' },
  pi: { label: 'Pi', path: 'profiles/pi/skills' },
  'muse-code': { label: 'Muse Code', path: 'profiles/muse-code' },
};

export const distributionTargets: DistributionTarget[] = inventory.profiles.map((id) => ({
  id,
  label: PROFILE_LABELS[id]?.label ?? id,
  path: PROFILE_LABELS[id]?.path ?? `profiles/${id}`,
}));

/** Catalog family counts for distribution map — derived, not retyped */
export const sourceCatalogLines = [
  { label: 'skills/', count: inventoryCounts.skills },
  { label: 'agents/', count: inventoryCounts.agents },
  { label: 'loops/', count: inventoryCounts.loops },
  { label: 'packs/', count: inventoryCounts.packs },
  { label: 'plugins/', count: inventoryCounts.plugins },
  { label: 'mcp/', count: inventoryCounts.mcp },
] as const;

export const toolkitOverview: ToolkitOverviewSection[] = [
  {
    id: 'principle',
    title: 'One source → many assistants',
    paragraphs: [
      'Agent Toolkit is the L1.5 capability catalog for the Personal DX graph.',
      'Write a skill, agent, or loop once; compile it into every supported tool target.',
    ],
  },
  {
    id: 'layers',
    title: 'Workstation · toolkit · overlay',
    paragraphs: [
      'L1 provisions the machine. L1.5 distributes capabilities. The overlay holds memory and run state.',
      'Precedence is project overlay → toolkit defaults. HorneroConfig is an optional desktop sibling, not a hard dependency.',
    ],
  },
  {
    id: 'delivery',
    title: 'Delivery, not demo',
    paragraphs: [
      'Capabilities ship for agentic harnesses: budgets, handoffs, inventories, and doctor checks.',
      'Install is one command; verification is inventory + doctor — not marketing counters.',
    ],
  },
];

export const queueVsSwarm: QueueVsSwarmItem[] = [
  {
    id: 'devcompanion',
    title: 'DevCompanion — durable KEEP queue',
    summary:
      'Background job queue for heavy work: review, PR, CI fix, investigate, refactor. Not a multi-agent runtime.',
    bullets: [
      'queue → outbox → run-once → status / done / log',
      'Templates: code-review, create-pr, fix-ci, investigate, refactor',
      'LLM policy gate before client jobs (llm-status)',
    ],
    command: 'agent-toolkit devcompanion queue <project> --template code-review',
  },
  {
    id: 'swarm',
    title: 'Swarm — multi-role orchestration',
    summary:
      'Recipe-driven role topology with isolated worktrees, SHA handoffs, budgets, and governance. Separate from the queue.',
    bullets: [
      'REQUEST → recipe → roles → worktrees → handoffs → state → governance → artifact',
      'pair / team / full recipes with promote without losing run ID',
      'Herdr and tmux are UI backends over the same run state',
    ],
    command: 'agent-toolkit swarm plan --recipe pair --ui tmux --runner skeleton "…" --json',
  },
];

export const swarmStages: SwarmStage[] = [
  {
    id: 'request',
    index: 1,
    title: 'Request',
    summary: 'A concrete task enters the swarm planner.',
    detail: 'swarm plan --recipe <pair|team|full>',
  },
  {
    id: 'recipe',
    index: 2,
    title: 'Recipe',
    summary: 'Topology is selected by risk; roles stay inactive until inputs are ready.',
    detail: 'pair · team · full — promote preserves run ID',
  },
  {
    id: 'roles',
    index: 3,
    title: 'Roles',
    summary: 'Each role maps to a persona, policy, and model profile.',
    detail: 'policies: read-only · writer · reviewer-writer · integrator',
  },
  {
    id: 'worktrees',
    index: 4,
    title: 'Worktrees',
    summary: 'Isolated git worktrees per active role — no shared dirty trees.',
    detail: 'one worktree per role · runner skeleton or live',
  },
  {
    id: 'handoffs',
    index: 5,
    title: 'Handoffs',
    summary: 'Code moves only via validated 40-char commit SHAs.',
    detail: 'never uncommitted code · receive_mode task|batch',
  },
  {
    id: 'state',
    index: 6,
    title: 'State',
    summary: 'run.yaml, state.json, trace.jsonl, budget.json, ownership, approvals.',
    detail: 'atomic writes · fail closed on unclear ownership',
  },
  {
    id: 'governance',
    index: 7,
    title: 'Governance',
    summary: 'Budgets, permissions, and human approval gates.',
    detail: 'push/release/base-merge denied by default',
  },
  {
    id: 'artifact',
    index: 8,
    title: 'Artifact',
    summary: 'Reviewable outputs: diffs, plans, reports, and logs.',
    detail: 'swarm status / logs / artifacts for the run',
  },
];

/**
 * Built-in recipes from agent-toolkit swarm/recipes.py at inventory commit.
 * pair = implementer → reviewer → integrator (verified).
 */
export const swarmRecipes: SwarmRecipe[] = [
  {
    id: 'pair',
    label: 'pair',
    useWhen: 'Bugs, features, refactors — default risk.',
    roles: [
      { id: 'implementer', policy: 'writer', persona: 'tdd-guide' },
      { id: 'reviewer', policy: 'reviewer-writer', persona: 'code-reviewer' },
      { id: 'integrator', policy: 'integrator', persona: 'architect' },
    ],
  },
  {
    id: 'team',
    label: 'team',
    useWhen: 'Medium features, schema or API changes — plan approval required.',
    roles: [
      { id: 'planner', policy: 'read-only', persona: 'planner' },
      { id: 'implementer', policy: 'writer', persona: 'tdd-guide' },
      { id: 'reviewer', policy: 'reviewer-writer', persona: 'code-reviewer' },
      { id: 'architect', policy: 'integrator', persona: 'architect' },
    ],
  },
  {
    id: 'full',
    label: 'full',
    useWhen: 'Security-sensitive work, releases, migrations.',
    roles: [
      { id: 'planner', policy: 'read-only', persona: 'planner' },
      { id: 'implementer', policy: 'writer', persona: 'tdd-guide' },
      { id: 'refactorer', policy: 'writer', persona: 'refactor-cleaner' },
      { id: 'architect', policy: 'integrator', persona: 'architect' },
      { id: 'hardener', policy: 'reviewer-writer', persona: 'security-reviewer' },
      { id: 'qa', policy: 'reviewer-writer', persona: 'e2e-runner' },
    ],
  },
];

export const sharedRunStateFiles = [
  'run.yaml',
  'state.json',
  'trace.jsonl',
  'budget.json',
  'ownership.json',
  'approvals.json',
  'artifacts/',
  'handoffs/',
] as const;

export const uiBackends: UiBackend[] = [
  {
    id: 'herdr',
    title: 'Herdr',
    summary: 'Preferred workspace GUI over the same run state, approvals, and artifacts.',
    commands: [
      'agent-toolkit swarm start --recipe pair --ui herdr --runner opencode "…"',
      'agent-toolkit swarm attach RUN_ID',
      'herdr workspace open swarm-RUN_ID',
    ],
  },
  {
    id: 'tmux',
    title: 'tmux',
    summary: 'Terminal panes on an isolated socket — parity view, not a fork of the product.',
    commands: [
      'agent-toolkit swarm start --recipe pair --ui tmux --runner opencode "Fix bug"',
      'tmux -L agent-toolkit-swarm-RUN_ID attach -t swarm-RUN_ID',
      'agent-toolkit swarm plan --recipe pair --ui tmux --runner skeleton "Demo" --json',
    ],
  },
];

export const installSnippets: InstallSnippet[] = [
  {
    label: 'Preferred (uv)',
    command: 'uvx --from agent-toolkit-cli agent-toolkit install\nagent-toolkit doctor',
    note: 'Autodetects supported tool targets.',
  },
  {
    label: 'Persistent install',
    command: 'uv tool install agent-toolkit-cli\nagent-toolkit install',
    note: 'Keeps the CLI on PATH across shells.',
  },
  {
    label: 'Claude Code marketplace',
    command: '/plugin marketplace add ulises-jeremias/agent-toolkit\n/plugin install agent-toolkit-core@agent-toolkit',
    note: 'Native plugins compiled from the same catalog.',
  },
];

export const budgetItems: BudgetItem[] = [
  { label: 'tokens', value: 'max_total_tokens / max_role_tokens', description: 'cap per run' },
  { label: 'cost', value: 'max_cost_usd', description: 'spend gate' },
  { label: 'time', value: 'max_wall_seconds', description: 'wall-clock limit' },
  { label: 'concurrency', value: 'max_concurrency 2', description: 'parallel roles' },
  { label: 'round-trips', value: 'max_role_round_trips 2', description: 'pair default' },
  { label: 'artifacts', value: 'artifact_size + handoffs', description: 'size gates' },
];

export const communityCrossLink: CommunityCrossLink = {
  href: '/community',
  title: 'Community — Digital Nest workshop',
  summary: 'One station in the Digital Nest workshop — Discord + GitHub across DX, harness, Create Awesome, and V.',
  cta: 'Open the workshop',
};

/** Canonical docs deep-links (manual lives in the repo, not on this page). */
export const toolkitDocs = {
  repo: GH,
  swarm: `${GH}/blob/main/docs/SWARMS.md`,
  loops: `${GH}/blob/main/docs/LOOPS.md`,
  install: `${GH}/blob/main/docs/INSTALLATION.md`,
  skills: `${GH}/tree/main/skills`,
  agents: `${GH}/tree/main/agents`,
} as const;

/**
 * Visual archetypes for swarm role stations and agent explorer.
 * Maps recipe role ids / persona ids onto original synthwave operator props — not real people.
 */
export const personaVisuals: Record<
  string,
  {
    label: string;
    prop: string;
    glyph: 'plan' | 'code' | 'review' | 'merge' | 'shield' | 'test' | 'refactor' | 'agent';
  }
> = {
  planner: { label: 'Planner', prop: 'holographic blueprint', glyph: 'plan' },
  implementer: { label: 'Implementer', prop: 'active terminal', glyph: 'code' },
  reviewer: { label: 'Reviewer', prop: 'diff magnifier', glyph: 'review' },
  integrator: { label: 'Integrator', prop: 'merge junction', glyph: 'merge' },
  architect: { label: 'Architect', prop: 'system topology', glyph: 'merge' },
  hardener: { label: 'Hardener', prop: 'security shield', glyph: 'shield' },
  qa: { label: 'QA', prop: 'test console', glyph: 'test' },
  refactorer: { label: 'Refactorer', prop: 'cleanup tools', glyph: 'refactor' },
  'tdd-guide': { label: 'TDD Guide', prop: 'active terminal', glyph: 'code' },
  'code-reviewer': { label: 'Code Reviewer', prop: 'diff magnifier', glyph: 'review' },
  'security-reviewer': { label: 'Security Reviewer', prop: 'security shield', glyph: 'shield' },
  'e2e-runner': { label: 'E2E Runner', prop: 'test console', glyph: 'test' },
  'refactor-cleaner': { label: 'Refactor Cleaner', prop: 'cleanup tools', glyph: 'refactor' },
  'build-error-resolver': { label: 'Build Resolver', prop: 'error beacon', glyph: 'code' },
  assistant: { label: 'Assistant', prop: 'ops headset', glyph: 'agent' },
};

export const toolkitMeta = {
  title: 'Agent Toolkit — Skills, Agents, Loops, Swarms',
  description: `One source catalog: ${inventoryStrip()} — compiled into every assistant target.`,
  accent: '#a05cff',
  accentStrong: '#7358ff',
  violet: '#a05cff',
  cyan: '#1cefff',
  orange: '#ff9a4d',
  slate: '#8f88b4',
  version: inventoryVersionLabel,
  provenance: inventoryProvenance,
};

/** Transitional aliases for older imports */
export const capabilities = capabilityNodes;
export const swarmScenes = swarmStages;
