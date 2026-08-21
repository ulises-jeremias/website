export interface DotfilesLayer {
  id: 'chezmoi' | 'shell' | 'compositor' | 'terminal' | 'scripts';
  label: string;
  shortLabel: string;
  description: string;
  details: string[];
  color: string;
}

export interface NarrativeSection {
  id: string;
  title: string;
  paragraphs: string[];
}

export interface SmartColorStep {
  id: 'wallpaper' | 'extraction' | 'palette' | 'apps';
  title: string;
  description: string;
  icon: string;
  detail: string;
}

export interface ScreenshotItem {
  id: string;
  alt: string;
  caption: string;
  credit: string;
  src: string;
  srcSet: string;
  width: number;
  height: number;
}

export interface AttributionEntry {
  component: string;
  license: string;
  source: string;
  notes: string;
}

/** @deprecated Prefer AttributionEntry */
export type LicenseEntry = AttributionEntry;
