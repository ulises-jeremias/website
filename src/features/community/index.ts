export { default as Hero } from './components/Hero.astro';
export { default as DiscordCTA } from './components/DiscordCTA.astro';
export { default as WorkshopNarrative } from './components/WorkshopNarrative.astro';
export { default as WorkshopGraph } from './components/WorkshopGraph.astro';
export { default as ActiveWorkshop } from './components/ActiveWorkshop.astro';
export { default as ContributionExplorer } from './components/ContributionExplorer.astro';
export { default as SupportChannels } from './components/SupportChannels.astro';
export { default as ModerationPrivacy } from './components/ModerationPrivacy.astro';

export {
  communityMeta,
  workshopSections,
  communityProjects,
  incubatingProjects,
  interestFilters,
  contributionOpportunities,
  supportChannels,
  moderationItems,
  ecosystemLabels,
  activeWorkshopProjects,
  communityIssueSearch,
  validateCommunityRegistry,
  COMMUNITY_ISSUE_SEARCH_BASE,
} from './data/index.js';

export type {
  CommunityMeta,
  CommunityProject,
  CommunityProjectState,
  CommunityEcosystem,
  CommunityInterest,
  CommunityRole,
  IncubatingProject,
  ContributionOpportunity,
  InterestFilter,
  WorkshopSection,
  SupportChannel,
  ModerationItem,
} from './types/index.js';
