import type {
  ContributionPathway,
  ModerationItem,
  ProjectFamily,
  SupportChannel,
  WeeklyOpportunity,
  WorkshopSection,
} from '../types/index.js';
export const communityMeta = {
  discordInviteUrl: 'https://discord.gg/bR5VyATgka',
  discordBlurple: '#5865F2',
  discordBlurpleHover: '#4752C4',
  codeOfConductUrl: 'https://github.com/Create-Node-App/.github/blob/main/CODE_OF_CONDUCT.md',
  supportUrl: 'https://github.com/ulises-jeremias/dotfiles/wiki',
  communityDistinctNote:
    'Community is distinct from employer (NaNLABS) — participation is voluntary and moderated independently.',
  metricsPolicy:
    'No member counts or vanity metrics are shown without an authoritative, refreshable source. Counts are omitted by design.',
} as const;
export const workshopSections: WorkshopSection[] = [
  {
    id: 'shared-workshop',
    title: 'El taller compartido — shared workshop',
    paragraphs: [
      'Community is the shared workshop that connects every world in the Digital Nest — dotfiles, workstation, toolkit, V, and Create Awesome. It is not a broadcast channel: it is a bench where questions, drafts, and fixes circulate before they become documentation.',
      'The principle is simple: work in the open, link the evidence, and leave a path for the next person. Every pattern in this site has a provenance — a PR, a discussion, or a commit you can open. If you cannot verify it, it is not on the page.',
    ],
  },
  {
    id: 'purpose-audience',
    title: 'Who this is for — and who it is not',
    paragraphs: [
      'For builders who keep their system reproducible, their CLIs composable, and their AI assistance auditable. You may be tuning a Hyprland rice, adding an addon to cna-templates, or reviewing a VSL numerical method — the workshop welcomes the same rigor at any scale.',
      'It is not a support desk for proprietary tooling or employer-sponsored work. NaNLABS and other work contexts are mentioned for transparency only; the community has its own Code of Conduct, moderation, and privacy expectations (see below).',
    ],
  },
  {
    id: 'how-we-work',
    title: 'How we work — small boards, clear edges',
    paragraphs: [
      'We favor small, reversible contributions with typed boundaries: a docs fix with a Zod-validated frontmatter, a template addon with a test, a shell script with set -euo pipefail. Weekly triage surfaces labeled issues — good first issue, documentation, templates — so you can pick a board that matches your time and depth.',
      'Design and content decisions are recorded near the code (ADRs, PR descriptions, route tables). If a choice matters for more than one world, it is written down before it ships.',
    ],
  },
];
export const projectFamilies: ProjectFamily[] = [
  {
    id: 'node',
    label: 'Node',
    title: 'Create Awesome — Node',
    description: 'Templates + addons for frontend, backend, and full-stack. Compose files, not black boxes.',
    href: 'https://github.com/Create-Node-App/cna-templates',
    icon: '⬢',
    languages: ['TypeScript', 'Node'],
    installHint: 'npx create-awesome-node-app my-app --template react-vite --addons tailwind',
  },
  {
    id: 'python',
    label: 'Python',
    title: 'Create Awesome — Python',
    description: 'FastAPI, Django, CLI, Celery with uv. Same composition model, Python idioms.',
    href: 'https://github.com/Create-Python-App/cpa-templates',
    icon: '🐍',
    languages: ['Python', 'uv'],
    installHint: 'pipx run create-awesome-python-app my-app --template fastapi',
  },
  {
    id: 'v',
    label: 'V',
    title: 'Create Awesome — V',
    description: 'Native, fast scaffolding for the V ecosystem — experimental, typed, and reviewable.',
    href: 'https://github.com/Create-Vlang-App/cva-templates',
    icon: '⚡',
    languages: ['V'],
    installHint: 'v run create-awesome-vlang-app my-app --template vweb',
  },
];
export const weeklyOpportunities: WeeklyOpportunity[] = [
  {
    id: 'good-first-issue',
    title: 'Good first issues',
    description: 'Docs, copy, and small template addons with tests — ideal for a first PR.',
    labels: ['good first issue', 'documentation'],
    href: 'https://github.com/search?q=org%3ACreate-Node-App+org%3ACreate-Python-App+org%3ACreate-Vlang-App+label%3A%22good+first+issue%22+is%3Aopen+type%3Aissue',
  },
  {
    id: 'templates',
    title: 'Templates & addons',
    description: 'New templates or addons that compose cleanly with existing stacks.',
    labels: ['templates', 'addons'],
    href: 'https://github.com/Create-Node-App/cna-templates/issues',
  },
  {
    id: 'docs',
    title: 'Documentation',
    description: 'Clarify an ADR, fix a workflow, or expand a guide — verified docs matter as much as code.',
    labels: ['documentation', 'enhancement'],
    href: 'https://github.com/ulises-jeremias/website/issues',
  },
];
export const beginnerPathway: ContributionPathway = {
  id: 'beginner',
  title: 'Beginner — first contribution in an afternoon',
  description: 'Start small, ship with tests, and learn the review rhythm. No setup magic required.',
  audience: 'New to the workshop or short on time',
  steps: [
    {
      title: 'Read the Code of Conduct',
      description: 'Seven lines that set the tone: be kind, be precise, stay on topic.',
      href: 'https://github.com/Create-Node-App/.github/blob/main/CODE_OF_CONDUCT.md',
      label: 'Code of Conduct',
    },
    {
      title: 'Pick a labeled issue',
      description: 'Filter by good first issue or documentation. Each has scope, expected file, and review checklist.',
      href: 'https://github.com/search?q=org%3ACreate-Node-App+label%3A%22good+first+issue%22+is%3Aopen+type%3Aissue',
      label: 'Browse issues',
    },
    {
      title: 'Scaffold locally',
      description: 'Use the matching CLI (Node / Python / V) to generate a test app and reproduce the change.',
      label: 'Template + addon',
    },
    {
      title: 'Submit a focused PR',
      description: 'One concern per PR, typed at the edge (Zod), with a clear title following Conventional Commits.',
      label: 'feat(docs): clarify ...',
    },
  ],
  ctaLabel: 'Find a good first issue',
  ctaHref:
    'https://github.com/search?q=org%3ACreate-Node-App+org%3ACreate-Python-App+org%3ACreate-Vlang-App+label%3A%22good+first+issue%22+is%3Aopen+type%3Aissue',
};
export const experiencedPathway: ContributionPathway = {
  id: 'experienced',
  title: 'Experienced — shape the scaffolding',
  description: 'Design templates, CLI composition, and pipelines that survive a major version.',
  audience: 'Comfortable with Astro, CLIs, or scientific libraries',
  steps: [
    {
      title: 'Review architecture',
      description:
        'Read docs/PROJECT_STRUCTURE.md and docs/STATE_MANAGEMENT.md — feature-based, thin pages, content-first.',
      href: 'https://github.com/ulises-jeremias/website/blob/main/docs/PROJECT_STRUCTURE.md',
      label: 'Project structure',
    },
    {
      title: 'Design a template or addon',
      description:
        'Propose the file map, config surface, and test plan. Templates are static HTML until an island is justified.',
      label: 'Template + addon ADR',
    },
    {
      title: 'Wire CI and type safety',
      description: 'Astro check, ESLint, Vitest, and build must pass. Zod at the boundary, no hidden client state.',
      label: 'pnpm type-check && build',
    },
    {
      title: 'Mentor a first PR',
      description:
        'Review a beginner pathway PR with actionable, kind comments. The workshop scales when reviews teach.',
      label: 'Review & merge',
    },
  ],
  ctaLabel: 'Open a template proposal',
  ctaHref: 'https://github.com/Create-Node-App/cna-templates/issues/new',
};
export const supportChannels: SupportChannel[] = [
  {
    label: 'Code of Conduct',
    href: 'https://github.com/Create-Node-App/.github/blob/main/CODE_OF_CONDUCT.md',
    description: 'Community standards and enforcement — our shared agreement.',
    external: true,
  },
  {
    label: 'Discord — #help',
    href: 'https://discord.gg/bR5VyATgka',
    description: 'Ask in the workshop — questions, drafts, and office hours.',
    external: true,
  },
  {
    label: 'GitHub Discussions — website',
    href: 'https://github.com/ulises-jeremias/website/discussions',
    description: 'Async design and docs conversations, linked from pages.',
    external: true,
  },
  {
    label: 'Wiki — dotfiles support',
    href: 'https://github.com/ulises-jeremias/dotfiles/wiki',
    description: 'HorneroConfig setup and troubleshooting guides.',
    external: true,
  },
];
export const moderationItems: ModerationItem[] = [
  {
    title: 'Scope and independence',
    description:
      'Community spaces are not employer channels. Moderation decisions are made by community moderators, documented in PRs and issues, and appealable via the Code of Conduct process.',
  },
  {
    title: 'Privacy — minimize retention',
    description:
      'Discord handles and GitHub profiles are public by participation. No private analytics, no member counts without an authoritative refreshable source, and no tracking beyond what GitHub and Discord provide by default.',
  },
  {
    title: 'Enforcement — graduated, documented',
    description:
      'Warnings are private and specific. Repeat or severe violations lead to temporary or permanent restrictions, always with a written rationale referencing the Code of Conduct.',
  },
  {
    title: 'Accessibility — participate without Discord',
    description:
      'Every onboarding path, template decision, and weekly opportunity is also reachable via GitHub issues and docs. Discord is a convenience, not a gate.',
  },
];
