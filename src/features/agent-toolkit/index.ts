export { default as Hero } from './components/Hero.astro';
export { default as Overview } from './components/Overview.astro';
export { default as Capabilities } from './components/Capabilities.astro';
export { default as SwarmVisualization } from './components/SwarmVisualization.astro';
export {
  toolkitOverview,
  toolkitStats,
  capabilities,
  swarmScenes,
  installSnippets,
  budgetItems,
  toolkitMeta,
} from './data/index.js';
export type {
  ToolkitStat,
  ToolkitOverviewSection,
  CapabilityItem,
  SwarmScene,
  InstallSnippet,
  BudgetItem,
} from './types/index.js';
