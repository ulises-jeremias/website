import type { BuildingItem, ContactLink, Proof, Strength, World } from '../types/index.js';

export const currentlyBuilding: BuildingItem[] = [
  {
    title: 'HorneroConfig',
    description:
      'Comprehensive dotfiles framework for any WM/OS — reproducible, layered, and documented like a nest built stick by stick.',
    href: 'https://github.com/ulises-jeremias/dotfiles',
    icon: '🏠',
    tag: 'dotfiles',
  },
  {
    title: 'Agentic Workstation',
    description:
      'Personal AI developer workstation — agents, skills & CLI helpers that make any assistant useful on day one.',
    href: 'https://github.com/ulises-jeremias/agentic-workstation',
    icon: '🤖',
    tag: 'workstation',
  },
  {
    title: 'Agentic Harness',
    description:
      'Portable workspace orchestrator — persistent memory, personas, skills for Claude Code, Cursor, opencode, and Gemini CLI.',
    href: 'https://github.com/ulises-jeremias/agentic-harness',
    icon: '🧭',
    tag: 'harness',
  },
  {
    title: 'V Scientific Library (VSL)',
    description:
      'Scientific computing for V — numerical methods, linear algebra, and statistics with precise, tested implementations.',
    href: 'https://github.com/vlang/vsl',
    icon: '🔬',
    tag: 'VSL',
  },
  {
    title: 'V Tensor Library (VTL)',
    description: 'Tensor and autograd for V — building ML primitives with clarity over magic.',
    href: 'https://github.com/vlang/vtl',
    icon: '🧮',
    tag: 'VTL',
  },
];

export const featuredWorlds: World[] = [
  {
    title: 'HorneroConfig',
    description:
      'Your nest, reproducible. Layered dotfiles with Chezmoi, Hyprland, and Quickshell — copy what you need, understand why it exists.',
    href: 'https://github.com/ulises-jeremias/dotfiles',
    icon: '🏠',
    eyebrow: 'dotfiles · workstation',
    tags: ['chezmoi', 'hyprland', 'reproducible'],
  },
  {
    title: 'Agentic Workstation',
    description:
      'Four layers: machine → tools → intelligence → workspace. Health checks, doctor, and skills that survive a reinstall.',
    href: 'https://github.com/ulises-jeremias/agentic-workstation',
    icon: '⚙️',
    eyebrow: 'personal DX',
    tags: ['agents', 'skills', 'doctor'],
  },
  {
    title: 'Agent Toolkit',
    description:
      'Composable AI toolkit — 52 skills, loops, packs, and MCP templates for every assistant. One source of truth, many targets.',
    href: 'https://github.com/ulises-jeremias/agent-toolkit',
    icon: '🧰',
    eyebrow: 'toolkit',
    tags: ['skills', 'loops', 'MCP'],
  },
  {
    title: 'V Language',
    description:
      'Core Team perspective: language, tooling, and ecosystem — from setup-v to the libraries that make V useful for science.',
    href: 'https://github.com/vlang',
    icon: '🦄',
    eyebrow: 'V ecosystem',
    tags: ['V', 'core-team', 'tooling'],
  },
  {
    title: 'Create Awesome',
    description:
      'Scaffold without decisions fatigue. Templates + addons that compose cleanly across Node, Python, and V.',
    href: 'https://github.com/Create-Node-App',
    icon: '🚀',
    eyebrow: 'templates',
    tags: ['CLI', 'templates', 'addons'],
  },
  {
    title: 'Community & Open Source',
    description:
      'Evidence over vanity. Contribution timelines, proof links, and pathways for beginners and maintainers.',
    href: 'https://github.com/ulises-jeremias',
    icon: '🌱',
    eyebrow: 'community',
    tags: ['OSS', 'mentorship', 'reviews'],
  },
];

export const strengths: Strength[] = [
  {
    title: 'Linux tooling & reproducibility',
    description:
      'Systems that can be rebuilt from zero and audited line by line. Chezmoi, shell, and containers over hidden state.',
    icon: '🐧',
    points: [
      'Dotfiles as code',
      'Hermetic installs & idempotent scripts',
      'Hyprland/Quickshell tailored, still portable',
    ],
  },
  {
    title: 'Composable CLIs',
    description: 'Small CLIs that compose well. Typed, tested, and documented — so they survive beyond the author.',
    icon: '⌘',
    points: [
      'create-awesome-* pattern (template + addon)',
      'Typed boundaries (Zod at the edge)',
      'Helpful --help and man pages',
    ],
  },
  {
    title: 'AI agents that actually help',
    description:
      'Agents are tools, not theatre. Skills, loops, and memory designed for solo → swarm handoffs and cost control.',
    icon: '🤝',
    points: [
      'Skills > prompts (reusable, testable)',
      'Persona & memory for continuity',
      'Herdr / tmux backends with budgets',
    ],
  },
  {
    title: 'Scientific computing, precisely',
    description:
      'Numerical code with tests, diagrams, and references — not copy-pasted formulas. Clarity over cleverness.',
    icon: '📐',
    points: [
      'VSL: structured, tested numerical methods',
      'VTL: tensor + autograd with graph clarity',
      'Docs with evidence, not claims',
    ],
  },
];

export const openSourceProofs: Proof[] = [
  {
    title: 'V Language — Core Team',
    description:
      'Shipping language tooling and scientific libraries used by the V community. Contributions are public, reviewed, and linked.',
    links: [
      { label: 'V organization', href: 'https://github.com/vlang' },
      { label: 'VSL', href: 'https://github.com/vlang/vsl' },
      { label: 'VTL', href: 'https://github.com/vlang/vtl' },
      { label: 'setup-v', href: 'https://github.com/vlang/setup-v' },
    ],
    note: 'Verified via github.com/vlang — member badge and authored commits',
  },
  {
    title: '@ NaNLABS — Open-source program lead',
    description:
      'Lead the initiative for reference repositories and boilerplates. Every public repo catalogued transparently.',
    links: [
      { label: 'awesome-nan', href: 'https://github.com/nanlabs/awesome-nan' },
      { label: 'terraform-aws-modules', href: 'https://github.com/nanlabs/terraform-aws-modules' },
      { label: 'NaNLABS org', href: 'https://github.com/nanlabs' },
    ],
    note: '20+ public repos — not vanity stars, but reusable starting points',
  },
  {
    title: 'AUR & community tooling',
    description: 'Packaging and maintenance where it counts — reproducible installs for the tools people actually run.',
    links: [
      { label: 'AUR packages', href: 'https://aur.archlinux.org/account/ulises-jeremias' },
      { label: 'Create Node App', href: 'https://github.com/Create-Node-App' },
      { label: 'agent-toolkit', href: 'https://github.com/ulises-jeremias/agent-toolkit' },
    ],
    note: 'Evidence links instead of download counts',
  },
];

export const contactLinks: ContactLink[] = [
  {
    label: 'GitHub',
    href: 'https://github.com/ulises-jeremias',
    hint: 'github.com/ulises-jeremias',
    icon: '🐙',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/ulisesjcf/',
    hint: 'linkedin.com/in/ulisesjcf',
    icon: '💼',
  },
  {
    label: 'Email',
    href: 'mailto:ulisescf.24@gmail.com',
    hint: 'ulisescf.24@gmail.com',
    icon: '✉️',
  },
  {
    label: 'Discord',
    href: 'https://discord.gg/bR5VyATgka',
    hint: 'discord.gg/bR5VyATgka',
    icon: '💬',
  },
];
