import type { DotfilesLayer, LicenseEntry, NarrativeSection, ScreenshotItem, SmartColorStep } from '../types/index.js';

export const dotfilesLayers: DotfilesLayer[] = [
  {
    id: 'chezmoi',
    label: 'chezmoi',
    shortLabel: 'chezmoi',
    description: 'Fundacion declarativa e idempotente',
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
    description: 'Orquestacion 100+ utilidades',
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
    description: 'Interaccion diaria fluida',
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
    title: 'El nido del hornero',
    paragraphs: [
      'HorneroConfig toma su nombre del hornero, el ave que construye nidos robustos, funcionales y adaptados al entorno. Cada capa — desde chezmoi hasta el shell — cumple un rol estructural, como barro y paja entrelazados: aislada en desarrollo, integrada en uso.',
      'La filosofia es modular y resiliente: degradacion elegante sin dependencias opcionales, single source of truth en ~/.cache/dots/ y ~/.config/, y automatizacion que convierte un sistema vacio en un escritorio productivo en minutos (dots, install.sh, AUR dots-stable).',
    ],
  },
  {
    id: 'stack',
    title: 'Stack vivo, no coleccion de configs',
    paragraphs: [
      'El stack une Hyprland/Wayland con Quickshell (QML + plugin C++ Hornero), Kitty acelerada por GPU, Zsh/Powerlevel10k y 100+ scripts dots-*. Cada rice — 13 temas en Cyberpunk, Cozy, Vaporwave, Nature y Cosmic — es un directorio autocontenido con config.sh, apply.sh, backgrounds/ y preview.png.',
      'Chezmoi orquesta todo: plantillas, scripts run_onchange_before/after idempotentes y external.toml para binarios. El resultado es cero mantenimiento: chezmoi init --apply ulises-jeremias y el nido queda listo, actualizable via dots-update y dots-eject para exportar a uso manual.',
    ],
  },
  {
    id: 'smart-colors',
    title: 'Color con intencionalidad',
    paragraphs: [
      'Smart Colors es el sistema nervioso. Analiza el wallpaper con ciencia de color, detecta luminancia para modo claro/oscuro, mapea semanticamente (rojo→error, verde→success) y optimiza contraste WCAG. Genera una unica vez y cachea en scheme.json (Material Design 3) y variantes para Hyprland, shell y GTK.',
      'Al cambiar wallpaper con dots-wallpaper-set, el servicio Colours de Quickshell regenera la paleta y la aplica de forma atomica a bar, borders, kitty y lock — sin valores hardcodeados, con fallbacks por distancia cuando la paleta es limitada.',
    ],
  },
];

export const smartColorSteps: SmartColorStep[] = [
  {
    id: 'wallpaper',
    title: 'Wallpaper',
    description: 'Imagen curada por rice en backgrounds/',
    icon: '🖼️',
    detail: 'Quickshell + wpgtk gestionan el fondo. dots-wallpaper-set registra el cambio y dispara el pipeline.',
  },
  {
    id: 'extraction',
    title: 'Extraccion',
    description: 'Cuantizacion y analisis de luminancia',
    icon: '🔬',
    detail: 'material-color-utilities extrae dominantes, calcula luminancia y decide light/dark con fallbacks.',
  },
  {
    id: 'palette',
    title: 'Palette',
    description: 'Material Design 3 scheme.json',
    icon: '🎨',
    detail: 'Genera primary/secondary/tertiary/error/neutral en ~/.cache/dots/smart-colors/ — cacheado y versionado.',
  },
  {
    id: 'apps',
    title: 'Apps',
    description: 'Aplicacion atomica a todo el escritorio',
    icon: '🚀',
    detail:
      'Quickshell Colours, Hyprland, Kitty, GTK y Hyprlock consumen la misma fuente. Live reload sin reiniciar sesion.',
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
    'Framework de dotfiles por Ulises Jeremias: Hyprland + Quickshell + Kitty + Zsh + chezmoi + 100+ dots-*. Smart Colors, 13 rices, instalacion en un comando.',
  quote: 'Como el hornero, construye tu nido digital: robusto, bello y adaptado a ti.',
};
