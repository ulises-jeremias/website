import { z } from 'astro/zod';
import { getWorldById, getWorldBySlug } from './project-worlds.js';

// ---------------------------------------------------------------------------
// Portfolio taxonomy — ADR-003
//
// A typed layer above `projectWorlds` and `Project` that classifies work into
// four flagship areas with tier, responsibility, maturity, and time-lens
// metadata. It references existing project IDs and world IDs rather than
// duplicating their data.
//
// Design rules (from issue #393):
// - Exactly four flagship areas.
// - Agentic area contains Toolkit, Workstation, and Harness as children.
// - HorneroConfig is the display name for `/dotfiles`.
// - V organization projects distinguish external ownership from verified role.
// - `agentic-workstation-demo` and `hello-vsl` are supporting/lab tier.
// - Recoil DevTools is selected work; upstream Recoil being archived does not
//   make this repository archived.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const portfolioAreaSchema = z.enum(['agentic', 'horneroconfig', 'v-ecosystem', 'create-awesome']);
export type PortfolioArea = z.infer<typeof portfolioAreaSchema>;

export const portfolioTierSchema = z.enum([
  'flagship-area',
  'flagship-component',
  'selected-work',
  'supporting-resource',
  'lab-demo',
  'archive',
]);
export type PortfolioTier = z.infer<typeof portfolioTierSchema>;

/**
 * Responsibility vocabulary. Distinct from `ProjectRole` in that it can express
 * organization-level context without implying personal ownership.
 */
export const portfolioResponsibilitySchema = z.enum([
  'author-owner',
  'primary-maintainer',
  'maintainer',
  'org-member-work',
  'contributor',
  'external-project',
]);
export type PortfolioResponsibility = z.infer<typeof portfolioResponsibilitySchema>;

export const portfolioTimeLensSchema = z.enum(['current', 'proven', 'current-and-proven']);
export type PortfolioTimeLens = z.infer<typeof portfolioTimeLensSchema>;

export const portfolioRelationshipSchema = z.enum([
  'parent-family',
  'component-product',
  'supporting-demo',
  'external-ecosystem',
]);
export type PortfolioRelationship = z.infer<typeof portfolioRelationshipSchema>;

// ---------------------------------------------------------------------------
// Evidence reference
// ---------------------------------------------------------------------------

/**
 * Stable editorial source or generated snapshot with verification metadata.
 * Volatile claims must carry `verifiedAt`; stable claims may omit it.
 */
export const portfolioEvidenceSchema = z.object({
  sourceUrl: z.string().url(),
  sourceType: z.enum(['editorial', 'generated-snapshot', 'repository-metadata']),
  verifiedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}/, 'ISO date required')
    .optional(),
  sourceRevision: z.string().min(1).optional(),
});
export type PortfolioEvidence = z.infer<typeof portfolioEvidenceSchema>;

// ---------------------------------------------------------------------------
// Portfolio entry
// ---------------------------------------------------------------------------

export const portfolioEntrySchema = z
  .object({
    /** Stable kebab-case identifier unique across the portfolio. */
    id: z.string().min(1),
    /** Display name (may differ from the route slug, e.g. HorneroConfig). */
    title: z.string().min(1),
    /** Canonical route or external URL. */
    path: z.string().min(1),
    /** Which of the four flagship areas this entry belongs to. */
    area: portfolioAreaSchema,
    /** Portfolio tier — controls where this appears in Work and homepage. */
    tier: portfolioTierSchema,
    /** Ulises's verified role. */
    responsibility: portfolioResponsibilitySchema,
    /** Repository or organization owner (external ownership is explicit). */
    repositoryOwner: z.string().min(1),
    /** Stable repository slug (e.g. `dotfiles`, `vsl`). */
    repositorySlug: z.string().min(1),
    /** Whether this is current focus, proven over time, or both. */
    timeLens: portfolioTimeLensSchema,
    /** Relationship to its area. */
    relationship: portfolioRelationshipSchema,
    /** One-sentence responsibility-first description. */
    description: z.string().min(1),
    /** External project scale (e.g. V stars) shown as context, not a metric. */
    externalContext: z.string().optional(),
    /** Distribution channels (npm, PyPI, AUR, Homebrew, etc.). */
    channels: z.array(z.string().min(1)).default([]),
    /** Proof/evidence reference. */
    evidence: portfolioEvidenceSchema,
    /** Whether this may appear as a homepage flagship. */
    homepageEligible: z.boolean().default(false),
  })
  .superRefine((value, ctx) => {
    // Archive tier must never be homepage-eligible.
    if (value.tier === 'archive' && value.homepageEligible) {
      ctx.addIssue({
        code: 'custom',
        message: 'archive entries cannot be homepage-eligible',
        path: ['homepageEligible'],
      });
    }
    // Lab/demo/supporting tiers must never be homepage-eligible.
    if ((value.tier === 'lab-demo' || value.tier === 'supporting-resource') && value.homepageEligible) {
      ctx.addIssue({
        code: 'custom',
        message: 'lab-demo and supporting-resource cannot be homepage-eligible',
        path: ['homepageEligible'],
      });
    }
    // External projects cannot be author-owned.
    if (value.responsibility === 'external-project' && value.repositoryOwner === 'ulises-jeremias') {
      ctx.addIssue({
        code: 'custom',
        message: 'external-project cannot be owned by ulises-jeremias',
        path: ['repositoryOwner'],
      });
    }
    // Generated-snapshot evidence requires verifiedAt.
    if (value.evidence.sourceType === 'generated-snapshot' && !value.evidence.verifiedAt) {
      ctx.addIssue({
        code: 'custom',
        message: 'generated-snapshot evidence requires verifiedAt',
        path: ['evidence', 'verifiedAt'],
      });
    }
  });

export type PortfolioEntry = z.infer<typeof portfolioEntrySchema>;

// ---------------------------------------------------------------------------
// Flagship area metadata
// ---------------------------------------------------------------------------

export const portfolioAreaMetaSchema = z.object({
  id: portfolioAreaSchema,
  title: z.string().min(1),
  /** Canonical route for the area (or the first detail route). */
  path: z.string().min(1),
  /** One-sentence value proposition for the area. */
  proposition: z.string().min(1),
  /** Optional overview route (/agentic only). */
  overviewPath: z.string().optional(),
  /** Component entry IDs that belong to this area. */
  memberIds: z.array(z.string().min(1)).min(1),
});
export type PortfolioAreaMeta = z.infer<typeof portfolioAreaMetaSchema>;

// ---------------------------------------------------------------------------
// Canonical data
// ---------------------------------------------------------------------------

export const portfolioAreas: PortfolioAreaMeta[] = [
  {
    id: 'agentic',
    title: 'Agentic Developer Stack',
    path: '/agent-toolkit',
    overviewPath: '/agentic',
    proposition:
      'Portable agentic capabilities, machine provisioning, and persistent workspace context — three composable responsibilities, not one monolith.',
    memberIds: ['agent-toolkit', 'agentic-workstation', 'agentic-harness'],
  },
  {
    id: 'horneroconfig',
    title: 'HorneroConfig',
    path: '/dotfiles',
    proposition: 'A reproducible Linux developer environment built on Hyprland, Quickshell, Smart Colors, and chezmoi.',
    memberIds: ['horneroconfig'],
  },
  {
    id: 'v-ecosystem',
    title: 'V Ecosystem',
    path: '/v',
    proposition:
      'Contributions to the V programming language and its scientific computing, tensor/ML, reactive, and CI tooling ecosystems.',
    memberIds: ['v', 'vsl', 'vtl', 'rxv', 'setup-v', 'awesome-v'],
  },
  {
    id: 'create-awesome',
    title: 'Create Awesome',
    path: '/create-awesome',
    proposition:
      'Composable application scaffolding across Node.js, Python, and V — one composition model, three runtimes.',
    memberIds: ['create-node-app', 'create-python-app', 'create-vlang-app'],
  },
];

export const portfolioEntries: PortfolioEntry[] = [
  // --- Agentic Developer Stack ---
  {
    id: 'agent-toolkit',
    title: 'Agent Toolkit',
    path: '/agent-toolkit',
    area: 'agentic',
    tier: 'flagship-component',
    responsibility: 'author-owner',
    repositoryOwner: 'ulises-jeremias',
    repositorySlug: 'agent-toolkit',
    timeLens: 'current',
    relationship: 'component-product',
    description: 'Portable agentic capabilities and execution runtime across major coding assistants.',
    channels: ['GitHub Releases', 'npm', 'PyPI', 'AUR', 'Homebrew tap'],
    evidence: {
      sourceUrl: 'https://github.com/ulises-jeremias/agent-toolkit',
      sourceType: 'editorial',
    },
    homepageEligible: false, // surfaced through the Agentic area, not as an independent flagship
  },
  {
    id: 'agentic-workstation',
    title: 'Agentic Workstation',
    path: '/agentic-workstation',
    area: 'agentic',
    tier: 'flagship-component',
    responsibility: 'author-owner',
    repositoryOwner: 'ulises-jeremias',
    repositorySlug: 'agentic-workstation',
    timeLens: 'current',
    relationship: 'component-product',
    description: 'Thin machine provisioning and host policy for an AI-native developer workstation.',
    channels: ['GitHub Releases'],
    evidence: {
      sourceUrl: 'https://github.com/ulises-jeremias/agentic-workstation',
      sourceType: 'editorial',
    },
    homepageEligible: false,
  },
  {
    id: 'agentic-harness',
    title: 'Agentic Harness',
    path: '/agentic-harness',
    area: 'agentic',
    tier: 'flagship-component',
    responsibility: 'author-owner',
    repositoryOwner: 'ulises-jeremias',
    repositorySlug: 'agentic-harness',
    timeLens: 'current',
    relationship: 'component-product',
    description:
      'Persistent workspace scaffold for knowledge, personas, packs, and run history, powered by Agent Toolkit.',
    channels: ['GitHub Releases'],
    evidence: {
      sourceUrl: 'https://github.com/ulises-jeremias/agentic-harness',
      sourceType: 'editorial',
    },
    homepageEligible: false,
  },
  {
    id: 'agentic-workstation-demo',
    title: 'Agentic Workstation Demo',
    path: 'https://github.com/ulises-jeremias/agentic-workstation-demo',
    area: 'agentic',
    tier: 'lab-demo',
    responsibility: 'author-owner',
    repositoryOwner: 'ulises-jeremias',
    repositorySlug: 'agentic-workstation-demo',
    timeLens: 'current',
    relationship: 'supporting-demo',
    description: 'See-it-in-action demo of the Agentic Workstation provisioning flow.',
    channels: [],
    evidence: {
      sourceUrl: 'https://github.com/ulises-jeremias/agentic-workstation-demo',
      sourceType: 'repository-metadata',
    },
    homepageEligible: false,
  },

  // --- HorneroConfig ---
  {
    id: 'horneroconfig',
    title: 'HorneroConfig',
    path: '/dotfiles',
    area: 'horneroconfig',
    tier: 'flagship-component',
    responsibility: 'author-owner',
    repositoryOwner: 'ulises-jeremias',
    repositorySlug: 'dotfiles',
    timeLens: 'current-and-proven',
    relationship: 'parent-family',
    description: 'Reproducible Linux desktop environment — Hyprland, Quickshell, Smart Colors, chezmoi.',
    channels: ['GitHub', 'AUR'],
    evidence: {
      sourceUrl: 'https://github.com/ulises-jeremias/dotfiles',
      sourceType: 'editorial',
    },
    homepageEligible: true,
  },

  // --- V Ecosystem ---
  {
    id: 'v',
    title: 'V',
    path: '/v#v',
    area: 'v-ecosystem',
    tier: 'flagship-component',
    responsibility: 'org-member-work',
    repositoryOwner: 'vlang',
    repositorySlug: 'v',
    timeLens: 'proven',
    relationship: 'external-ecosystem',
    description: 'Simple, fast, safe compiled language. Core Team contributions to compiler, tooling, and docs.',
    channels: [],
    externalContext: 'vlang organization project — external scale is context, not personal ownership',
    evidence: {
      sourceUrl: 'https://github.com/vlang/v',
      sourceType: 'repository-metadata',
    },
    homepageEligible: false,
  },
  {
    id: 'vsl',
    title: 'VSL',
    path: '/v#vsl',
    area: 'v-ecosystem',
    tier: 'flagship-component',
    responsibility: 'primary-maintainer',
    repositoryOwner: 'vlang',
    repositorySlug: 'vsl',
    timeLens: 'current-and-proven',
    relationship: 'component-product',
    description: 'V Scientific Library — HPC primitives, linear algebra, numerical methods, optional compute backends.',
    channels: ['VPM'],
    evidence: {
      sourceUrl: 'https://github.com/vlang/vsl',
      sourceType: 'repository-metadata',
    },
    homepageEligible: false,
  },
  {
    id: 'vtl',
    title: 'VTL',
    path: '/v#vtl',
    area: 'v-ecosystem',
    tier: 'flagship-component',
    responsibility: 'primary-maintainer',
    repositoryOwner: 'vlang',
    repositorySlug: 'vtl',
    timeLens: 'current',
    relationship: 'component-product',
    description: 'V Tensor Library — tensors, autograd, and neural-network APIs built on VSL.',
    channels: ['VPM'],
    evidence: {
      sourceUrl: 'https://github.com/vlang/vtl',
      sourceType: 'repository-metadata',
    },
    homepageEligible: false,
  },
  {
    id: 'rxv',
    title: 'RxV',
    path: '/v#rxv',
    area: 'v-ecosystem',
    tier: 'flagship-component',
    responsibility: 'author-owner',
    repositoryOwner: 'ulises-jeremias',
    repositorySlug: 'rxv',
    timeLens: 'proven',
    relationship: 'component-product',
    description: 'ReactiveX-style observables for V with generic streams and channel-based operator pipelines.',
    channels: ['VPM'],
    evidence: {
      sourceUrl: 'https://github.com/ulises-jeremias/rxv',
      sourceType: 'repository-metadata',
    },
    homepageEligible: false,
  },
  {
    id: 'setup-v',
    title: 'setup-v',
    path: '/v#setup-v',
    area: 'v-ecosystem',
    tier: 'flagship-component',
    responsibility: 'primary-maintainer',
    repositoryOwner: 'vlang',
    repositorySlug: 'setup-v',
    timeLens: 'proven',
    relationship: 'component-product',
    description: 'GitHub Action to install V in CI workflows.',
    channels: ['GitHub Actions'],
    evidence: {
      sourceUrl: 'https://github.com/vlang/setup-v',
      sourceType: 'repository-metadata',
    },
    homepageEligible: false,
  },
  {
    id: 'awesome-v',
    title: 'Awesome V',
    path: '/v#awesome-v',
    area: 'v-ecosystem',
    tier: 'supporting-resource',
    responsibility: 'contributor',
    repositoryOwner: 'vlang',
    repositorySlug: 'awesome-v',
    timeLens: 'proven',
    relationship: 'external-ecosystem',
    description: 'Community-curated catalog of V frameworks, libraries, tools, and resources.',
    channels: [],
    evidence: {
      sourceUrl: 'https://github.com/vlang/awesome-v',
      sourceType: 'repository-metadata',
    },
    homepageEligible: false,
  },
  {
    id: 'hello-vsl',
    title: 'hello-vsl',
    path: 'https://github.com/ulises-jeremias/hello-vsl',
    area: 'v-ecosystem',
    tier: 'lab-demo',
    responsibility: 'author-owner',
    repositoryOwner: 'ulises-jeremias',
    repositorySlug: 'hello-vsl',
    timeLens: 'proven',
    relationship: 'supporting-demo',
    description: 'Containerized VSL example and development starter.',
    channels: [],
    evidence: {
      sourceUrl: 'https://github.com/ulises-jeremias/hello-vsl',
      sourceType: 'repository-metadata',
    },
    homepageEligible: false,
  },

  // --- Create Awesome ---
  {
    id: 'create-node-app',
    title: 'Create Awesome Node App',
    path: '/create-awesome#node',
    area: 'create-awesome',
    tier: 'flagship-component',
    responsibility: 'author-owner',
    repositoryOwner: 'Create-Node-App',
    repositorySlug: 'create-node-app',
    timeLens: 'current-and-proven',
    relationship: 'component-product',
    description: 'Mature Node.js scaffolding — 10 templates, 53 extensions, npm distribution.',
    channels: ['npm'],
    evidence: {
      sourceUrl: 'https://github.com/Create-Node-App/create-node-app',
      sourceType: 'editorial',
    },
    homepageEligible: false,
  },
  {
    id: 'create-python-app',
    title: 'Create Awesome Python App',
    path: '/create-awesome#python',
    area: 'create-awesome',
    tier: 'flagship-component',
    responsibility: 'author-owner',
    repositoryOwner: 'Create-Python-App',
    repositorySlug: 'create-python-app',
    timeLens: 'current',
    relationship: 'component-product',
    description: 'Python scaffolding — 6 templates, 19 extensions, synchronized beta channels.',
    channels: ['PyPI', 'Homebrew', 'AUR', 'Docker Hub'],
    evidence: {
      sourceUrl: 'https://github.com/Create-Python-App/create-python-app',
      sourceType: 'editorial',
    },
    homepageEligible: false,
  },
  {
    id: 'create-vlang-app',
    title: 'Create Awesome V App',
    path: '/create-awesome#v',
    area: 'create-awesome',
    tier: 'flagship-component',
    responsibility: 'author-owner',
    repositoryOwner: 'Create-Vlang-App',
    repositorySlug: 'create-vlang-app',
    timeLens: 'current',
    relationship: 'component-product',
    description: 'V scaffolding — 7 templates, 11 extensions, early release.',
    channels: ['GitHub Releases', 'Homebrew'],
    evidence: {
      sourceUrl: 'https://github.com/Create-Vlang-App/create-vlang-app',
      sourceType: 'editorial',
    },
    homepageEligible: false,
  },

  // --- Selected work ---
  {
    id: 'recoil-devtools',
    title: 'Recoil DevTools',
    path: 'https://github.com/ulises-jeremias/recoil-devtools',
    area: 'agentic', // closest area; it is standalone developer tooling
    tier: 'selected-work',
    responsibility: 'maintainer',
    repositoryOwner: 'ulises-jeremias',
    repositorySlug: 'recoil-devtools',
    timeLens: 'proven',
    relationship: 'component-product',
    description:
      'Maintained DevTools for existing Recoil applications. Upstream Recoil is archived; this tool remains maintained for compatibility.',
    channels: ['npm'],
    evidence: {
      sourceUrl: 'https://github.com/ulises-jeremias/recoil-devtools',
      sourceType: 'repository-metadata',
    },
    homepageEligible: false,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getPortfolioEntryById(id: string): PortfolioEntry | undefined {
  return portfolioEntries.find((e) => e.id === id);
}

export function getPortfolioAreaById(id: PortfolioArea): PortfolioAreaMeta | undefined {
  return portfolioAreas.find((a) => a.id === id);
}

export function getPortfolioEntriesByArea(area: PortfolioArea): PortfolioEntry[] {
  return portfolioEntries.filter((e) => e.area === area);
}

export function getPortfolioEntriesByTier(tier: PortfolioTier): PortfolioEntry[] {
  return portfolioEntries.filter((e) => e.tier === tier);
}

export function getHomepageFlagships(): PortfolioAreaMeta[] {
  return portfolioAreas.filter((a) => getPortfolioEntriesByArea(a.id).some((e) => e.homepageEligible));
}

export function getSelectedWork(): PortfolioEntry[] {
  return getPortfolioEntriesByTier('selected-work');
}

export function getLabAndDemo(): PortfolioEntry[] {
  return portfolioEntries.filter((e) => e.tier === 'lab-demo' || e.tier === 'supporting-resource');
}

// ---------------------------------------------------------------------------
// Validation — build/test-time invariants
// ---------------------------------------------------------------------------

export function validatePortfolio(): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();

  // Parse each entry.
  for (const entry of portfolioEntries) {
    const parsed = portfolioEntrySchema.safeParse(entry);
    if (!parsed.success) {
      errors.push(`[${entry.id}] schema: ${parsed.error.issues.map((i) => i.message).join('; ')}`);
    }
    if (ids.has(entry.id)) errors.push(`Duplicate portfolio entry id: ${entry.id}`);
    ids.add(entry.id);
  }

  // Verify area member references.
  for (const area of portfolioAreas) {
    for (const memberId of area.memberIds) {
      if (!ids.has(memberId)) {
        errors.push(`[${area.id}] memberIds references unknown entry: ${memberId}`);
      }
    }
  }

  // Verify every entry belongs to a declared area.
  const areaIds = new Set(portfolioAreas.map((a) => a.id));
  for (const entry of portfolioEntries) {
    if (!areaIds.has(entry.area)) {
      errors.push(`[${entry.id}] area ${entry.area} is not declared in portfolioAreas`);
    }
  }

  // Verify world-path references resolve.
  for (const entry of portfolioEntries) {
    if (entry.path.startsWith('/') && !getWorldById(entry.path.replace(/^\//, '').split(/[#/]/)[0] ?? '')) {
      // path is internal — the first segment should match a known world slug or be `/agentic`/`/about`
      const firstSegment = entry.path.replace(/^\//, '').split(/[#/]/)[0] ?? '';
      if (!['agentic', 'about'].includes(firstSegment) && !getWorldBySlug(firstSegment)) {
        errors.push(`[${entry.id}] internal path ${entry.path} does not resolve to a known route`);
      }
    }
  }

  return errors;
}
