import { horneroRepositoryUrls } from '@/data/hornero-transition.js';

/**
 * Hornero OS — verified facts for /hornero-os (ADR-004).
 *
 * Source of truth: github.com/HorneroOS (8 public repositories), read
 * 2026-09-30. Composition facts come from HorneroOS/hornero
 * manifests/v0.2.0-preview12.yaml (@36c2c4b). Maturity rule: while the
 * installer and iso slots are `future`, nothing here may say Hornero OS is
 * installable, downloadable, or a finished distribution.
 */

export const horneroFacts = {
  verifiedAt: '2026-09-30',
  orgUrl: 'https://github.com/HorneroOS',
  compositionRepoUrl: horneroRepositoryUrls.composition,
  releasesUrl: 'https://github.com/HorneroOS/hornero/releases',
  discussionsUrl: 'https://github.com/HorneroOS/hornero/discussions',
  contributingUrl: 'https://github.com/HorneroOS/.github/blob/main/CONTRIBUTING.md',
  docsUrl: 'https://github.com/HorneroOS/docs',
  websiteUrl: 'https://website-zcra.vercel.app',
  latestPreview: 'v0.2.0-preview12',
  latestPreviewDate: '2026-09-30',
  repositoryCount: 8,
} as const;

export type ManifestSlotStatus = 'pinned' | 'local' | 'future';

export interface ManifestSlot {
  id: string;
  status: ManifestSlotStatus;
  /** Short pin or reason exactly as the manifest records it. */
  value: string;
  note: string;
  href: string;
}

/** Components of manifests/v0.2.0-preview12.yaml, in manifest order. */
export const manifestSlots: ManifestSlot[] = [
  {
    id: 'shell',
    status: 'pinned',
    value: '07a3397',
    note: 'desktop shell · Quickshell, QML, Qt 6',
    href: horneroRepositoryUrls.shell,
  },
  {
    id: 'config',
    status: 'pinned',
    value: 'c4a25f0',
    note: 'desktop defaults · 15 theme packs',
    href: horneroRepositoryUrls.desktopDefaults,
  },
  {
    id: 'horneroctl',
    status: 'local',
    value: 'cli/',
    note: 'system CLI · built from the composition repo',
    href: horneroRepositoryUrls.systemCli,
  },
  {
    id: 'installer',
    status: 'future',
    value: 'reserved',
    note: 'approach not decided yet',
    href: 'https://github.com/HorneroOS/installer',
  },
  {
    id: 'iso',
    status: 'future',
    value: 'reserved',
    note: 'no image exists yet',
    href: 'https://github.com/HorneroOS/hornero/tree/main/releases',
  },
];

export type ComponentState = 'try-today' | 'not-yet' | 'direction';

export interface HorneroComponent {
  id: string;
  name: string;
  state: ComponentState;
  summary: string;
  /** Exact command or path from the component README, when one exists. */
  tryIt?: string;
  href: string;
}

export const horneroComponents: HorneroComponent[] = [
  {
    id: 'horneroctl',
    name: 'horneroctl',
    state: 'try-today',
    summary:
      'System CLI written in V: appearance, wallpaper, colors, capture, hardware, and package verbs. Non-interactive by default, with --json, --dry-run, and --yes.',
    tryIt: 'yay -S horneroctl-bin',
    href: horneroRepositoryUrls.systemCli,
  },
  {
    id: 'shell',
    name: 'Shell',
    state: 'try-today',
    summary:
      'Bar, launcher, dashboard, control center, notifications, and lock screen, built with Quickshell, QML, and Qt 6 plus a native C++ plugin. Hyprland first.',
    tryIt: 'cmake -S . -B build && cmake --build build',
    href: horneroRepositoryUrls.shell,
  },
  {
    id: 'config',
    name: 'Desktop defaults',
    state: 'try-today',
    summary:
      'Hyprland, kitty, GTK, Qt, and font defaults with 15 theme packs, including the flagship hornero-dark, hornero-light, and pampa themes.',
    tryIt: 'scripts/materialize.sh --dry-run',
    href: horneroRepositoryUrls.desktopDefaults,
  },
  {
    id: 'greeter',
    name: 'Greeter',
    state: 'try-today',
    summary:
      'SDDM login screen that plays offline footage of Argentine landscapes. A Qt 6 port of aerial-sddm-theme; footage is CC BY / CC BY-SA.',
    tryIt: 'sddm-greeter --test-mode --theme <path>',
    href: horneroRepositoryUrls.greeter,
  },
  {
    id: 'installer',
    name: 'Installer and ISO',
    state: 'not-yet',
    summary:
      'Reserved slots in the manifest. The installer approach (archinstall, Calamares, or custom) is still undecided, and no image has been built.',
    href: 'https://github.com/HorneroOS/installer',
  },
  {
    id: 'assistant',
    name: 'AI-native integration',
    state: 'direction',
    summary:
      'The long-term direction: an assistant integrated with the desktop, as a separate daemon. The shell has a companion bird today, but no assistant exists behind it.',
    href: 'https://github.com/HorneroOS/shell/blob/main/docs/COMPANION_ASSISTANT.md',
  },
];

export const componentStateLabels: Record<ComponentState, string> = {
  'try-today': 'Try on Arch today',
  'not-yet': 'Not built yet',
  direction: 'Direction only',
};

/** HorneroConfig vs Hornero OS — the boundary the page must make obvious. */
export const familyComparison = [
  {
    aspect: 'What it is',
    config: 'My personal desktop configuration, managed with chezmoi',
    os: 'A generic desktop OS composed from separate repositories',
  },
  {
    aspect: 'Status',
    config: 'Established — in daily use for years, reworked for Hyprland in 2026',
    os: 'Development preview — not installable yet',
  },
  {
    aspect: 'Who it is for',
    config: 'Me first; anyone who wants to adopt or fork the setup',
    os: 'Arch users who want a finished Hyprland desktop, once it ships',
  },
  {
    aspect: 'Relationship',
    config: 'Consumes the Hornero shell and horneroctl, keeps personal overrides',
    os: 'Its shell and defaults were extracted from HorneroConfig',
  },
] as const;

export const horneroAssets = {
  logo: '/media/hornero-os/hornero-logo.svg',
  wallpaper: {
    src: '/media/hornero-os/hornero-dark-960.webp',
    srcSet:
      '/media/hornero-os/hornero-dark-480.webp 480w, /media/hornero-os/hornero-dark-960.webp 960w, /media/hornero-os/hornero-dark-1586.webp 1586w',
    width: 1586,
    height: 992,
    alt: 'The hornero-dark wallpaper: a rufous hornero perched on its mud nest above a Patagonian lake at dusk, with the Hornero OS wordmark.',
    credit: 'HorneroOS/config · assets/brand/wallpaper/hornero-dark.png · MIT',
  },
} as const;
