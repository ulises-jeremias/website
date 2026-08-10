import { inventoryCounts, inventoryStrip } from '@/features/agent-toolkit/data/inventory.js';
import type {
  DoctorCheck,
  LayerMeta,
  ProvisioningStep,
  ToolkitRationalePoint,
  WorkstationIdentity,
  WorkstationProfile,
} from '../types/index.js';

/** Canonical chezmoi profiles from agentic-workstation `home/.chezmoidata/profiles.yaml` (HEAD). */
export const workstationProfiles: WorkstationProfile[] = [
  {
    id: 'technical',
    description: 'Full developer stack (node, python, docker, AI, productivity skills).',
    groups: [
      'core',
      'node',
      'python',
      'docker',
      'ai',
      'skills_jira',
      'skills_confluence',
      'skills_productivity',
      'swarm',
    ],
  },
  {
    id: 'non-technical',
    description: 'Productivity + AI only, no language runtimes.',
    groups: ['core', 'ai', 'skills_productivity', 'swarm'],
  },
  {
    id: 'ai',
    description: 'AI agents and productivity tooling, no language runtimes.',
    groups: ['core', 'ai', 'skills_productivity', 'swarm'],
  },
  {
    id: 'node',
    description: 'Node.js developer stack.',
    groups: ['core', 'node', 'skills_productivity'],
  },
  {
    id: 'python',
    description: 'Python / data developer stack.',
    groups: ['core', 'python', 'skills_productivity'],
  },
  {
    id: 'data',
    description: 'Data engineering stack (python + AI + JIRA/Confluence skills).',
    groups: ['core', 'python', 'ai', 'skills_jira', 'skills_confluence', 'skills_productivity', 'swarm'],
  },
  {
    id: 'infra',
    description: 'Infrastructure stack (docker + node + python).',
    groups: ['core', 'docker', 'node', 'python', 'skills_productivity'],
  },
  {
    id: 'minimal',
    description: 'Core CLI baseline only. Nothing else.',
    groups: ['core'],
  },
  {
    id: 'custom',
    description: 'Answer every group question yourself.',
    groups: [],
  },
];

export const workstationIdentity: WorkstationIdentity = {
  midnight: '#020617',
  cyan: '#22D3EE',
  violet: '#A78BFA',
  lime: '#84CC16',
};

export const workstationLayers: LayerMeta[] = [
  {
    id: 'hornero',
    index: 0,
    label: 'DESKTOP · OPTIONAL PATH',
    title: 'HorneroConfig',
    subtitle: 'desktop · dotfiles',
    mapping: 'HorneroConfig / desktop (optional Personal DX surface)',
    accent: '#22D3EE',
    description:
      'Optional desktop surface in the Personal DX graph — not a required predecessor of the workstation. Transforms a Linux desktop into a functional workspace via Hyprland + Quickshell + smart-colors when you want the physical nest.',
    responsibilities: [
      'Hyprland / Wayland compositor + Quickshell shell',
      '12 themes, smart-colors (python-materialyoucolor → dots/smart-colors)',
      'chezmoi home/ source state (dotfiles)',
      'Theme-intelligence: light/dark, semantic mapping',
    ],
    delivers: ['~/.config/hypr / quickshell', 'Rice configs (~/.local/share/dots)', 'Smart color cache'],
    repo: 'ulises-jeremias/dotfiles',
  },
  {
    id: 'workstation',
    index: 1,
    label: 'MACHINE · PROVISIONING',
    title: 'Workstation',
    subtitle: 'machine · provisioning',
    mapping: 'Workstation / machine',
    accent: '#A78BFA',
    description:
      'Thin agentic-workstation. Provisions the machine via chezmoi: packages, shell, secrets, LLM policy, and thin dots-* helpers. Delegates all capabilities to agent-toolkit — ships no embedded skills.',
    responsibilities: [
      'chezmoi apply: packages, shell, LLM policy (env.d)',
      'Profile-driven install (technical, non-technical, ai, node, python, data, infra, minimal, custom)',
      'dots-* thin helpers (doctor, skills, loop, devcompanion)',
      'dev-companion/runner — workstation-only runtime (kept)',
    ],
    delivers: [
      '~/.local/bin/dots-* (thin, delegate)',
      '~/.local/share/agentic-workstation/runner',
      '~/.config/agentic-workstation (LLM policy)',
    ],
    repo: 'ulises-jeremias/agentic-workstation',
  },
  {
    id: 'toolkit',
    index: 2,
    label: 'CAPABILITIES · DISTRIBUTION',
    title: 'Toolkit',
    subtitle: 'capabilities · distribution',
    mapping: 'Toolkit / capabilities',
    accent: '#84CC16',
    description: `Sole capability distribution. agent-toolkit provides ${inventoryStrip()}, MCP templates and tool profiles via uv. Single source of truth — versioned independently from the workstation.`,
    responsibilities: [
      `${inventoryCounts.skills} skills (${inventoryCounts.skillDomains} domains) + ${inventoryCounts.agents} agent personas`,
      `${inventoryCounts.loops} loop templates + tool profiles (Claude/Cursor/OpenCode…)`,
      'MCP templates + packs/prompts/schemas',
      'Symlink sync via dots-skills (delegated)',
    ],
    delivers: [
      '~/.local/share/agentic-workstation/skills-external/agent-toolkit/',
      '~/.claude/skills/, ~/.config/opencode/skills/ …',
      'Plugins: /plugin marketplace add agent-toolkit',
    ],
    repo: 'ulises-jeremias/agent-toolkit',
  },
  {
    id: 'harness',
    index: 3,
    label: 'WORKSPACE · PERSISTENT CONTEXT',
    title: 'Agentic Harness',
    subtitle: 'runtime · persistent workspace',
    mapping: 'Harness / persistent workspace context',
    accent: '#22D3EE',
    description:
      'Persistent AI workspace and runtime layer — memory, personas, packs, indexed repos, and autonomous loops. Consumes toolkit CLIs; it is not the Toolkit. Canonical repo: ulises-jeremias/agentic-harness.',
    responsibilities: [
      'knowledge/ — persistent memory across sessions',
      'personas/ + packs/ — scope + client context bundles',
      'Loop runs: trace.jsonl, state, isolation worktrees',
      'workspace-context: persona constraints + pack loading',
    ],
    delivers: ['knowledge/ · personas/ · packs/', 'loops/<name>/runs/*/report.md', 'devcompanion queue artifacts'],
    repo: 'ulises-jeremias/agentic-harness',
  },
];

export const provisioningSteps: ProvisioningStep[] = [
  {
    step: 'Chezmoi apply',
    command: 'chezmoi init --apply ulises-jeremias/agentic-workstation',
    description: 'Bootstraps machine provisioning. Applies home/ source state (shell, packages, configs) idempotently.',
    note: 'Profiles: technical · non-technical · ai · node · python · data · infra · minimal · custom (home/.chezmoidata/profiles.yaml)',
  },
  {
    step: 'Toolchain',
    command: 'uv tool install --force agent-toolkit-cli && agent-toolkit install',
    description:
      'Thin-workstation canonical path. Single installer — no AUR/pipx fallbacks. Installs skills, agents, loops, MCP, prompts and syncs per-tool symlinks.',
    note: 'Also via run_once_after_50-install-agent-toolkit.sh.tmpl + run_onchange_45-install-ai-agents.sh.tmpl (delegated)',
  },
  {
    step: 'Swarm prerequisites',
    command: 'dots-doctor && agent-toolkit swarm doctor',
    description:
      'Profile-driven swarm provisioning (install_group_swarm). Installs tmux + Herdr (brew → mise → curl) + herdr integration install opencode idempotently.',
    note: 'Uses isolated tmux socket agent-toolkit-swarm-<run-id>; never overwrites ~/.tmux.conf',
  },
  {
    step: 'Secrets & LLM policy',
    command: 'dots-devcompanion llm-status',
    description:
      'Machine-level LLM policy lives only in workstation (env.d + dots-devcompanion). Toolkit has no provider awareness. Wire before queuing background jobs.',
    note: 'Engagement policy: DOTS_AI_DEVCOMPANION_LLM_ALLOWLIST + DOTS_AI_DEVCOMPANION_LLM_STRICT=1',
  },
];

export const doctorChecks: DoctorCheck[] = [
  {
    name: 'OS & chezmoi snapshot',
    command: 'dots-doctor',
    description:
      'Pretty OS, df, chezmoi version/source-path, harness workspace path hint, env.d summary, gh auth state, skill bundle count.',
    when: 'Always — human-readable snapshot (default mode)',
  },
  {
    name: 'Swarm health',
    command: 'dots-doctor --json | jq',
    description:
      'Profile-aware swarm validation: tmux -V, herdr --version, herdr integration list --json, agent-toolkit swarm doctor.',
    when: 'When install_group_swarm=true → tmux missing = FAIL, herdr missing = WARN (tmux fallback)',
  },
  {
    name: 'Machine report',
    command: 'dots-doctor --issue',
    description: 'Markdown-friendly report (no colors) for GitHub / Slack tickets. Same snapshot, paste-ready.',
    when: 'Support tickets, CI --no-snapshot for narrow parsing',
  },
  {
    name: 'Skill drift',
    command: 'dots-doctor drift',
    description:
      'Compares registry versions vs deployed skill.json. Delegates to scripts/check-skill-drift.py (thin-workstation passthrough).',
    when: 'After toolkit upgrades; thin-workstation validate-skills.sh delegates to toolkit when empty',
  },
  {
    name: 'LLM policy gate',
    command: 'dots-devcompanion llm-status',
    description: 'Verifies active provider allowlist/strict before queuing devcompanion jobs — never invokes model.',
    when: 'Before queueing any background job for client engagements',
  },
];

export const toolkitRationale: ToolkitRationalePoint[] = [
  {
    icon: '◐',
    title: 'Thin workstation = single source of truth',
    description:
      'Workstation ships no skills/*, loops/*, mcp/*, prompts/*, agents/*, packs/teams. Catalog is provided by toolkit at runtime. Prevents duplication and version drift across machines.',
  },
  {
    icon: '⟡',
    title: 'Provisioning vs capabilities separation',
    description:
      'Workstation owns machine provisioning (chezmoi, packages, shell, secrets, LLM policy, runner). Toolkit owns capability distribution and orchestration. The two projects evolve independently.',
  },
  {
    icon: '⎋',
    title: 'Independent versioning & delivery',
    description:
      'Toolkit updates via uv tool install --force agent-toolkit-cli && agent-toolkit install without reinstalling the workstation. Also ships as Claude Code / Cursor plugin marketplace bundles.',
  },
  {
    icon: '◎',
    title: 'One sync, every AI tool',
    description:
      'dots-skills sync (delegated) creates symlinks for Claude Code, OpenCode, Cursor, Copilot, Windsurf, Pi, Codex from the same catalog. No manual per-tool copies.',
  },
];

export const thinWorkstationVerification = {
  statement:
    'Thin workstation delegates all capabilities to agent-toolkit via uv tool install --force agent-toolkit-cli && agent-toolkit install. The SKILL.md catalog is provided by the toolkit at runtime. Workstation-only runner logic (dev-companion/runner) is retained. Agentic Harness (ulises-jeremias/agentic-harness) provides persistent workspace context — it is not the Toolkit.',
  references: [
    'docs/ARCHITECTURE.md',
    'docs/AGENT_TOOLKIT.md',
    'home/dot_local/share/agentic-workstation/skills/README.md',
  ],
  noEmbedded: ['skills/*', 'loops/*', 'mcp/*', 'prompts/*', 'agents/*', 'packs/teams'],
  kept: ['dev-companion/runner', 'scopes/', 'telemetry/', 'pacman-hooks/'],
  installPath: 'uv tool install --force agent-toolkit-cli && agent-toolkit install',
};
