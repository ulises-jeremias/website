import type {
  AttributionEntry,
  DotfilesLayer,
  NarrativeSection,
  ScreenshotItem,
  SmartColorStep,
} from '../types/index.js';

/**
 * Verified against github.com/ulises-jeremias/dotfiles main @8aae4f7 on 2026-09-30.
 * Since #294–#305 and #317 the `dots-*` wrappers are deleted: system commands
 * resolve to `horneroctl` (HorneroOS/hornero) and the Quickshell shell is
 * consumed from HorneroOS/shell. Theme packs: home/dot_local/share/dots/themes/*.
 */
const themes = [
  'catppuccin-latte',
  'catppuccin-mocha',
  'everforest',
  'gruvbox',
  'hornero-dark',
  'hornero-light',
  'landscape',
  'monochrome',
  'neon-city',
  'nord-dreams',
  'rose-pine',
  'soft-morning',
  'vapor-dreams',
  'warm-sunset',
] as const;

export const verifiedFacts = {
  verifiedAt: '2026-09-30',
  sourceRevision: '8aae4f7',
  themeCount: themes.length,
  themes,
  /** Hornero OS system CLI that replaced the dots-* wrappers. */
  systemCli: 'horneroctl',
  systemCliUrl: 'https://github.com/HorneroOS/hornero/tree/main/cli',
  shellRepoUrl: 'https://github.com/HorneroOS/shell',
  horneroctlDocUrl: 'https://github.com/ulises-jeremias/dotfiles/blob/main/docs/Horneroctl.md',
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
    color: '#211218',
  },
  {
    id: 'scripts',
    label: 'system CLI',
    shortLabel: 'horneroctl',
    description: 'System verbs from the Hornero OS CLI',
    details: [
      'horneroctl appearance, wallpaper, colors, capture, hardware verbs',
      'Non-interactive by default: --json, --dry-run, --yes for mutations',
      'theme.json appearances + python-materialyoucolor M3 path',
    ],
    color: '#2a1620',
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
    color: '#341b27',
  },
  {
    id: 'compositor',
    label: 'compositor',
    shortLabel: 'hyprland',
    description: 'Modern animated Wayland desktop',
    details: [
      'Hyprland + per-theme animation profiles',
      'Quickshell shell from HorneroOS/shell: bar, launcher, dashboard, notifications',
      'Hyprlock themed via horneroctl appearance hyprlock',
    ],
    color: '#3f202d',
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
    color: '#4a2534',
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
      `The stack unites Hyprland/Wayland with the Hornero Quickshell shell, GPU-accelerated Kitty, and Zsh/Powerlevel10k. Each of the ${verifiedFacts.themeCount} appearance themes ships as a self-contained directory with theme.json, preview, and wallpaper directory — no apply.sh.`,
      'Chezmoi orchestrates templates and idempotent hooks. Since 2026 the generic pieces live in Hornero OS: the shell comes from HorneroOS/shell and system commands from horneroctl, while this repository keeps the personal layer.',
    ],
  },
  {
    id: 'smart-colors',
    title: 'Color with purpose',
    paragraphs: [
      'Smart Colors follows the maintained Hyprland + Quickshell path: horneroctl wallpaper set (or the Control Center) triggers generate-m3-colors.py via horneroctl colors m3 (python-materialyoucolor), writing scheme.json plus Kitty/GTK/Hyprlock exports under ~/.cache/dots/smart-colors/.',
      'The shell’s Colours service reloads from scheme.json, and horneroctl appearance gtk keeps GTK/libadwaita in lockstep — one wallpaper change, one atomic palette.',
    ],
  },
];

export const smartColorSteps: SmartColorStep[] = [
  {
    id: 'wallpaper',
    title: 'Wallpaper',
    description: 'horneroctl wallpaper set or Control Center',
    icon: '01',
    detail:
      'Records the path under ~/.local/state/dots/wallpaper/ and starts the appearance pipeline (IPC when Quickshell is running).',
  },
  {
    id: 'extraction',
    title: 'Material extraction',
    description: 'generate-m3-colors.py',
    icon: '02',
    detail:
      'horneroctl colors m3 runs python-materialyoucolor; luminance decides light/dark; semantics map error/success/warning.',
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
 *
 * Honesty note (verified 2026-09-30): every capture here predates the 2026
 * Hyprland + Quickshell stack — they show the earlier X11 generation
 * (Xorg, picom, alacritty; committed 2020–2021). Captions say so. Replace
 * them only with real captures of the current stack.
 */
export const screenshotItems: ScreenshotItem[] = [
  {
    id: 'dark',
    alt: 'Earlier X11-generation HorneroConfig desktop with a top status bar, btop, and a cava visualizer over a bridge wallpaper',
    caption: 'Earlier X11 generation — status bar, btop, and cava',
    credit: 'dotfiles/static/screen.png · MIT',
    src: '/media/dotfiles/screen-1440.webp',
    srcSet:
      '/media/dotfiles/screen-320.webp 320w, /media/dotfiles/screen-768.webp 768w, /media/dotfiles/screen-1440.webp 1440w',
    width: 1440,
    height: 809,
  },
  {
    id: 'light',
    alt: 'Earlier X11-generation desktop with a landscape wallpaper and a telemetry-rich top bar',
    caption: 'Earlier X11 generation — landscape telemetry bar (2021)',
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
    caption: 'Earlier X11 generation — launchpad app grid (2021)',
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
    caption: 'Earlier X11 generation — dark spotlight launcher (2021)',
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
    caption: 'Earlier X11 generation — light spotlight launcher (2021)',
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
    caption: 'Earlier X11 generation — nord one-line bar (2021)',
    credit: 'dotfiles/static/screenshot-nord-oneline.png · MIT',
    src: '/media/dotfiles/screenshot-nord-oneline-1440.webp',
    srcSet:
      '/media/dotfiles/screenshot-nord-oneline-320.webp 320w, /media/dotfiles/screenshot-nord-oneline-720.webp 720w, /media/dotfiles/screenshot-nord-oneline-1440.webp 1440w',
    width: 1440,
    height: 900,
  },
];

/**
 * Hero art: the hornero-dark theme wallpaper that ships with HorneroConfig
 * (home/dot_local/share/dots/themes/hornero-dark) and HorneroOS/config
 * (assets/brand/wallpaper). A theme artifact, not a desktop screenshot — the
 * caption says so. Current desktop captures replace it once they exist.
 */
export const heroArt = {
  src: '/media/hornero-os/hornero-dark-960.webp',
  srcSet:
    '/media/hornero-os/hornero-dark-480.webp 480w, /media/hornero-os/hornero-dark-960.webp 960w, /media/hornero-os/hornero-dark-1586.webp 1586w',
  width: 1586,
  height: 992,
  alt: 'The hornero-dark theme wallpaper: a rufous hornero on its mud nest above a Patagonian lake at dusk.',
  caption: 'hornero-dark theme wallpaper — theme artwork, not a desktop screenshot · MIT',
} as const;

export const attributionEntries: AttributionEntry[] = [
  {
    component: 'HorneroConfig',
    license: 'MIT',
    source: 'ulises-jeremias/dotfiles',
    notes: 'Framework sources, chezmoi templates, themes, and first-party static captures.',
  },
  {
    component: 'Hornero shell (Quickshell)',
    license: 'GPL-3.0-only',
    source: 'HorneroOS/shell, adapted from caelestia-dots/shell by soramanew',
    notes: 'The adapted shell now lives in HorneroOS/shell with its NOTICE and GPL license; HorneroConfig consumes it.',
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
  description: `HorneroConfig: Hyprland + Quickshell + Kitty + Zsh, chezmoi, ${verifiedFacts.themeCount} appearance themes, and Smart Colors (python-materialyoucolor), with system commands from horneroctl.`,
  quote: 'Like the hornero, build your digital nest: robust, beautiful, and tailored to you.',
};
