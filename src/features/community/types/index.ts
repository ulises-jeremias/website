import { z } from 'astro/zod';

export const communityProjectStateSchema = z.enum(['active', 'maintained', 'experimental', 'incubating']);
export type CommunityProjectState = z.infer<typeof communityProjectStateSchema>;

export const communityEcosystemSchema = z.enum(['personal-dx', 'agentic', 'create-awesome', 'v-ecosystem', 'lab']);
export type CommunityEcosystem = z.infer<typeof communityEcosystemSchema>;

export const communityInterestSchema = z.enum([
  'linux-desktop',
  'ai-agents',
  'node',
  'python',
  'v',
  'devops-infra',
  'documentation',
  'design',
  'testing',
  'beginner',
]);
export type CommunityInterest = z.infer<typeof communityInterestSchema>;

export const communityRoleSchema = z.enum([
  'Creator',
  'Maintainer',
  'Core Team',
  'Contributor',
  'Curator',
  'Coordinator',
]);
export type CommunityRole = z.infer<typeof communityRoleSchema>;

/** Active / experimental project surfaced on the Community workshop. */
export const communityProjectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  summary: z.string().min(1),
  ecosystem: communityEcosystemSchema,
  /** Secondary ecosystems for graph/tag overlaps — optional. */
  alsoIn: z.array(communityEcosystemSchema).default([]),
  repo: z.string().min(1).optional(),
  org: z.string().min(1).optional(),
  website: z.string().url().optional(),
  worldPath: z.string().optional(),
  state: z.enum(['active', 'maintained', 'experimental']),
  communityEnabled: z.literal(true),
  contributionAreas: z.array(z.string().min(1)).min(1),
  interests: z.array(communityInterestSchema).min(1),
  beginnerFriendly: z.boolean().default(false),
  role: communityRoleSchema,
  source: z.enum(['github', 'editorial']),
});
export type CommunityProject = z.infer<typeof communityProjectSchema>;

/** Future directions — editorial only; never invent URLs. */
export const incubatingProjectSchema = z.object({
  id: z.string().min(1),
  workingTitle: z.string().min(1),
  summary: z.string().min(1),
  themes: z.array(z.string().min(1)).min(1),
  public: z.literal(true),
  ecosystem: communityEcosystemSchema.default('lab'),
});
export type IncubatingProject = z.infer<typeof incubatingProjectSchema>;

export const contributionOpportunitySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  interests: z.array(communityInterestSchema).min(1),
  /** Verified GitHub search or repo issues URL — never website-only as the sole CTA. */
  href: z.string().url(),
  labels: z.array(z.string()).default([]),
});
export type ContributionOpportunity = z.infer<typeof contributionOpportunitySchema>;

export const interestFilterSchema = z.object({
  id: communityInterestSchema,
  label: z.string().min(1),
  hint: z.string().min(1),
});
export type InterestFilter = z.infer<typeof interestFilterSchema>;

export const workshopSectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  paragraphs: z.array(z.string().min(1)).min(1),
});
export type WorkshopSection = z.infer<typeof workshopSectionSchema>;

export const supportChannelSchema = z.object({
  label: z.string().min(1),
  href: z
    .string()
    .url()
    .or(z.string().regex(/^\/[a-z0-9-/#]*$/)),
  description: z.string().min(1),
  external: z.boolean(),
});
export type SupportChannel = z.infer<typeof supportChannelSchema>;

export const moderationItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});
export type ModerationItem = z.infer<typeof moderationItemSchema>;

export type CommunityMeta = {
  discordInviteUrl: string;
  discordBlurple: string;
  discordBlurpleHover: string;
  /** Project-org CoC example — not claimed as universal Digital Nest policy. */
  exampleCodeOfConductUrl: string;
  communityDistinctNote: string;
  metricsPolicy: string;
};
