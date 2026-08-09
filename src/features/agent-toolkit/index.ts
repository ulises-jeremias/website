export { default as ProvenanceStrip } from './components/ProvenanceStrip.astro';
export { default as CapabilityNexus } from './components/CapabilityNexus.astro';
export { default as QueueVsSwarmVisual } from './components/QueueVsSwarmVisual.astro';
export { default as SwarmControlRoom } from './components/SwarmControlRoom.astro';
export { default as InstallConsole } from './components/InstallConsole.astro';
export { default as CommunityWorkshopLink } from './components/CommunityWorkshopLink.astro';
/** @deprecated — kept for transitional imports / older tests */
export { default as Hero } from './components/Hero.astro';
export { default as Overview } from './components/Overview.astro';
export { default as CapabilityAnatomy } from './components/CapabilityAnatomy.astro';
export { default as DistributionMap } from './components/DistributionMap.astro';
export { default as QueueSeparation } from './components/QueueSeparation.astro';
export { default as SwarmStory } from './components/SwarmStory.astro';
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
