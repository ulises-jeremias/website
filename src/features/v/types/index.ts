export interface VProject {
  id: 'v' | 'vsl' | 'vtl' | 'rxv' | 'setup-v' | 'awesome-v';
  title: string;
  shortLabel: string;
  description: string;
  href: string;
  repo: string;
  icon: string;
  role: string;
  highlights: string[];
  license: string;
}

export interface VSection {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  bullets: string[];
}

export interface VDiagramStep {
  id: string;
  label: string;
  description: string;
  detail: string;
}

export interface VLicenseEntry {
  component: string;
  license: string;
  source: string;
  notes: string;
}

export interface VBackend {
  id: 'pure-v' | 'cblas' | 'opencl' | 'cuda' | 'vulkan' | 'mpi';
  label: string;
  flag: string;
  maturity: 'default' | 'stable-opt-in' | 'experimental' | 'optional';
  bestFor: string;
}

export interface VtlMaturity {
  id: 'cpu' | 'cuda' | 'vulkan';
  label: string;
  maturity: 'default' | 'experimental';
  note: string;
}

export interface VOperatorGroup {
  category: string;
  operators: string[];
}
