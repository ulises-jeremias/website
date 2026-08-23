export type LayerId = 'hornero' | 'workstation' | 'toolkit' | 'harness';

export interface LayerMeta {
  id: LayerId;
  index: number;
  label: string;
  title: string;
  subtitle: string;
  mapping: string;
  accent: string;
  description: string;
  responsibilities: string[];
  delivers: string[];
  repo?: string;
}

export interface ProvisioningStep {
  step: string;
  command: string;
  description: string;
  note?: string;
}

export interface DoctorCheck {
  name: string;
  command: string;
  description: string;
  when: string;
}

export interface WorkstationIdentity {
  midnight: string;
  cyan: string;
  violet: string;
  lime: string;
}

/** Canonical profile id from agentic-workstation chezmoi profiles.yaml */
export type WorkstationProfileId =
  'technical' | 'non-technical' | 'ai' | 'node' | 'python' | 'data' | 'infra' | 'minimal' | 'custom';

export interface WorkstationProfile {
  id: WorkstationProfileId;
  description: string;
  groups: string[];
}
