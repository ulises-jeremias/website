import { z } from 'astro/zod';

/**
 * Canonical Personal DX stack model.
 *
 * One website-level source of truth for how the four first-party surfaces fit
 * together after the agent-toolkit / agentic-workstation / agentic-harness
 * architecture normalization. Presentation surfaces (home, projects,
 * workstation, toolkit, harness) render from this registry instead of
 * re-describing relationships in prose.
 *
 * Sources (verified 2026-08-24):
 * - agent-toolkit@834e6f8 README + docs/CONCEPTS.md + docs/SWARM_ARCHITECTURE.md
 * - agentic-workstation@1b0ea45 README ("thin workstation" delegation note)
 * - agentic-harness@cd90943 README + AGENTS.md
 */

export const stackRoleSchema = z.enum(['environment', 'machine', 'platform', 'workspace']);
export type StackRole = z.infer<typeof stackRoleSchema>;

export const stackProjectSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  /** Site route when the project has a first-class page, else undefined. */
  path: z.string().startsWith('/').optional(),
  repo: z.string().min(1),
  role: stackRoleSchema,
  /** One sentence, responsibility-first. */
  responsibility: z.string().min(1),
  /** Concepts this project owns outright. */
  owns: z.array(z.string()).min(1),
  /** What it deliberately does NOT own — boundaries are the point. */
  doesNotOwn: z.array(z.string()).default([]),
  verifiedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type StackProject = z.infer<typeof stackProjectSchema>;

export const stackProjectIdsSchema = z.enum(['dotfiles', 'agentic-workstation', 'agent-toolkit', 'agentic-harness']);
export type StackProjectId = z.infer<typeof stackProjectIdsSchema>;

export const STACK_PROJECTS: StackProject[] = [
  {
    id: 'dotfiles',
    title: 'HorneroConfig',
    path: '/dotfiles',
    repo: 'ulises-jeremias/dotfiles',
    role: 'environment',
    responsibility: 'Makes the desktop feel mine — Hyprland, Quickshell, Smart Colors.',
    owns: ['Desktop compositor and shell configuration', 'Theme and wallpaper pipeline'],
    doesNotOwn: ['AI capabilities', 'Workspace state'],
    verifiedAt: '2026-08-07',
  },
  {
    id: 'agentic-workstation',
    title: 'Agentic Workstation',
    path: '/agentic-workstation',
    repo: 'ulises-jeremias/agentic-workstation',
    role: 'machine',
    responsibility: 'Turns a clean machine into a reproducible AI-native workstation.',
    owns: [
      'chezmoi provisioning and profiles',
      'Packages, shell, developer tooling',
      'LLM host policy and credentials wiring',
      'Toolkit installation and tmux/Herdr setup',
      'Host validation via dots-doctor',
    ],
    doesNotOwn: ['Skills, agents, loops, or MCP templates', 'Swarm orchestration', 'Workspace or engagement state'],
    verifiedAt: '2026-08-24',
  },
  {
    id: 'agent-toolkit',
    title: 'Agent Toolkit',
    path: '/agent-toolkit',
    repo: 'ulises-jeremias/agent-toolkit',
    role: 'platform',
    responsibility: 'Portable agentic capabilities plus the runtime that executes them on any tool.',
    owns: [
      'Skills, agents, MCP, plugins, products',
      'Loop definitions and loop execution',
      'Workspace, memory, and project CLIs',
      'DevCompanion queue runtime',
      'Swarm engine, recipes, budgets, gates',
    ],
    doesNotOwn: ['Machine provisioning', 'Your persistent engagement state'],
    verifiedAt: '2026-08-24',
  },
  {
    id: 'agentic-harness',
    title: 'Agentic Harness',
    path: '/agentic-harness',
    repo: 'ulises-jeremias/agentic-harness',
    role: 'workspace',
    responsibility: 'Gives the platform a persistent home — context and state that outlive any session.',
    owns: [
      'Knowledge base and learnings',
      'Persona bindings and work modes',
      'Context packs per client or project',
      'Indexed repos and project collections',
      'Loop instances, job queues, run history',
    ],
    doesNotOwn: ['Capability definitions', 'Execution engines — it calls the Toolkit'],
    verifiedAt: '2026-08-24',
  },
];

/** Lookup by registry id. */
export function getStackProject(id: StackProjectId): StackProject | undefined {
  return STACK_PROJECTS.find((project) => project.id === id);
}

/** Projects in canonical narrative order: environment → machine → platform → workspace. */
export function stackByNarrative(): StackProject[] {
  const order: StackRole[] = ['environment', 'machine', 'platform', 'workspace'];
  return order
    .map((role) => STACK_PROJECTS.find((project) => project.role === role))
    .filter((project): project is StackProject => Boolean(project));
}

/**
 * Modular adoption paths. None of these are mandatory steps — each row is a
 * valid starting point supported by the actual install flows.
 */
export interface AdoptionPath {
  id: string;
  need: string;
  projectId: StackProjectId;
  detail: string;
}

export const ADOPTION_PATHS: AdoptionPath[] = [
  {
    id: 'capabilities-only',
    need: 'I want portable AI capabilities without touching my machine setup',
    projectId: 'agent-toolkit',
    detail:
      'One binary, one install command. Deploys to Claude Code, Cursor, OpenCode, Copilot, Windsurf, Pi, Codex, and Gemini CLI.',
  },
  {
    id: 'reproducible-machine',
    need: 'I want my whole machine reproducible',
    projectId: 'agentic-workstation',
    detail: 'chezmoi apply installs packages and the Toolkit; you adopt the rest at your own pace.',
  },
  {
    id: 'persistent-context',
    need: 'I want memory and context that survive across sessions and repos',
    projectId: 'agentic-harness',
    detail: 'Clone the workspace scaffold anywhere; it drives the Toolkit CLIs against your own state.',
  },
  {
    id: 'full-stack',
    need: 'I want the full Personal DX workflow',
    projectId: 'agentic-harness',
    detail: 'Workstation provisions the machine, Toolkit executes, Harness remembers. Each part still works alone.',
  },
];

/** Ownership matrix rows — columns are Workstation / Toolkit / Harness / Project. */
export type OwnershipMark =
  'owns' | 'installs' | 'uses' | 'executes' | 'reads' | 'respects' | 'collects' | 'state' | 'no';

export interface OwnershipRow {
  concept: string;
  workstation: OwnershipMark;
  toolkit: OwnershipMark;
  harness: OwnershipMark;
  project: OwnershipMark;
}

export const OWNERSHIP_MATRIX: OwnershipRow[] = [
  { concept: 'Machine provisioning', workstation: 'owns', toolkit: 'no', harness: 'no', project: 'no' },
  { concept: 'Skill / agent definitions', workstation: 'installs', toolkit: 'owns', harness: 'uses', project: 'no' },
  { concept: 'Loop definitions', workstation: 'installs', toolkit: 'owns', harness: 'uses', project: 'no' },
  { concept: 'Loop instances + history', workstation: 'no', toolkit: 'executes', harness: 'state', project: 'no' },
  { concept: 'Swarm orchestration', workstation: 'installs', toolkit: 'owns', harness: 'uses', project: 'no' },
  { concept: 'Persistent knowledge', workstation: 'no', toolkit: 'no', harness: 'owns', project: 'no' },
  { concept: 'Engagement context packs', workstation: 'no', toolkit: 'reads', harness: 'owns', project: 'no' },
  { concept: 'Local intent (AGENTS.md)', workstation: 'no', toolkit: 'respects', harness: 'collects', project: 'owns' },
];

/** Precedence chain — verify wording stays conceptual, not runtime semantics. */
export const PRECEDENCE_CHAIN = [
  { level: 'Project intent', example: 'AGENTS.md, specs, local rules' },
  { level: 'Workspace context', example: 'Harness knowledge, personas, packs' },
  { level: 'Toolkit defaults', example: 'Skills, agents, profiles' },
  { level: 'AI tool defaults', example: 'Native behavior of your assistant' },
] as const;
