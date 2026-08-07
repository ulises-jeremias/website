import type { DotfilesLayer, LicenseEntry, NarrativeSection, ScreenshotItem, SmartColorStep } from '../types/index.js';

export const dotfilesLayers: DotfilesLayer[] = [
  {
    id: 'chezmoi',
    label: 'chezmoi',
    shortLabel: 'chezmoi',
    description: 'Declarative, idempotent foundation',
    details: [
      '.chezmoiroot → home/',
      '.chezmoi.toml.tmpl + run_onchange_* hooks',
      'State in ~/.config/.current_rice and ~/.cache/dots/',
    ],
    color: '#3a232e',
  },
  {
    id: 'scripts',
    label: 'scripts',
    shortLabel: 'dots',
    description: 'Orchestration of ~46 dots-* utilities',
    details: [
      'dots-* with EasyOptions and set -euo pipefail',
      'dots appearance, dots-wallpaper-set, dots-rice',
      'dots-smart-colors, config.json, python-materialyoucolor',
    ],
    color: '#4a2d3a',
  },
  {
    id: 'terminal',
    label: 'terminal',
    shortLabel: 'kitty',
    description: 'GPU rendering and observability',
    details: [
      'Kitty + fontconfig + ligatures',
      'btop, cava, fastfetch, yazi, tmux',
      'M3 palette via ~/.cache/dots/smart-colors/',
    ],
    color: '#5e384a',
  },
  {
    id: 'compositor',
    label: 'compositor',
    shortLabel: 'hyprland',
    description: 'Modern animated Wayland desktop',
    details: [
      'Hyprland + per-rice animation profiles',
      'Quickshell: bar, launcher, dashboard, notifications, OSD',
      'Hyprlock + wallpaper flow',
    ],
    color: '#7a4a5f',
  },
  {
    id: 'shell',
    label: 'shell',
    shortLabel: 'zsh',
    description: 'Fluid daily interaction',
    details: [
      'Zsh + Powerlevel10k instant prompt',
      'config.d/plugins, keybindings, paths',
      'handlr, git, ssh, modular .zshrc',
    ],
    color: '#8f5a72',
  },
];

export const narrativeSections: NarrativeSection[] = [
  {
    id: 'origin',
    title: 'The hornero nest',
    paragraphs: [
      'HorneroConfig is named after the hornero, the bird that builds robust nests adapted to its environment. Each layer — from chezmoi to shell — plays a structural role: isolated in development, integrated in use.',
      'The philosophy is modular and resilient: graceful degradation without optional dependencies, a single source of truth in ~/.cache/dots/ and ~/.config/, and automation that turns an empty system into a productive desktop.',
    ],
  },
  {
    id: 'stack',
    title: 'Live stack, not a config collection',
    paragraphs: [
      'The stack unites Hyprland/Wayland with Quickshell (QML + Hornero C++ plugin), GPU-accelerated Kitty, Zsh/Powerlevel10k, and ~46 dots-* scripts. Each of the 22 rices is a self-contained directory with config.json, backgrounds/, and preview.png — no apply.sh.',
      'Chezmoi orchestrates templates and idempotent hooks. Install with chezmoi init --apply ulises-jeremias, then manage appearance with dots appearance and Smart Colors.',
    ],
  },
  {
    id: 'smart-colors',
    title: 'Color with purpose',
    paragraphs: [
      'Smart Colors analyzes the wallpaper with python-materialyoucolor, detects luminance for light/dark mode, maps semantics (red→error, green→success), and optimizes WCAG contrast. It generates once and caches scheme.json (Material Design 3) plus variants for Hyprland, shell, and GTK.',
      'When you change wallpaper, the Quickshell Colours service regenerates the palette and applies it atomically to bar, borders, kitty, and lock — no hardcoded theme values.',
    ],
  },
];

export const smartColorSteps: SmartColorStep[] = [
  {
    id: 'wallpaper',
    title: 'Wallpaper',
    description: 'Image curated per rice in backgrounds/',
    icon: 'wp',
    detail: 'dots appearance / dots-wallpaper-set records the change and triggers the pipeline.',
  },
  {
    id: 'extraction',
    title: 'Extraction',
    description: 'Quantization and luminance analysis',
    icon: 'ex',
    detail: 'python-materialyoucolor extracts dominants, computes luminance, and decides light/dark.',
  },
  {
    id: 'palette',
    title: 'Palette',
    description: 'Material Design 3 scheme.json',
    icon: 'pl',
    detail: 'Generates primary/secondary/tertiary/error/neutral in ~/.cache/dots/smart-colors/.',
  },
  {
    id: 'apps',
    title: 'Apps',
    description: 'Atomic application across the desktop',
    icon: 'ap',
    detail: 'Quickshell Colours, Hyprland, Kitty, GTK, and Hyprlock consume the same source.',
  },
];

export const screenshotItems: ScreenshotItem[] = [
  {
    id: 'collage',
    alt: 'HorneroConfig collage showing sidebar bar, dashboard, and desktop wallpapers',
    caption: 'Collage — Quickshell + Hyprland desktop overview',
    credit: 'public/media/dotfiles/collage.png — MIT (dotfiles)',
    width: 1914,
    height: 1075,
    placeholder: 'collage',
  },
  {
    id: 'dark',
    alt: 'Dark theme with left bar rail, artistic wallpaper, and Kitty terminal',
    caption: 'Dark theme — default rice with soft motion',
    credit: 'public/media/dotfiles/screen.png — MIT (dotfiles)',
    width: 1914,
    height: 1075,
    placeholder: 'dark',
  },
  {
    id: 'light',
    alt: 'Light theme with pastel palette, minimal top bar, and yazi file manager',
    caption: 'Light theme — Smart Colors light/dark adaptation',
    credit: 'public/media/dotfiles/screen-2.jpg — MIT (dotfiles)',
    width: 1914,
    height: 1075,
    placeholder: 'light',
  },
  {
    id: 'launchpad',
    alt: 'Application launchpad with fuzzy search and wallpaper previews',
    caption: 'Launchpad — QML launcher with search and rice selector',
    credit: 'public/media/dotfiles/screenshot-launchpad.png — MIT (dotfiles)',
    width: 800,
    height: 600,
    placeholder: 'launchpad',
  },
  {
    id: 'spotlight',
    alt: 'Dark spotlight palette with filtered apps and keyboard shortcuts',
    caption: 'Spotlight — command palette within reach',
    credit: 'public/media/dotfiles/screenshot-spotlight-dark.png — MIT (dotfiles)',
    width: 800,
    height: 600,
    placeholder: 'spotlight',
  },
];

export const licenseEntries: LicenseEntry[] = [
  {
    component: 'website (this site)',
    license: 'MIT',
    source: 'LICENSE — Copyright (c) 2025-2026 Ulises Jeremias Cornejo Fandos',
    notes: 'Dotfiles feature content and /dotfiles page under the site MIT license.',
  },
  {
    component: 'HorneroConfig dotfiles',
    license: 'MIT',
    source: 'github.com/ulises-jeremias/dotfiles/LICENSE (2019-2025)',
    notes: 'dots-* scripts, hypr/kitty/zsh/tmux configs, rices, and docs. MIT-compatible reuse.',
  },
  {
    component: 'Quickshell shell (adapted)',
    license: 'GPL-3.0',
    source: 'caelestia-dots/shell by soramanew — GPL-3.0',
    notes:
      'Quickshell implementation adapted from caelestia-dots/shell. Redistributing derived binaries requires GPL-3.0 compliance and source.',
  },
  {
    component: 'Screenshots and assets',
    license: 'MIT (dotfiles) — wallpapers vary',
    source: 'public/media/dotfiles/* from dotfiles/static',
    notes:
      'First-party captures are MIT. Individual rice wallpapers may carry their own licenses — verify before redistribution.',
  },
];

export const dotfilesMeta = {
  plum: '#191114',
  pink: '#FFB0CA',
  pinkSoft: '#e2bdc7',
  pinkMuted: '#d5c2c6',
  title: 'HorneroConfig — dotfiles framework',
  description:
    'Dotfiles framework by Ulises Jeremias: Hyprland + Quickshell + Kitty + Zsh + chezmoi + ~46 dots-*. Smart Colors (python-materialyoucolor), 22 rices, one-command install.',
  quote: 'Like the hornero, build your digital nest: robust, beautiful, and tailored to you.',
};
