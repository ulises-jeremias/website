import { z } from 'zod';

/** Contribution evidence kinds — stars/forks/watchers are never evidence. */
export const evidenceKindSchema = z.enum(['owned', 'maintained', 'org', 'external']);
export type EvidenceKind = z.infer<typeof evidenceKindSchema>;

export const evidenceRoleSchema = z.enum(['owner', 'maintainer', 'org-maintainer', 'merged-author', 'contributor']);
export type EvidenceRole = z.infer<typeof evidenceRoleSchema>;

export const evidenceItemSchema = z.object({
  id: z.string().min(1),
  kind: evidenceKindSchema,
  subject: z.string().min(1).describe('owner/repo, org, or search subject'),
  evidence: z.string().min(1).describe('Human-readable provenance line'),
  href: z.string().url(),
  role: evidenceRoleSchema.optional(),
  summary: z.string().optional(),
  featured: z.boolean().default(false),
  hidden: z.boolean().default(false),
  /** ISO timestamp when this row was last confirmed by the pipeline or curator. */
  verifiedAt: z.string().min(1),
  provenance: z.enum([
    'GENERATED_GITHUB_SOURCE',
    'EDITORIAL_USER_APPROVED',
    'CANONICAL_PROJECT_SOURCE',
    'DERIVED_BUILD_TIME',
  ]),
});

export type EvidenceItem = z.infer<typeof evidenceItemSchema>;

/** Volatile counts — omitted when refresh fails; never invent. */
export const volatileMetricsSchema = z.object({
  publicRepos: z.number().int().nonnegative().optional(),
  verifiedAt: z.string().optional(),
});

export const githubEvidenceCacheSchema = z.object({
  schemaVersion: z.literal(1),
  generatedAt: z.string().min(1),
  generator: z.string().min(1),
  /** How the cache was produced. */
  mode: z.enum(['seed', 'refresh', 'offline-cache']),
  evidence: z.array(evidenceItemSchema),
  volatile: volatileMetricsSchema.default({}),
  notes: z.array(z.string()).default([]),
});

export type GithubEvidenceCache = z.infer<typeof githubEvidenceCacheSchema>;

export const editorialOverrideSchema = z.object({
  id: z.string().min(1),
  featured: z.boolean().optional(),
  hidden: z.boolean().optional(),
  role: evidenceRoleSchema.optional(),
  summary: z.string().optional(),
  evidence: z.string().optional(),
});

export type EditorialOverride = z.infer<typeof editorialOverrideSchema>;
