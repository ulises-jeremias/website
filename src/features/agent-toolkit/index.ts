export { default as ProvenanceStrip } from './components/ProvenanceStrip.astro';
export { default as EcosystemContext } from './components/EcosystemContext.astro';
export { default as CapabilityNexus } from './components/CapabilityNexus.astro';
export { default as QueueVsSwarmVisual } from './components/QueueVsSwarmVisual.astro';
export { default as SwarmControlRoom } from './components/SwarmControlRoom.astro';
export { default as InstallConsole } from './components/InstallConsole.astro';
export { default as CommunityWorkshopLink } from './components/CommunityWorkshopLink.astro';
export {
  toolkitOverview,
  toolkitStats,
  capabilityNodes,
  capabilities,
  skillDomains,
  distributionTargets,
  sourceCatalogLines,
  queueVsSwarm,
  swarmStages,
  swarmScenes,
  swarmRecipes,
  sharedRunStateFiles,
  uiBackends,
  installSnippets,
  budgetItems,
  communityCrossLink,
  toolkitDocs,
  personaVisuals,
  toolkitMeta,
  inventory,
  inventoryCounts,
  inventoryVerifiedAt,
  inventoryCommit,
  inventoryCommitFull,
  inventoryVersion,
  inventoryVersionLabel,
  inventoryProvenance,
  inventoryStrip,
} from './data/index.js';
export { swarmRoleVisuals, catalogAgentPersonas, featuredPersonas } from './data/personas.js';
export type {
  ToolkitStat,
  ToolkitOverviewSection,
  CapabilityNode,
  CapabilityItem,
  CapabilityFamilyId,
  InventoryExample,
  SkillDomain,
  DistributionTarget,
  QueueVsSwarmItem,
  SwarmStage,
  SwarmScene,
  SwarmRecipe,
  UiBackend,
  InstallSnippet,
  BudgetItem,
  CommunityCrossLink,
} from './types/index.js';
