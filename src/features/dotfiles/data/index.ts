import type { AttributionEntry, DotfilesLayer, NarrativeSection, ScreenshotItem } from '../types/index.js';

/**
 * Verified against github.com/ulises-jeremias/dotfiles main @bf4b235 on 2026-10-04.
 * This is a personal chezmoi source; product defaults, themes, shell surfaces,
 * and system operations belong to HorneroOS repositories.
 */
export const verifiedFacts = {
  verifiedAt: '2026-10-04',
  sourceRevision: 'bf4b235',
  /** Hornero OS system CLI that replaced the dots-* wrappers. */
  systemCli: 'horneroctl',
  systemCliUrl: 'https://github.com/HorneroOS/hornero/tree/main/cli',
  shellRepoUrl: 'https://github.com/HorneroOS/shell',
  horneroctlDocUrl: 'https://github.com/ulises-jeremias/dotfiles/blob/main/docs/Horneroctl.md',
  repoUrl: 'https://github.com/ulises-jeremias/dotfiles',
  readmeUrl: 'https://github.com/ulises-jeremias/dotfiles/blob/main/README.md',
  contributingUrl: 'https://github.com/ulises-jeremias/dotfiles/blob/main/CONTRIBUTING.md',
  securityGuidelinesUrl: 'https://github.com/ulises-jeremias/dotfiles/blob/main/docs/Security-Guidelines.md',
  securityPolicyUrl: 'https://github.com/ulises-jeremias/dotfiles/blob/main/SECURITY.md',
  testingStrategyUrl: 'https://github.com/ulises-jeremias/dotfiles/blob/main/docs/Testing-Strategy.md',
  productAcceptanceUrl: 'https://github.com/HorneroOS/qa',
  reviewCommand: 'chezmoi diff --source=/path/to/dotfiles --config ~/.config/chezmoi/dotfiles.toml',
  applyCommand: 'chezmoi apply --source=/path/to/dotfiles --config ~/.config/chezmoi/dotfiles.toml',
  wikiUrl: 'https://github.com/ulises-jeremias/dotfiles/wiki',
  smartColorsWikiUrl: 'https://github.com/ulises-jeremias/dotfiles/wiki/Smart-Colors-System',
} as const;

export const dotfilesLayers: DotfilesLayer[] = [
  {
    id: 'chezmoi',
    label: 'chezmoi',
    shortLabel: 'chezmoi',
    description: 'Personal configuration source',
    details: [
      'Review source diffs before apply',
      'Host choices use documented chezmoi data',
      'Managed files are user-level configuration',
    ],
    color: '#211218',
  },
  {
    id: 'scripts',
    label: 'Hornero OS CLI',
    shortLabel: 'horneroctl',
    description: 'System verbs from the Hornero OS CLI',
    details: [
      'Product operations live in HorneroOS/hornero',
      'Dotfiles calls the installed horneroctl interface',
      'No private command shim in this repository',
    ],
    color: '#2a1620',
  },
  {
    id: 'terminal',
    label: 'terminal',
    shortLabel: 'kitty',
    description: 'GPU rendering and observability',
    details: [
      'Personal app preferences and user configuration',
      'Application packages come from HorneroOS/AUR',
      'No duplicated product binaries or runtime files',
    ],
    color: '#341b27',
  },
  {
    id: 'compositor',
    label: 'compositor',
    shortLabel: 'hyprland',
    description: 'Modern animated Wayland desktop',
    details: [
      'Personal Hyprland configuration',
      'Quickshell UI lives in HorneroOS/shell',
      'System defaults and appearance packs live in HorneroOS/config',
    ],
    color: '#3f202d',
  },
  {
    id: 'shell',
    label: 'shell',
    shortLabel: 'zsh',
    description: 'Fluid daily interaction',
    details: [
      'Optional user applications and preferences',
      'Wallpaper media is optional user data',
      'Managed with declarative chezmoi source files',
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
      'The repository keeps account-level configuration and optional wallpaper media. HorneroOS owns the product defaults, shell, packages, and stable desktop operations, so each repository has one clear source of truth.',
    ],
  },
  {
    id: 'stack',
    title: 'A personal layer with clear boundaries',
    paragraphs: [
      'This is the personal chezmoi source for an Arch Linux workstation. It manages user-level applications, preferences, and optional wallpaper media; it is not the HorneroOS release repository or package catalogue.',
      'The HorneroOS organization owns system defaults, appearance packs, the Quickshell interface, and stable system operations. HorneroConfig consumes those product components without vendoring a second copy.',
    ],
  },
  {
    id: 'maintenance',
    title: 'Review before applying',
    paragraphs: [
      'You can inspect changes with chezmoi diff before chezmoi apply. Package installation does not apply this source automatically, and --force is only for a deliberate replacement after reviewing the diff.',
      'Contributions use temporary HOME and isolated XDG directories. Shared source avoids secrets, personal credentials, generated caches, and host-specific values; tests must not apply to a live account.',
      'Templates do not run remote scripts. Prefer signed package sources and avoid privileged login hooks; document system-service changes for independent review. Installed behavior is accepted in HorneroOS/qa; local source checks do not validate a full desktop.',
    ],
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

export const attributionEntries: AttributionEntry[] = [
  {
    component: 'HorneroConfig',
    license: 'MIT',
    source: 'ulises-jeremias/dotfiles',
    notes: 'Personal chezmoi source, user configuration, optional media, and first-party historical static captures.',
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
  description:
    'HorneroConfig: a personal Arch Linux chezmoi source for user-level configuration and optional wallpaper media, integrated with HorneroOS components.',
  quote: 'Like the hornero, build your digital nest: robust, beautiful, and tailored to you.',
};
