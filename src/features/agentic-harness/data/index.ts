/**
 * Agentic Harness — persistent workspace layer powered by Agent Toolkit.
 *
 * Sources (verified 2026-08-24, agentic-harness@cd90943):
 * - README.md (structure, quick start, key concepts)
 * - AGENTS.md (work context, persona enforcement, devcompanion routing)
 */

export const harnessMeta = {
  title: 'Agentic Harness — Persistent Workspace Context',
  description:
    'Persistent workspace context and runtime state for Agent Toolkit: knowledge, personas, packs, project collections, and loop history that outlive any AI session.',
  repo: 'https://github.com/ulises-jeremias/agentic-harness',
} as const;

export interface StateSection {
  id: string;
  title: string;
  summary: string;
  items: string[];
}

/** What the workspace owns — concrete state, not engines. */
export const workspaceStateSections: StateSection[] = [
  {
    id: 'knowledge',
    title: 'Knowledge',
    summary: 'Processes, learnings, todos, and patterns — version-controlled and searchable.',
    items: [
      'agent-toolkit memory search "topic"',
      'agent-toolkit memory inject',
      'agent-toolkit memory add --type learning "..."',
    ],
  },
  {
    id: 'context',
    title: 'Context',
    summary: 'Personas scope how the AI works; packs carry per-client and per-project context.',
    items: [
      'personas/implementer.md · reviewer · researcher · architect · writer',
      'agent-toolkit workspace use-persona reviewer',
      'agent-toolkit workspace load packs/my-client.yaml',
    ],
  },
  {
    id: 'projects',
    title: 'Projects',
    summary: 'Indexed repositories behind projects/ symlinks, cloned on demand into repos/.',
    items: [
      'agent-toolkit project clone owner/repo',
      'agent-toolkit project list',
      '.workspace.yaml org + clone policy',
    ],
  },
];

export interface RuntimeSurface {
  id: string;
  title: string;
  detail: string;
}

/** Where Toolkit execution meets Harness state. */
export const runtimeSurfaces: RuntimeSurface[] = [
  {
    id: 'loops',
    title: 'Loops',
    detail:
      'Definitions live in the Toolkit; each workspace owns its loop instances under loops/<name>/ with STATE.md checkpoints and report.md artifacts.',
  },
  {
    id: 'jobs',
    title: 'Jobs',
    detail:
      'agent-toolkit devcompanion provides queue semantics; this workspace holds templates/jobs plus the actual job state and plan artifacts.',
  },
  {
    id: 'sessions',
    title: 'Sessions',
    detail:
      'Sessions are temporary on purpose. agent-toolkit workspace context rehydrates persona constraints, loaded packs, and knowledge at the start of every one.',
  },
];

export const harnessQuickStart = [
  {
    label: 'Scaffold a workspace',
    command: 'git clone https://github.com/ulises-jeremias/agentic-harness ~/.agentic-harness',
  },
  { label: 'Initialize', command: 'cd ~/.agentic-harness && ./scripts/workspace-init.sh' },
  { label: 'Index a repository', command: 'agent-toolkit project clone owner/my-repo' },
  {
    label: 'Start a read-only loop',
    command: 'agent-toolkit loop init daily-triage && agent-toolkit loop run daily-triage',
  },
  { label: 'Review what it found', command: 'agent-toolkit loop status && agent-toolkit loop audit daily-triage' },
] as const;

/** Cross-navigation — the relationship is the content. */
export const harnessCrossLinks = [
  {
    href: '/agent-toolkit',
    title: 'Agent Toolkit',
    lead: 'Need the runtime engine?',
    detail: 'Workspace commands, loops, devcompanion queues, and swarms all execute through the Toolkit.',
  },
  {
    href: '/agentic-workstation',
    title: 'Agentic Workstation',
    lead: 'Need full host provisioning?',
    detail: 'The workstation installs the Toolkit CLI, tmux, Herdr, and the LLM host policy this workspace assumes.',
  },
] as const;

/** Packs semantics — three nouns, one word (toolkit docs/CONCEPTS.md). */
export const packSemantics = [
  {
    name: 'Solution packs',
    location: 'Toolkit repo · packs/',
    detail: 'Docs-only workflow templates (oss-maintenance, engineering-workflow…). Not loaded by the compiler.',
  },
  {
    name: 'Workspace packs',
    location: 'This workspace · packs/*.yaml',
    detail: 'Concrete client/project context loaded with agent-toolkit workspace load.',
  },
  {
    name: 'Loop packs',
    location: 'This workspace · packs/*.yaml',
    detail: 'Runtime overrides merged by agent-toolkit loop run --pack.',
  },
] as const;
