import type { EditorialOverride } from './schema.js';

/**
 * Editorial overrides applied after generated/seed evidence.
 * Use to feature, hide, or rephrase rows without inventing new contributions.
 */
export const editorialOverrides: EditorialOverride[] = [
  {
    id: 'setup-v-maintained',
    featured: true,
    role: 'maintainer',
    summary: 'GitHub Action maintainer — setup-v @v1.7',
  },
  {
    id: 'vtl-maintained',
    featured: true,
    role: 'maintainer',
    summary: 'V Tensor Library maintainer',
  },
  {
    id: 'vsl-maintained',
    featured: true,
    role: 'maintainer',
    summary: 'V Scientific Library maintainer',
  },
  {
    id: 'v-external-prs',
    featured: true,
    role: 'merged-author',
    summary: 'Merged authored PRs on vlang/v (search link — not a vanity count)',
  },
  {
    id: 'create-awesome-orgs',
    featured: true,
    role: 'org-maintainer',
  },
  {
    id: 'rxv-owned',
    featured: true,
    role: 'owner',
  },
  {
    id: 'agent-toolkit-owned',
    featured: true,
    role: 'owner',
  },
  {
    id: 'agentic-workstation-owned',
    featured: true,
    role: 'owner',
  },
];

export const overridesById = new Map(editorialOverrides.map((o) => [o.id, o]));
