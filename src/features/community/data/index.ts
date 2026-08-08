import type {
  CommunityMeta,
  CommunityProject,
  ContributionOpportunity,
  IncubatingProject,
  InterestFilter,
  ModerationItem,
  SupportChannel,
  WorkshopSection,
} from '../types/index.js';
import {
  communityProjectSchema,
  contributionOpportunitySchema,
  incubatingProjectSchema,
  interestFilterSchema,
} from '../types/index.js';

export const communityMeta: CommunityMeta = {
  discordInviteUrl: 'https://discord.gg/bR5VyATgka',
  discordBlurple: '#5865F2',
  discordBlurpleHover: '#4752C4',
  exampleCodeOfConductUrl: 'https://github.com/Create-Node-App/.github/blob/main/CODE_OF_CONDUCT.md',
  communityDistinctNote:
    'This Discord is a personal open-source workshop — not a NaNLABS or employer channel. Participation is voluntary.',
  metricsPolicy:
    'No member counts or vanity metrics without an authoritative, refreshable source. Counts are omitted by design.',
};

/**
 * Verified GitHub search spanning community-enabled repos + Create Awesome orgs.
 * EDITORIAL: keep in sync with communityProjects[].repo / org fields.
 */
export const COMMUNITY_ISSUE_SEARCH_BASE =
  'repo:ulises-jeremias/dotfiles OR repo:ulises-jeremias/agentic-workstation OR repo:ulises-jeremias/agentic-harness OR repo:ulises-jeremias/agent-toolkit OR org:Create-Node-App OR org:Create-Python-App OR org:Create-Vlang-App';

export function communityIssueSearch(extraQuery: string): string {
  const q = `${COMMUNITY_ISSUE_SEARCH_BASE} ${extraQuery} is:open type:issue`;
  return `https://github.com/search?q=${encodeURIComponent(q)}&type=issues`;
}

export const workshopSections: WorkshopSection[] = [
  {
    id: 'one-discord-many-projects',
    title: 'One Discord. Many projects.',
    paragraphs: [
      "Digital Nest Community is the shared workshop behind Ulises' open-source work — Personal DX, agentic tooling, Create Awesome, V ecosystem contributions, and whatever ships next. Join for a rice, a skill, a template, a tensor bug, or just to follow experiments.",
      'Create Awesome is one family inside the workshop. It does not define the community.',
    ],
  },
  {
    id: 'cross-pollination',
    title: 'Cross-pollination is the point',
    paragraphs: [
      'Someone can arrive for Create Awesome Python and later ship a docs fix in Agent Toolkit, or help with HorneroConfig Smart Colors. Ecosystems overlap on purpose — Linux, CLIs, agents, and scientific tooling share the same bench.',
      'You do not need a contribution plan to join. Ask questions, review drafts, learn, or pick an issue when something clicks.',
    ],
  },
  {
    id: 'how-we-work',
    title: 'Discord for talk. GitHub for the trail.',
    paragraphs: [
      'Use Discord for quick questions and coordination. Prefer GitHub issues, PRs, and docs for durable decisions so the next person can follow the evidence.',
      'Opportunities range from documentation and tests to CLI work, templates, architecture, and research spikes. Some are excellent first PRs; others are deep. New contribution opportunities are shared regularly across the ecosystem — no invented weekly schedule.',
      'Contribute with AI, without AI, or with a deliberate mix. The workshop is also a place to keep practicing real engineering judgment.',
    ],
  },
];

const _projects: CommunityProject[] = [
  {
    id: 'horneroconfig',
    name: 'HorneroConfig',
    summary: 'Reproducible Linux desktop — Hyprland, Quickshell, Smart Colors, rices.',
    ecosystem: 'personal-dx',
    alsoIn: [],
    repo: 'ulises-jeremias/dotfiles',
    website: 'https://github.com/ulises-jeremias/dotfiles',
    worldPath: '/dotfiles',
    state: 'active',
    communityEnabled: true,
    contributionAreas: ['rices/themes', 'Smart Colors', 'shell tooling', 'docs'],
    interests: ['linux-desktop', 'documentation', 'beginner'],
    beginnerFriendly: true,
    role: 'Creator',
    source: 'github',
  },
  {
    id: 'agentic-workstation',
    name: 'Agentic Workstation',
    summary: 'Thin machine provisioning — chezmoi, profiles, LLM policy, Toolkit uplink.',
    ecosystem: 'personal-dx',
    alsoIn: [],
    repo: 'ulises-jeremias/agentic-workstation',
    worldPath: '/agentic-workstation',
    state: 'active',
    communityEnabled: true,
    contributionAreas: ['provisioning', 'profiles', 'docs', 'doctor checks'],
    interests: ['linux-desktop', 'ai-agents', 'devops-infra', 'documentation'],
    beginnerFriendly: true,
    role: 'Creator',
    source: 'github',
  },
  {
    id: 'agentic-harness',
    name: 'Agentic Harness',
    summary: 'Persistent AI workspace — memory, personas, packs, and autonomous loops.',
    ecosystem: 'agentic',
    alsoIn: ['personal-dx'],
    repo: 'ulises-jeremias/agentic-harness',
    state: 'active',
    communityEnabled: true,
    contributionAreas: ['workspace runtime', 'memory/personas', 'docs', 'loops'],
    interests: ['ai-agents', 'documentation', 'testing'],
    beginnerFriendly: false,
    role: 'Creator',
    source: 'github',
  },
  {
    id: 'agent-toolkit',
    name: 'Agent Toolkit',
    summary: 'Composable capabilities — skills, agents, loops, MCP, swarm recipes, Herdr/tmux surfaces.',
    ecosystem: 'agentic',
    alsoIn: [],
    repo: 'ulises-jeremias/agent-toolkit',
    worldPath: '/agent-toolkit',
    state: 'active',
    communityEnabled: true,
    contributionAreas: ['skills', 'agents', 'loops', 'MCP', 'docs', 'plugins'],
    interests: ['ai-agents', 'documentation', 'testing', 'beginner'],
    beginnerFriendly: true,
    role: 'Creator',
    source: 'github',
  },
  {
    id: 'create-awesome-node',
    name: 'Create Awesome — Node',
    summary: 'Composable Node scaffolds — templates + extensions you own.',
    ecosystem: 'create-awesome',
    alsoIn: [],
    org: 'Create-Node-App',
    repo: 'Create-Node-App/create-node-app',
    website: 'https://create-awesome-node-app.vercel.app',
    worldPath: '/create-awesome#node',
    state: 'active',
    communityEnabled: true,
    contributionAreas: ['CLI', 'templates', 'extensions', 'docs', 'CI'],
    interests: ['node', 'documentation', 'testing', 'beginner'],
    beginnerFriendly: true,
    role: 'Creator',
    source: 'github',
  },
  {
    id: 'create-awesome-python',
    name: 'Create Awesome — Python',
    summary: 'Composable Python scaffolds with uv — FastAPI, Django, CLI, workers.',
    ecosystem: 'create-awesome',
    alsoIn: [],
    org: 'Create-Python-App',
    repo: 'Create-Python-App/create-python-app',
    website: 'https://create-awesome-python-app.vercel.app',
    worldPath: '/create-awesome#python',
    state: 'active',
    communityEnabled: true,
    contributionAreas: ['CLI', 'templates', 'addons', 'docs', 'CI'],
    interests: ['python', 'documentation', 'testing', 'beginner'],
    beginnerFriendly: true,
    role: 'Creator',
    source: 'github',
  },
  {
    id: 'create-awesome-v',
    name: 'Create Awesome — V',
    summary: 'Native V scaffolds — web, CLI, systems, plus VSL/VTL/RxV starters.',
    ecosystem: 'create-awesome',
    alsoIn: ['v-ecosystem'],
    org: 'Create-Vlang-App',
    repo: 'Create-Vlang-App/create-vlang-app',
    website: 'https://create-awesome-vlang-app.vercel.app',
    worldPath: '/create-awesome#v',
    state: 'experimental',
    communityEnabled: true,
    contributionAreas: ['CLI', 'templates', 'addons', 'docs'],
    interests: ['v', 'documentation', 'testing'],
    beginnerFriendly: false,
    role: 'Creator',
    source: 'github',
  },
  {
    id: 'vsl',
    name: 'VSL',
    summary: 'V Scientific Library — numerics and scientific tooling in V.',
    ecosystem: 'v-ecosystem',
    alsoIn: [],
    repo: 'vlang/vsl',
    worldPath: '/v#vsl',
    state: 'maintained',
    communityEnabled: true,
    contributionAreas: ['numerics', 'docs', 'tests', 'backends'],
    interests: ['v', 'testing', 'documentation'],
    beginnerFriendly: false,
    role: 'Maintainer',
    source: 'github',
  },
  {
    id: 'vtl',
    name: 'VTL',
    summary: 'V Tensor Library — tensors, autograd, experimental GPU paths.',
    ecosystem: 'v-ecosystem',
    alsoIn: [],
    repo: 'vlang/vtl',
    worldPath: '/v#vtl',
    state: 'experimental',
    communityEnabled: true,
    contributionAreas: ['tensors', 'autograd', 'docs', 'tests'],
    interests: ['v', 'testing', 'documentation'],
    beginnerFriendly: false,
    role: 'Maintainer',
    source: 'github',
  },
  {
    id: 'rxv',
    name: 'RxV',
    summary: 'ReactiveX for V — observables and channel pipelines.',
    ecosystem: 'v-ecosystem',
    alsoIn: [],
    repo: 'ulises-jeremias/rxv',
    worldPath: '/v#rxv',
    state: 'experimental',
    communityEnabled: true,
    contributionAreas: ['operators', 'docs', 'tests'],
    interests: ['v', 'testing', 'documentation'],
    beginnerFriendly: false,
    role: 'Creator',
    source: 'github',
  },
  {
    id: 'setup-v',
    name: 'setup-v',
    summary: 'GitHub Action to install and cache V across OSes.',
    ecosystem: 'v-ecosystem',
    alsoIn: [],
    repo: 'vlang/setup-v',
    worldPath: '/v#setup-v',
    state: 'maintained',
    communityEnabled: true,
    contributionAreas: ['CI action', 'docs', 'caching'],
    interests: ['v', 'devops-infra', 'documentation'],
    beginnerFriendly: true,
    role: 'Maintainer',
    source: 'github',
  },
];

export const communityProjects: CommunityProject[] = _projects.map((p) => communityProjectSchema.parse(p));

export const incubatingProjects: IncubatingProject[] = [
  incubatingProjectSchema.parse({
    id: 'skypiea-home',
    workingTitle: 'Skypiea-Home',
    summary: 'HomeLab tooling and automation — incubating with a partner. Public details stay high-level on purpose.',
    themes: ['HomeLab', 'Proxmox', 'Home Assistant', 'infrastructure automation'],
    public: true,
    ecosystem: 'lab',
  }),
  incubatingProjectSchema.parse({
    id: 'horneroos',
    workingTitle: 'HorneroOS',
    summary: 'Arch-based distribution concept — incubating. No public repository yet.',
    themes: ['Arch Linux', 'distribution', 'installer'],
    public: true,
    ecosystem: 'lab',
  }),
  incubatingProjectSchema.parse({
    id: 'agent-workspace-experiment',
    workingTitle: 'New agent workspace',
    summary: 'Unnamed experiment exploring desktop / AI-agent tooling. No public name or repo yet.',
    themes: ['agent interfaces', 'developer tooling', 'desktop'],
    public: true,
    ecosystem: 'agentic',
  }),
];

export const interestFilters: InterestFilter[] = [
  interestFilterSchema.parse({ id: 'beginner', label: 'Easy first PR', hint: 'Docs, labels, small fixes' }),
  interestFilterSchema.parse({ id: 'linux-desktop', label: 'Linux / DevEx', hint: 'HorneroConfig & workstation' }),
  interestFilterSchema.parse({ id: 'ai-agents', label: 'AI / agents', hint: 'Toolkit, harness, workflows' }),
  interestFilterSchema.parse({ id: 'node', label: 'Node', hint: 'Create Awesome Node' }),
  interestFilterSchema.parse({ id: 'python', label: 'Python', hint: 'Create Awesome Python' }),
  interestFilterSchema.parse({ id: 'v', label: 'V / scientific', hint: 'VSL, VTL, RxV, CVA' }),
  interestFilterSchema.parse({
    id: 'devops-infra',
    label: 'DevOps / infra',
    hint: 'CI, provisioning, HomeLab themes',
  }),
  interestFilterSchema.parse({ id: 'documentation', label: 'Docs', hint: 'Guides, ADRs, clarity' }),
  interestFilterSchema.parse({ id: 'design', label: 'Design', hint: 'Visual & UX contributions' }),
  interestFilterSchema.parse({ id: 'testing', label: 'Testing', hint: 'Coverage, CI, repros' }),
];

export const contributionOpportunities: ContributionOpportunity[] = [
  contributionOpportunitySchema.parse({
    id: 'good-first-issue',
    title: 'Good first issues',
    description: 'Labeled starter work across Personal DX, agentic tooling, and Create Awesome.',
    interests: ['beginner', 'documentation'],
    labels: ['good first issue'],
    href: communityIssueSearch('label:"good first issue"'),
  }),
  contributionOpportunitySchema.parse({
    id: 'documentation',
    title: 'Documentation',
    description: 'Clarify guides, READMEs, and contribution docs across the ecosystem.',
    interests: ['documentation', 'beginner'],
    labels: ['documentation'],
    href: communityIssueSearch('label:documentation'),
  }),
  contributionOpportunitySchema.parse({
    id: 'agent-toolkit',
    title: 'Agent Toolkit',
    description: 'Skills, agents, loops, MCP templates, and swarm docs.',
    interests: ['ai-agents', 'testing'],
    labels: [],
    href: 'https://github.com/ulises-jeremias/agent-toolkit/issues',
  }),
  contributionOpportunitySchema.parse({
    id: 'personal-dx',
    title: 'Personal DX',
    description: 'HorneroConfig, workstation provisioning, and harness workspace issues.',
    interests: ['linux-desktop', 'devops-infra'],
    labels: [],
    href: communityIssueSearch(
      '(repo:ulises-jeremias/dotfiles OR repo:ulises-jeremias/agentic-workstation OR repo:ulises-jeremias/agentic-harness)',
    ),
  }),
  contributionOpportunitySchema.parse({
    id: 'create-awesome',
    title: 'Create Awesome family',
    description: 'CLIs, templates, addons/extensions across Node, Python, and V.',
    interests: ['node', 'python', 'v'],
    labels: ['templates', 'addons'],
    href: communityIssueSearch('(org:Create-Node-App OR org:Create-Python-App OR org:Create-Vlang-App)'),
  }),
  contributionOpportunitySchema.parse({
    id: 'v-ecosystem',
    title: 'V ecosystem',
    description: 'Scientific, tensor, reactive, and CI work where Ulises maintains or creates.',
    interests: ['v', 'testing'],
    labels: [],
    href: communityIssueSearch('(repo:vlang/vsl OR repo:vlang/vtl OR repo:ulises-jeremias/rxv OR repo:vlang/setup-v)'),
  }),
];

export const supportChannels: SupportChannel[] = [
  {
    label: 'Join Discord',
    href: communityMeta.discordInviteUrl,
    description: 'Live questions and coordination across Digital Nest projects.',
    external: true,
  },
  {
    label: 'Browse ecosystem issues',
    href: communityIssueSearch(''),
    description: 'GitHub remains the durable trail for issues, PRs, and decisions.',
    external: true,
  },
  {
    label: 'Open Source evidence',
    href: '/open-source',
    description: 'Contribution evidence and project surface on this site.',
    external: false,
  },
  {
    label: 'Projects ledger',
    href: '/projects',
    description: 'Curated project catalog — distinct from this workshop page.',
    external: false,
  },
  {
    label: 'Create Node App Code of Conduct',
    href: communityMeta.exampleCodeOfConductUrl,
    description: 'Example project-org CoC — not automatically universal for every Digital Nest space.',
    external: true,
  },
];

export const moderationItems: ModerationItem[] = [
  {
    title: 'Scope',
    description:
      'This is a personal open-source workshop, not an employer community. Be respectful; follow GitHub and Discord platform rules plus any Code of Conduct published by the specific project you contribute to.',
  },
  {
    title: 'Privacy',
    description:
      'Discord handles and GitHub profiles are public by participation. This site does not add private analytics or fabricated member counts. Discord and GitHub retain data under their own policies.',
  },
  {
    title: 'Codes of Conduct',
    description:
      'There is not yet a single Digital Nest–wide Code of Conduct. Create Node App publishes one for that organization; other projects may differ. A shared community CoC is a recommended future improvement — not something we invent here.',
  },
  {
    title: 'Discord is optional',
    description:
      'You can follow and contribute entirely through GitHub. Discord is for conversation; it is not a gate.',
  },
];

export const ecosystemLabels: Record<CommunityProject['ecosystem'], string> = {
  'personal-dx': 'Personal DX',
  agentic: 'Agentic tooling',
  'create-awesome': 'Create Awesome',
  'v-ecosystem': 'V ecosystem',
  lab: 'Lab / experiments',
};

export const activeWorkshopProjects = communityProjects.filter((p) => p.communityEnabled);

export function projectsForInterest(interest: CommunityProject['interests'][number]): CommunityProject[] {
  return activeWorkshopProjects.filter((p) => p.interests.includes(interest));
}

export function validateCommunityRegistry(
  projects: CommunityProject[] = communityProjects,
  incubating: IncubatingProject[] = incubatingProjects,
): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const p of projects) {
    const parsed = communityProjectSchema.safeParse(p);
    if (!parsed.success) errors.push(`[${p.id}] ${parsed.error.message}`);
    if (ids.has(p.id)) errors.push(`Duplicate project id: ${p.id}`);
    ids.add(p.id);
    if (!p.communityEnabled) errors.push(`[${p.id}] communityEnabled must be true in registry export`);
  }
  for (const i of incubating) {
    const parsed = incubatingProjectSchema.safeParse(i);
    if (!parsed.success) errors.push(`[incubating:${i.id}] ${parsed.error.message}`);
    if (ids.has(i.id)) errors.push(`Incubating id collides with project: ${i.id}`);
  }
  return errors;
}
