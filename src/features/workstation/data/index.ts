import type {
  DoctorCheck,
  LayerMeta,
  ProvisioningStep,
  ToolkitRationalePoint,
  WorkstationIdentity,
} from '../types/index.js';

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
    label: 'L0 · DESKTOP',
    title: 'HorneroConfig',
    subtitle: 'desktop · dotfiles',
    mapping: 'HorneroConfig / desktop',
    accent: '#22D3EE',
    description:
      'Dotfiles framework named after the hornero bird. Transforms Linux desktop into a functional, beautiful workspace via Hyprland + Quickshell + smart-colors. The physical surface where code is typed.',
    responsibilities: [
      'Hyprland / Wayland compositor + Quickshell shell',
      '13+ rices, smart-colors (pywal → dots/smart-colors)',
      'chezmoi home/ source state (dotfiles)',
      'Theme-intelligence: light/dark, semantic mapping',
    ],
    delivers: ['~/.config/hypr / quickshell', 'Rice configs (~/.local/share/dots)', 'Smart color cache'],
    repo: 'ulises-jeremias/dotfiles',
  },
  {
    id: 'workstation',
    index: 1,
    label: 'L1 · MACHINE',
    title: 'Workstation',
    subtitle: 'machine · provisioning',
    mapping: 'Workstation / machine',
    accent: '#A78BFA',
    description:
      'Thin agentic-workstation. Provisions the machine via chezmoi: packages, shell, secrets, LLM policy, and thin dots-* helpers. Delegates all capabilities to agent-toolkit — ships no embedded skills.',
    responsibilities: [
      'chezmoi apply: packages, shell, LLM policy (env.d)',
      'Profile-driven install (technical / data / ai / minimal)',
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
    label: 'L1.5 · CAPABILITIES',
    title: 'Toolkit',
    subtitle: 'capabilities · distribution',
    mapping: 'Toolkit / capabilities',
    accent: '#84CC16',
    description:
      'Sole capability distribution. agent-toolkit provides 52+ skills, 16 agents, 10 loops, 6 MCP templates and profiles via uv. Single source of truth — versioned independently from the workstation.',
    responsibilities: [
      '52 skills (9 domains) + 16 agent personas',
      '10 loop templates + 6 tool profiles (Claude/Cursor/OpenCode…)',
      '6 MCP templates + packs/prompts/schemas',
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
    label: 'L2 · RUNTIME',
    title: 'Harness',
    subtitle: 'runtime · memory',
    mapping: 'Harness / runtime',
    accent: '#22D3EE',
    description:
      'Running instance — the harness that makes AI sessions stateful. Persistent knowledge, personas, packs, and loop execution. Consumes toolkit CLIs; agentic-harness / ai-workspace is the generic baseline.',
    responsibilities: [
      'knowledge/ — persistent memory across sessions',
      'personas/ + packs/ — scope + client context bundles',
      'Loop runs: trace.jsonl, state, isolation worktrees',
      'workspace-context: persona constraints + pack loading',
    ],
    delivers: ['ai-workspace/knowledge/', 'ai-workspace/personas/ & packs/', 'runs/<id>/trace.jsonl worktrees'],
    repo: 'ulises-jeremias/ai-workspace → agentic-harness',
  },
];

export const provisioningSteps: ProvisioningStep[] = [
  {
    step: 'Chezmoi apply',
    command: 'chezmoi init --apply ulises-jeremias/agentic-workstation',
    description: 'Bootstraps machine provisioning. Applies home/ source state (shell, packages, configs) idempotently.',
    note: 'Profile: technical / non-technical / ai / data / infra / minimal / custom (see home/.chezmoidata/profiles.yaml)',
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
      'Pretty OS, df, chezmoi version/source-path, ai-workspace hint, env.d summary, gh auth state, skill bundle count.',
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
      'Workstation owns machine provisioning (chezmoi, packages, shell, secrets, LLM policy, runner). Toolkit owns capability distribution. Clear L1 vs L1.5 responsibility — workstation stays lean, toolkit evolves independently.',
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
    'Thin workstation delegates all capabilities to agent-toolkit via uv tool install --force agent-toolkit-cli && agent-toolkit install. The SKILL.md catalog is provided by the toolkit at runtime. Workstation-only runner logic (dev-companion/runner) is retained.',
  references: [
    'docs/ARCHITECTURE.md',
    'docs/AGENT_TOOLKIT.md',
    'home/dot_local/share/agentic-workstation/skills/README.md',
  ],
  noEmbedded: ['skills/*', 'loops/*', 'mcp/*', 'prompts/*', 'agents/*', 'packs/teams'],
  kept: ['dev-companion/runner', 'scopes/', 'telemetry/', 'pacman-hooks/'],
  installPath: 'uv tool install --force agent-toolkit-cli && agent-toolkit install',
};
