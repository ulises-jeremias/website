export { default as Hero } from './components/Hero.astro';
export { default as DiscordCTA } from './components/DiscordCTA.astro';
export { default as WorkshopNarrative } from './components/WorkshopNarrative.astro';
export { default as ProjectFamilies } from './components/ProjectFamilies.astro';
export { default as ContributionPathways } from './components/ContributionPathways.astro';
export { default as SupportChannels } from './components/SupportChannels.astro';
export { default as ModerationPrivacy } from './components/ModerationPrivacy.astro';
export {
  communityMeta,
  workshopSections,
  projectFamilies,
  weeklyOpportunities,
  beginnerPathway,
  experiencedPathway,
  supportChannels,
  moderationItems,
} from './data/index.js';
export type {
  WorkshopSection,
  ProjectFamily,
  PathwayStep,
  ContributionPathway,
  WeeklyOpportunity,
  SupportChannel,
  ModerationItem,
  CommunityMeta,
} from './types/index.js';
