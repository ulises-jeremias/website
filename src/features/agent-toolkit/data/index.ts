import type {
  BudgetItem,
  CapabilityNode,
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

/**
 * Inventory verified against agent-toolkit HEAD (b6700ca, 2026-08-07):
 * skills 61 across 9 domains (core 8), agents 16, loops 10,
 * profiles/targets 7, MCP templates 6, packs 3, plugins 4.
 */
export const inventoryVerifiedAt = '2026-08-07';
export const inventoryCommit = 'b6700ca';

export const toolkitStats: ToolkitStat[] = [
  { label: 'skills', value: '61', hint: '9 domains · core 8' },
  { label: 'agents', value: '16', hint: 'persona constraints' },
  { label: 'loops', value: '10', hint: 'L1 / L2 / L3' },
  { label: 'profiles', value: '7', hint: 'native tool targets' },
  { label: 'MCP', value: '6', hint: 'registry templates' },
];

export const skillDomains: SkillDomain[] = [
  { id: 'core', count: 8 },
  { id: 'delivery', count: 21 },
  { id: 'forge', count: 8 },
  { id: 'design', count: 6 },
  { id: 'ops', count: 6 },
  { id: 'integrations', count: 5 },
  { id: 'tooling', count: 4 },
  { id: 'data', count: 2 },
  { id: 'loops', count: 1 },
];

export const capabilityNodes: CapabilityNode[] = [
  {
    id: 'skills',
    title: 'Skills',
    count: '61',
    summary: 'Reusable capability units — one SKILL.md directory each.',
    detail: 'core 8 · delivery 21 · forge 8 · design 6 · ops 6 · integrations 5 · tooling 4 · data 2 · loops 1',
    href: 'https://github.com/ulises-jeremias/agent-toolkit/tree/main/skills',
    color: '#a05cff',
  },
  {
    id: 'agents',
    title: 'Agents',
    count: '16',
    summary: 'Persona constraints that scope allow/deny actions and handoffs.',
    detail: 'architect · planner · code-reviewer · security-reviewer · tdd-guide · …',
    href: 'https://github.com/ulises-jeremias/agent-toolkit/tree/main/agents',
    color: '#ff84f1',
  },
  {
    id: 'loops',
    title: 'Loops',
    count: '10',
    summary: 'Recurring workflows declared as loops/<name>/loop.yaml.',
    detail: 'L1 report-only · L2 controlled · L3 high-autonomy · resumable budgets',
    href: 'https://github.com/ulises-jeremias/agent-toolkit/blob/main/docs/LOOPS.md',
    color: '#ff9a4d',
  },
  {
    id: 'packs',
    title: 'Packs',
    count: '3',
    summary: 'Client/project context bundles loaded into the harness overlay.',
    detail: 'delivery-discipline · engineering-workflow · oss-maintenance',
    href: 'https://github.com/ulises-jeremias/agent-toolkit/tree/main/packs',
    color: '#1cefff',
  },
  {
    id: 'plugins',
    title: 'Plugins',
    count: '4',
    summary: 'Native marketplace products compiled from the same catalog.',
    detail: 'agent-toolkit-core · agents · forge · complete',
    href: 'https://github.com/ulises-jeremias/agent-toolkit/tree/main/plugins',
    color: '#55b9ff',
  },
  {
    id: 'mcp',
    title: 'MCP',
    count: '6',
    summary: 'Registry + installable templates for external tool servers.',
    detail: 'github · slack · clickup · linear · notion · figma',
    href: 'https://github.com/ulises-jeremias/agent-toolkit/tree/main/mcp',
    color: '#7358ff',
  },
];

export const distributionTargets: DistributionTarget[] = [
  { id: 'claude-code', label: 'Claude Code', path: '~/.claude/skills + marketplace plugins' },
  { id: 'cursor', label: 'Cursor', path: 'profiles/cursor/rules/*.mdc' },
  { id: 'opencode', label: 'OpenCode', path: 'profiles/opencode/agents + opencode.json' },
  { id: 'copilot', label: 'Copilot', path: 'profiles/copilot' },
  { id: 'windsurf', label: 'Windsurf', path: 'profiles/windsurf/memories' },
  { id: 'pi', label: 'Pi', path: 'profiles/pi/skills' },
  { id: 'muse-code', label: 'Muse Code', path: 'profiles/muse-code' },
];

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
    title: 'DevCompanion — durable queue',
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
    command: 'agent-toolkit swarm plan --recipe pair --ui tmux "…" --json',
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
    summary: 'run.yaml, trace.jsonl, budget.json, ownership, and approvals.',
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

export const swarmRecipes: SwarmRecipe[] = [
  {
    id: 'pair',
    label: 'pair',
    useWhen: 'Bugs, features, refactors — default risk.',
    roles: [
      { id: 'implementer', policy: 'writer' },
      { id: 'reviewer', policy: 'reviewer-writer' },
      { id: 'integrator', policy: 'integrator' },
    ],
  },
  {
    id: 'team',
    label: 'team',
    useWhen: 'Medium features, schema or API changes — plan approval required.',
    roles: [
      { id: 'planner', policy: 'read-only' },
      { id: 'implementer', policy: 'writer' },
      { id: 'reviewer', policy: 'reviewer-writer' },
      { id: 'architect', policy: 'integrator' },
    ],
  },
  {
    id: 'full',
    label: 'full',
    useWhen: 'Security-sensitive work, releases, migrations.',
    roles: [
      { id: 'planner', policy: 'read-only' },
      { id: 'implementer', policy: 'writer' },
      { id: 'refactorer', policy: 'writer' },
      { id: 'architect', policy: 'integrator' },
      { id: 'hardener', policy: 'specialist' },
      { id: 'qa', policy: 'reviewer-writer' },
    ],
  },
];

export const uiBackends: UiBackend[] = [
  {
    id: 'herdr',
    title: 'Herdr',
    summary: 'Preferred workspace GUI over the same run state, approvals, and artifacts.',
  },
  {
    id: 'tmux',
    title: 'tmux',
    summary: 'Terminal panes on an isolated socket — parity view, not a fork of the product.',
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

export const toolkitMeta = {
  title: 'Agent Toolkit — Skills, Agents, Loops, Swarms',
  description:
    'One source catalog: 61 skills, 16 agents, 10 loops, 7 profiles, 6 MCP templates — compiled into every assistant target.',
  accent: '#a05cff',
  accentStrong: '#7358ff',
  violet: '#a05cff',
  cyan: '#1cefff',
  orange: '#ff9a4d',
  slate: '#8f88b4',
};

/** Transitional aliases for older imports */
export const capabilities = capabilityNodes;
export const swarmScenes = swarmStages;
