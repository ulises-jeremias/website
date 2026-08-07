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
  queueVsSwarm,
  swarmStages,
  swarmScenes,
  swarmRecipes,
  uiBackends,
  installSnippets,
  budgetItems,
  toolkitMeta,
  inventoryVerifiedAt,
  inventoryCommit,
} from './data/index.js';
export type {
  ToolkitStat,
  ToolkitOverviewSection,
  CapabilityNode,
  CapabilityItem,
  SkillDomain,
  DistributionTarget,
  QueueVsSwarmItem,
  SwarmStage,
  SwarmScene,
  SwarmRecipe,
  UiBackend,
  InstallSnippet,
  BudgetItem,
} from './types/index.js';
