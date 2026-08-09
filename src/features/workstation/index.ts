export { default as EcosystemDiagram } from './components/EcosystemDiagram.astro';
export { default as StackDiagram } from './components/StackDiagram.astro';
export { default as WorkstationHero } from './components/WorkstationHero.astro';
export { default as WorkstationAtlas } from './components/WorkstationAtlas.astro';
export { default as WorkstationBootMap } from './components/WorkstationBootMap.astro';
export { default as LayerCard } from './components/LayerCard.astro';
export { default as LayersSection } from './components/LayersSection.astro';
export { default as ProvisioningSection } from './components/ProvisioningSection.astro';
export { default as DoctorChecks } from './components/DoctorChecks.astro';
export { default as ToolkitRationale } from './components/ToolkitRationale.astro';
export { default as ThinWorkstationBadge } from './components/ThinWorkstationBadge.astro';

export {
  workstationLayers,
  workstationProfiles,
  provisioningSteps,
  doctorChecks,
  toolkitRationale,
  workstationIdentity,
  thinWorkstationVerification,
} from './data/index.js';

export { getLayers, getLayerById, getEcosystemFlow } from './services/workstation.js';

export type {
  LayerMeta,
  LayerId,
  ProvisioningStep,
  DoctorCheck,
  ToolkitRationalePoint,
  WorkstationIdentity,
  WorkstationProfile,
  WorkstationProfileId,
} from './types/index.js';
