import { z } from 'zod';

/**
 * Projects ledger schema.
 *
 * - `archived` means truly archived (preserved, no longer maintained) — never used as an
 *   anti-duplication hack for world projects.
 * - `visibility: 'world'` + `worldId` points at a dedicated world route.
 * - Volatile metrics (stars/downloads) require build-time `verifiedAt`.
 */

export const projectStatusSchema = z.enum(['active', 'maintained', 'experimental', 'archived']);
export type ProjectStatus = z.infer<typeof projectStatusSchema>;

export const projectKindSchema = z.enum(['library', 'tool', 'template', 'resource', 'app', 'world']);
export type ProjectKind = z.infer<typeof projectKindSchema>;

export const projectRoleSchema = z.enum(['author', 'maintainer', 'contributor', 'curator', 'org-maintainer']);
export type ProjectRole = z.infer<typeof projectRoleSchema>;

export const projectVisibilitySchema = z.enum(['public', 'world', 'hidden']);
export type ProjectVisibility = z.infer<typeof projectVisibilitySchema>;

export const projectGroupSchema = z.enum(['personal-dx', 'agentic', 'v', 'create-awesome', 'dev-tools', 'experiments']);
export type ProjectGroup = z.infer<typeof projectGroupSchema>;

export const projectLinkSchema = z.object({
  label: z.string().min(1),
  href: z
    .string()
    .url()
    .or(z.string().regex(/^\/[a-z0-9\-/#]*$/i)),
  kind: z.enum(['repo', 'site', 'docs', 'world']),
});
export type ProjectLink = z.infer<typeof projectLinkSchema>;

/** Build-time verified volatile metrics — never hand-maintained without verifiedAt. */
export const projectMetricsSchema = z.object({
  stars: z.number().int().nonnegative().optional(),
  downloads: z.number().int().nonnegative().optional(),
  verifiedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}/, 'ISO date required'),
  source: z.literal('GENERATED_GITHUB_SOURCE').default('GENERATED_GITHUB_SOURCE'),
});
export type ProjectMetrics = z.infer<typeof projectMetricsSchema>;

export const projectSchema = z
  .object({
    slug: z.string().min(1),
    title: z.string().min(1),
    summary: z.string().min(1),
    status: projectStatusSchema,
    visibility: projectVisibilitySchema.default('public'),
    featured: z.boolean().default(false),
    tags: z.array(z.string().min(1)).default([]),
    kind: projectKindSchema,
    role: projectRoleSchema,
    group: projectGroupSchema,
    /** Dedicated world this entry points to (required when visibility is `world`). */
    worldId: z.string().min(1).optional(),
    links: z.array(projectLinkSchema).min(1),
    lastVerified: z.string().regex(/^\d{4}-\d{2}-\d{2}/),
    metrics: projectMetricsSchema.optional(),
    archivedNote: z.string().optional(),
    /** License / attribution caution shown in the ledger (e.g. CC BY-NC). */
    licenseNote: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.visibility === 'world' && !value.worldId) {
      ctx.addIssue({
        code: 'custom',
        message: 'world visibility requires worldId',
        path: ['worldId'],
      });
    }
    if (value.status === 'archived' && value.featured) {
      ctx.addIssue({
        code: 'custom',
        message: 'archived projects must not be featured',
        path: ['featured'],
      });
    }
    if (value.metrics && !value.metrics.verifiedAt) {
      ctx.addIssue({
        code: 'custom',
        message: 'metrics require verifiedAt',
        path: ['metrics', 'verifiedAt'],
      });
    }
  });

export type Project = z.infer<typeof projectSchema>;

export const statusLabels: Record<ProjectStatus, string> = {
  active: 'Active',
  maintained: 'Maintained',
  experimental: 'Experimental',
  archived: 'Archived',
};

export const statusDescriptions: Record<ProjectStatus, string> = {
  active: 'Actively developed, issues welcome',
  maintained: 'Stable, maintenance mode',
  experimental: 'Early, API may change',
  archived: 'Preserved, no longer maintained',
};

export const roleLabels: Record<ProjectRole, string> = {
  author: 'Author',
  maintainer: 'Maintainer',
  contributor: 'Contributor',
  curator: 'Curator',
  'org-maintainer': 'Org maintainer',
};

export const groupLabels: Record<ProjectGroup, string> = {
  'personal-dx': 'Personal DX',
  agentic: 'Agentic',
  v: 'V',
  'create-awesome': 'Create Awesome',
  'dev-tools': 'Dev tools',
  experiments: 'Experiments / legacy',
};

/** Stable display order for ledger groups. */
export const groupOrder: ProjectGroup[] = ['personal-dx', 'agentic', 'v', 'create-awesome', 'dev-tools', 'experiments'];
