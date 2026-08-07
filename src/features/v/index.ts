export { default as Hero } from './components/Hero.astro';
export { default as VOverview } from './components/VOverview.astro';
export { default as VCard } from './components/VCard.astro';
export { default as VCards } from './components/VCards.astro';
export { default as EcosystemDiagram } from './components/EcosystemDiagram.astro';
export { default as VSLDiagram } from './components/VSLDiagram.astro';
export { default as VTLDiagram } from './components/VTLDiagram.astro';
export { default as RxVDiagram } from './components/RxVDiagram.astro';
export { default as SetupVDiagram } from './components/SetupVDiagram.astro';

export {
  vProjects,
  vSections,
  vslBackends,
  vtlModules,
  rxvOperatorGroups,
  setupVPipeline,
  vEcosystemSteps,
  licenseEntries,
  vMeta,
} from './data/index.js';

export type {
  VProject,
  VSection,
  VDiagramStep,
  VLicenseEntry,
  VBackend,
  VOperatorGroup,
} from './types/index.js';
