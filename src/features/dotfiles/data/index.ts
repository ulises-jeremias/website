import type {
  AttributionEntry,
  DotfilesLayer,
  NarrativeSection,
  ScreenshotItem,
  SmartColorStep,
} from '../types/index.js';

/** Verified against github.com/ulises-jeremias/dotfiles HEAD (main) on 2026-08-07. */
export const verifiedFacts = {
  themeCount: 12,
  dotsScriptCount: 47,
  themes: [
    'catppuccin-latte',
    'catppuccin-mocha',
    'everforest',
    'gruvbox',
    'landscape',
    'monochrome',
    'neon-city',
    'nord-dreams',
    'rose-pine',
    'soft-morning',
    'vapor-dreams',
    'warm-sunset',
  ] as const,
  repoUrl: 'https://github.com/ulises-jeremias/dotfiles',
  wikiUrl: 'https://github.com/ulises-jeremias/dotfiles/wiki',
  smartColorsWikiUrl: 'https://github.com/ulises-jeremias/dotfiles/wiki/Smart-Colors-System',
  installCurl:
    'sh -c "$(curl -fsSL https://github.com/ulises-jeremias/dotfiles/blob/main/scripts/install_dotfiles.sh?raw=true)"',
} as const;

export const dotfilesLayers: DotfilesLayer[] = [
  {
    id: 'chezmoi',
    label: 'chezmoi',
    shortLabel: 'chezmoi',
    description: 'Declarative, idempotent foundation',
    details: [
      '.chezmoiroot → home/',
      '.chezmoi.toml.tmpl + run_onchange_* hooks',
      'State in ~/.local/state/dots/ and ~/.cache/dots/',
    ],
    color: '#3a232e',
  },
  {
    id: 'scripts',
    label: 'scripts',
    shortLabel: 'dots',
    description: `Orchestration of ${verifiedFacts.dotsScriptCount} dots-* utilities`,
    details: [
      'dots-* CLIs with EasyOptions and set -euo pipefail',
      'dots appearance, dots-wallpaper-set, dots-smart-colors',
      'theme.json appearances + python-materialyoucolor M3 path',
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
      'M3 palette via ~/.cache/dots/smart-colors/colors-kitty.conf',
    ],
    color: '#5e384a',
  },
  {
    id: 'compositor',
    label: 'compositor',
    shortLabel: 'hyprland',
    description: 'Modern animated Wayland desktop',
    details: [
      'Hyprland + per-theme animation profiles',
      'Quickshell: bar, launcher, dashboard, notifications, OSD',
      'Hyprlock + dots-wallpaper-set flow',
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
      'The philosophy is modular and resilient: graceful degradation without optional dependencies, a single source of truth in ~/.cache/dots/ and ~/.local/state/dots/, and automation that turns an empty system into a productive desktop.',
    ],
  },
  {
    id: 'stack',
    title: 'Live stack, not a config collection',
    paragraphs: [
      `The stack unites Hyprland/Wayland with Quickshell (QML + Hornero C++ plugin), GPU-accelerated Kitty, Zsh/Powerlevel10k, and ${verifiedFacts.dotsScriptCount} dots-* scripts. Each of the ${verifiedFacts.themeCount} appearance themes ships as a self-contained directory with theme.json, preview, and wallpaper directory — no apply.sh.`,
      'Chezmoi orchestrates templates and idempotent hooks. Install with chezmoi init --apply ulises-jeremias, then manage appearance with dots appearance and Smart Colors.',
    ],
  },
  {
    id: 'smart-colors',
    title: 'Color with purpose',
    paragraphs: [
      'Smart Colors follows the maintained Hyprland + Quickshell path: dots-wallpaper-set (or Control Center) triggers pywal and generate-m3-colors.py via dots-m3-colors (python-materialyoucolor), writing scheme.json plus Kitty/GTK/Hyprlock exports under ~/.cache/dots/smart-colors/.',
      'Quickshell’s Colours service reloads from scheme.json (file watch or dots-quickshell ipc colours reload). dots-gtk-theme keeps GTK/libadwaita in lockstep — one wallpaper change, one atomic palette.',
    ],
  },
];

export const smartColorSteps: SmartColorStep[] = [
  {
    id: 'wallpaper',
    title: 'Wallpaper',
    description: 'dots-wallpaper-set or Control Center Apply',
    icon: '01',
    detail:
      'Records the path under ~/.local/state/dots/wallpaper/ and starts the appearance pipeline (IPC when Quickshell is running).',
  },
  {
    id: 'extraction',
    title: 'Material extraction',
    description: 'pywal + generate-m3-colors.py',
    icon: '02',
    detail:
      'dots-m3-colors prefers system python3 with materialyoucolor; luminance decides light/dark; semantics map error/success/warning.',
  },
  {
    id: 'palette',
    title: 'Scheme cache',
    description: 'scheme.json + consumer exports',
    icon: '03',
    detail:
      'Writes ~/.cache/dots/smart-colors/scheme.json, colors-kitty.conf, colors-hyprlock.env, colors.css, and shell/env helpers.',
  },
  {
    id: 'apps',
    title: 'Desktop consumers',
    description: 'Quickshell · Hyprland · Kitty · GTK',
    icon: '04',
    detail:
      'Colours.qml reloads the M3 scheme; borders, terminal, lock, and GTK sync from the same cache — no hardcoded theme values.',
  },
];

/**
 * First-party captures from ulises-jeremias/dotfiles/static (MIT).
 * Excludes anime.jpeg / anime-girl-screen.png and collage.png (embeds anime wallpaper).
 */
export const screenshotItems: ScreenshotItem[] = [
  {
    id: 'dark',
    alt: 'HorneroConfig dark desktop with Quickshell bars, btop, and cava over a bridge wallpaper',
    caption: 'Dark desktop — Quickshell bars + observability',
    credit: 'dotfiles/static/screen.png · MIT',
    src: '/media/dotfiles/screen-1440.webp',
    srcSet:
      '/media/dotfiles/screen-320.webp 320w, /media/dotfiles/screen-768.webp 768w, /media/dotfiles/screen-1440.webp 1440w',
    width: 1440,
    height: 809,
  },
  {
    id: 'light',
    alt: 'HorneroConfig desktop with landscape wallpaper and telemetry-rich Quickshell top bar',
    caption: 'Appearance theme — landscape telemetry bar',
    credit: 'dotfiles/static/screen-2.jpg · MIT',
    src: '/media/dotfiles/screen-2-1440.webp',
    srcSet:
      '/media/dotfiles/screen-2-320.webp 320w, /media/dotfiles/screen-2-720.webp 720w, /media/dotfiles/screen-2-1440.webp 1440w',
    width: 1440,
    height: 812,
  },
  {
    id: 'launchpad',
    alt: 'Full-screen application launchpad with search and icon grid',
    caption: 'Launchpad — searchable app grid',
    credit: 'dotfiles/static/screenshot-launchpad.png · MIT',
    src: '/media/dotfiles/screenshot-launchpad-1440.webp',
    srcSet:
      '/media/dotfiles/screenshot-launchpad-320.webp 320w, /media/dotfiles/screenshot-launchpad-720.webp 720w, /media/dotfiles/screenshot-launchpad-1440.webp 1440w',
    width: 1440,
    height: 900,
  },
  {
    id: 'spotlight-dark',
    alt: 'Dark spotlight launcher with fuzzy app list over abstract wallpaper',
    caption: 'Spotlight — dark command palette',
    credit: 'dotfiles/static/screenshot-spotlight-dark.png · MIT',
    src: '/media/dotfiles/screenshot-spotlight-dark-1440.webp',
    srcSet:
      '/media/dotfiles/screenshot-spotlight-dark-320.webp 320w, /media/dotfiles/screenshot-spotlight-dark-720.webp 720w, /media/dotfiles/screenshot-spotlight-dark-1440.webp 1440w',
    width: 1440,
    height: 868,
  },
  {
    id: 'spotlight-light',
    alt: 'Light spotlight launcher with frosted glass panel over colorful abstract wallpaper',
    caption: 'Spotlight — light command palette',
    credit: 'dotfiles/static/screenshot-spotlight-light.png · MIT',
    src: '/media/dotfiles/screenshot-spotlight-light-1440.webp',
    srcSet:
      '/media/dotfiles/screenshot-spotlight-light-320.webp 320w, /media/dotfiles/screenshot-spotlight-light-720.webp 720w, /media/dotfiles/screenshot-spotlight-light-1440.webp 1440w',
    width: 1440,
    height: 872,
  },
  {
    id: 'nord-bar',
    alt: 'Nord-style top bar listing open apps over an urban dusk wallpaper',
    caption: 'Bar — nord one-line window list',
    credit: 'dotfiles/static/screenshot-nord-oneline.png · MIT',
    src: '/media/dotfiles/screenshot-nord-oneline-1440.webp',
    srcSet:
      '/media/dotfiles/screenshot-nord-oneline-320.webp 320w, /media/dotfiles/screenshot-nord-oneline-720.webp 720w, /media/dotfiles/screenshot-nord-oneline-1440.webp 1440w',
    width: 1440,
    height: 900,
  },
];

export const attributionEntries: AttributionEntry[] = [
  {
    component: 'HorneroConfig',
    license: 'MIT',
    source: 'ulises-jeremias/dotfiles',
    notes: 'Framework sources, dots-* scripts, themes, and first-party static captures.',
  },
  {
    component: 'Quickshell shell (adapted)',
    license: 'GPL-3.0',
    source: 'caelestia-dots/shell by soramanew',
    notes: 'Desktop shell adapted with attribution; original LICENSE kept in-tree.',
  },
];

/** @deprecated Use attributionEntries — kept for any residual imports during Wave 3. */
export const licenseEntries = attributionEntries;

export const dotfilesMeta = {
  plum: '#191114',
  pink: '#FFB0CA',
  pinkSoft: '#e2bdc7',
  pinkMuted: '#d5c2c6',
  title: 'HorneroConfig — personal DX desktop',
  description: `HorneroConfig: Hyprland + Quickshell + Kitty + Zsh, chezmoi, ${verifiedFacts.dotsScriptCount} dots-* scripts, ${verifiedFacts.themeCount} appearance themes, and Smart Colors (python-materialyoucolor).`,
  quote: 'Like the hornero, build your digital nest: robust, beautiful, and tailored to you.',
};
