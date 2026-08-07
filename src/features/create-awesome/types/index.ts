export type VariantId = 'node' | 'python' | 'v';

export interface TemplateSummary {
  id: string;
  name: string;
  description: string;
  stack: string[];
  featured?: boolean;
}

export interface AddonSummary {
  id: string;
  name: string;
  description: string;
  category: 'styling' | 'tooling' | 'data' | 'deploy';
}

export interface DistributionChannel {
  id: 'npm' | 'aur' | 'brew' | 'docker' | 'pipx' | 'uvx' | 'cva-release';
  label: string;
  command: string;
  note: string;
}

export interface CompositionExample {
  id: string;
  title: string;
  variant: VariantId;
  template: string;
  addons: string[];
  command: string;
}

export interface ContributionStep {
  step: number;
  title: string;
  description: string;
  href?: string;
}

export interface ComparisonRow {
  feature: string;
  node: string;
  python: string;
  v: string;
}

export interface FamilyIntro {
  title: string;
  lead: string;
  principle: string;
}

export interface CreateAwesomeVariant {
  id: VariantId;
  label: string;
  title: string;
  description: string;
  status: 'stable' | 'beta' | 'experimental';
  accent: string;
  accentLight: string;
  bg: string;
  templates: TemplateSummary[];
  addons: AddonSummary[];
  install: string;
  href: string;
  repo: string;
}
