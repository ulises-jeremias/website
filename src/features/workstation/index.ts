export { default as WorkstationSystemMap } from './components/WorkstationSystemMap.astro';

export {
  workstationLayers,
  workstationProfiles,
  provisioningSteps,
  doctorChecks,
  workstationIdentity,
  thinWorkstationVerification,
} from './data/index.js';

export { getLayers, getLayerById, getEcosystemFlow } from './services/workstation.js';

export type {
  LayerMeta,
  LayerId,
  ProvisioningStep,
  DoctorCheck,
  WorkstationIdentity,
  WorkstationProfile,
  WorkstationProfileId,
} from './types/index.js';
