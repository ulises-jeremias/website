import type { DotfilesLayer, LicenseEntry, NarrativeSection, ScreenshotItem, SmartColorStep } from '../types/index.js';

export const dotfilesLayers: DotfilesLayer[] = [
  {
    id: 'chezmoi',
    label: 'chezmoi',
    shortLabel: 'chezmoi',
    description: 'Declarative and idempotent foundation',
    details: [
      '.chezmoiroot → home/',
      '.chezmoi.toml.tmpl + run_onchange_*',
      'Estado en ~/.config/.current_rice y ~/.cache/dots/',
    ],
    color: '#3a232e',
  },
  {
    id: 'scripts',
    label: 'scripts',
    shortLabel: 'dots',
    description: 'Orchestration of 100+ utilities',
    details: [
      'dots-* con EasyOptions y set -euo pipefail',
      'dots-appearance, dots-wallpaper-set, dots-rice',
      'dots-smart-colors, dots-sysupdate, dots-security-audit',
    ],
    color: '#4a2d3a',
  },
  {
    id: 'terminal',
    label: 'terminal',
    shortLabel: 'kitty',
    description: 'Render GPU y observabilidad',
    details: [
      'Kitty + fontconfig + ligaduras',
      'btop, cava, fastfetch, yazi, tmux',
      'M3 palette via ~/.cache/dots/smart-colors/',
    ],
    color: '#5e384a',
  },
  {
    id: 'compositor',
    label: 'compositor',
    shortLabel: 'hyprland',
    description: 'Wayland moderno y animado',
    details: [
      'Hyprland + animaciones por rice',
      'Quickshell: bar, launcher, dashboard, notifs, OSD',
      'Hyprlock + wpgtk wallpaper flow',
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
      'handlr, git, ssh, dot_zshrc modular',
    ],
    color: '#8f5a72',
  },
];

export const narrativeSections: NarrativeSection[] = [
  {
    id: 'origen',
    title: 'The hornero nest',
    paragraphs: [
      'HorneroConfig is named after the hornero, the bird that builds robust, functional nests adapted to its environment. Each layer — from chezmoi to shell — plays a structural role, like interwoven mud and straw: isolated in development, integrated in use.',
      'The philosophy is modular and resilient: graceful degradation without optional dependencies, single source of truth in ~/.cache/dots/ and ~/.config/, and automation that turns an empty system into a productive desktop in minutes (dots, install.sh, AUR dots-stable).',
    ],
  },
  {
    id: 'stack',
    title: 'Live stack, not a config collection',
    paragraphs: [
      'The stack unites Hyprland/Wayland with Quickshell (QML + Hornero C++ plugin), GPU-accelerated Kitty, Zsh/Powerlevel10k and 100+ dots-* scripts. Each rice — 13 themes across Cyberpunk, Cozy, Vaporwave, Nature and Cosmic — is a self-contained directory with config.sh, apply.sh, backgrounds/ and preview.png.',
      'Chezmoi orchestrates everything: templates, idempotent run_onchange_before/after scripts and external.toml for binaries. The result is zero maintenance: chezmoi init --apply ulises-jeremias and the nest is ready, updatable via dots-update and dots-eject to export to manual use.',
    ],
  },
  {
    id: 'smart-colors',
    title: 'Color with purpose',
    paragraphs: [
      'Smart Colors is the nervous system. It analyzes the wallpaper with color science, detects luminance for light/dark mode, maps semantically (red→error, green→success) and optimizes WCAG contrast. It generates once and caches in scheme.json (Material Design 3) and variants for Hyprland, shell and GTK.',
      'When you change wallpaper with dots-wallpaper-set, the Quickshell Colours service regenerates the palette and applies it atomically to bar, borders, kitty and lock — no hardcoded values, with distance-based fallbacks when the palette is limited.',
    ],
  },
];

export const smartColorSteps: SmartColorStep[] = [
  {
    id: 'wallpaper',
    title: 'Wallpaper',
    description: 'Image curated per rice in backgrounds/',
    icon: '🖼️',
    detail:
      'Quickshell + wpgtk manage the background. dots-wallpaper-set records the change and triggers the pipeline.',
  },
  {
    id: 'extraction',
    title: 'Extraction',
    description: 'Quantization and luminance analysis',
    icon: '🔬',
    detail: 'material-color-utilities extracts dominants, computes luminance and decides light/dark with fallbacks.',
  },
  {
    id: 'palette',
    title: 'Palette',
    description: 'Material Design 3 scheme.json',
    icon: '🎨',
    detail: 'Generates primary/secondary/tertiary/error/neutral in ~/.cache/dots/smart-colors/ — cached and versioned.',
  },
  {
    id: 'apps',
    title: 'Apps',
    description: 'Atomic application to the whole desktop',
    icon: '🚀',
    detail:
      'Quickshell Colours, Hyprland, Kitty, GTK and Hyprlock consume the same source. Live reload without restarting session.',
  },
];

export const screenshotItems: ScreenshotItem[] = [
  {
    id: 'collage',
    alt: 'Collage promocional de HorneroConfig mostrando bar lateral, dashboard y wallpapers artisticos',
    caption: 'Collage — vista integral del escritorio Quickshell + Hyprland',
    credit: 'static/collage.png — MIT (dotfiles)',
    width: 1914,
    height: 1075,
    placeholder: 'collage',
  },
  {
    id: 'dark',
    alt: 'Tema oscuro con bar rail a la izquierda, wallpaper anime y terminal kitty con neofetch',
    caption: 'Tema oscuro — arroz por defecto con animaciones suaves',
    credit: 'static/screen.png — MIT (dotfiles)',
    width: 1914,
    height: 1075,
    placeholder: 'dark',
  },
  {
    id: 'light',
    alt: 'Tema claro con palette pastel, barra superior minimal y ventana de yazi file manager',
    caption: 'Tema claro — adaptacion automatica light/dark de Smart Colors',
    credit: 'static/screen-2.jpg — MIT (dotfiles)',
    width: 1914,
    height: 1075,
    placeholder: 'light',
  },
  {
    id: 'launchpad',
    alt: 'Launchpad de aplicaciones con busqueda difusa, iconos y preview de wallpapers',
    caption: 'Launchpad — launcher QML con busqueda, calculadora y selector de rices',
    credit: 'static/screenshot-launchpad.png — MIT (dotfiles)',
    width: 800,
    height: 600,
    placeholder: 'launchpad',
  },
  {
    id: 'spotlight',
    alt: 'Spotlight oscuro con lista de apps filtrada y atajos de teclado visibles',
    caption: 'Spotlight — paleta de comandos y docs al alcance',
    credit: 'static/screenshot-spotlight-dark.png — MIT (dotfiles)',
    width: 800,
    height: 600,
    placeholder: 'spotlight',
  },
  {
    id: 'dashboard',
    alt: 'Dashboard con tabs de media (MPRIS), performance (SystemUsage) y clima (Open-Meteo)',
    caption: 'Dashboard — media, sistema y clima en un drawer unificado',
    credit: 'Quickshell modules — GPL-3.0 (caelestia-dots/shell adaptado)',
    width: 800,
    height: 600,
    placeholder: 'dashboard',
  },
];

export const licenseEntries: LicenseEntry[] = [
  {
    component: 'website (este sitio)',
    license: 'MIT',
    source: 'LICENSE — Copyright (c) 2025-2026 Ulises Jeremias Cornejo Fandos',
    notes: 'Contenido del feature dotfiles y pagina /dotfiles bajo MIT del sitio.',
  },
  {
    component: 'HorneroConfig dotfiles',
    license: 'MIT',
    source: 'github.com/ulises-jeremias/dotfiles/LICENSE (2019-2025)',
    notes:
      'Scripts dots-*, configs hypr/kitty/zsh/tmux, rices y docs. Uso y adaptacion MIT compatibles con este sitio.',
  },
  {
    component: 'Quickshell shell (adaptado)',
    license: 'GPL-3.0',
    source: 'caelestia-dots/shell por soramanew — GPL-3.0',
    notes:
      'Implementacion Quickshell de HorneroConfig inspirada/adaptada de caelestia-dots/shell (UI/UX, arquitectura, plugin C++). Si redistribuyes binario/plugin derivado, respeta GPL-3.0 y provee fuente.',
  },
  {
    component: 'Screenshots y assets',
    license: 'MIT (dotfiles) — wallpapers variables',
    source: 'static/*.png/jpg en dotfiles repo',
    notes:
      'Capturas MIT. Wallpapers individuales pueden tener licencias propias; verifica rice background especifico antes de redistribuir.',
  },
];

export const dotfilesMeta = {
  plum: '#191114',
  pink: '#FFB0CA',
  pinkSoft: '#e2bdc7',
  pinkMuted: '#d5c2c6',
  title: 'HorneroConfig — dotfiles framework',
  description:
    'Dotfiles framework by Ulises Jeremias: Hyprland + Quickshell + Kitty + Zsh + chezmoi + 100+ dots-*. Smart Colors, 13 rices, one-command install.',
  quote: 'Like the hornero, build your digital nest: robust, beautiful and tailored to you.',
};
