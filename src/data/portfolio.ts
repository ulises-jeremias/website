import { z } from 'astro/zod';
import { getRouteByPath } from './routes.js';

// ---------------------------------------------------------------------------
// Portfolio taxonomy — ADR-003, amended by ADR-004
//
// A typed layer above `projectWorlds` and `Project` that classifies work into
// four flagship areas with tier, responsibility, maturity, and time-lens
// metadata. It references existing project IDs and world IDs rather than
// duplicating their data.
//
// Design rules (from issue #393, amended by ADR-004):
// - Exactly four flagship areas.
// - Agentic area contains Toolkit, Workstation, and Harness as children.
// - Hornero area contains HorneroConfig (established, `/dotfiles`) and
//   Hornero OS (development preview, `/hornero-os`). Hornero OS must never be
//   described as installable while its installer/ISO slots are future.
// - HorneroConfig is the display name for `/dotfiles`.
// - V organization projects distinguish external ownership from verified role.
// - `agentic-workstation-demo` and `hello-vsl` are supporting/lab tier.
// - Recoil DevTools is selected work; upstream Recoil being archived does not
//   make this repository archived.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const portfolioAreaSchema = z.enum(['agentic', 'hornero', 'v-ecosystem', 'create-awesome']);
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

/**
 * Maturity vocabulary (ADR-004). Answers "can I rely on this today?" without
 * implying popularity: `established` (long-running, used by its author daily),
 * `active` (released and evolving), `early` (released, young),
 * `preview` (public previews, not a finished product).
 */
export const portfolioMaturitySchema = z.enum(['established', 'active', 'early', 'preview']);
export type PortfolioMaturity = z.infer<typeof portfolioMaturitySchema>;
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
    /**
     * Verified public role title — the human-facing wording (e.g.
     * "Creator and lead maintainer") distinct from the generic
     * `responsibility` classification enum. Use this for display; use
     * `responsibility` for classification and validation.
     */
    roleLabel: z.string().min(1).optional(),
    /**
     * Short contextual proof lines (issue #399). Each line is a plain sentence
     * with an allowlisted fact kind — never a raw popularity metric. Lines for
     * volatile kinds (release, maintenance, channel-freshness) must carry a
     * verification date.
     */
    proofLines: z
      .array(
        z.object({
          kind: z.enum([
            'maintenance',
            'distribution',
            'release',
            'demo',
            'role',
            'ecosystem-scale',
            'history',
            'channel-freshness',
          ]),
          text: z.string().min(1),
          verifiedAt: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}/, 'ISO date required')
            .optional(),
        }),
      )
      .default([]),
    /** Whether this may appear as a homepage flagship. */
    homepageEligible: z.boolean().default(false),
    /** Honest maturity label (ADR-004). */
    maturity: portfolioMaturitySchema.optional(),
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
    // Volatile proof kinds require verifiedAt (#399 evidence policy).
    const volatileProofKinds = new Set(['release', 'maintenance', 'channel-freshness']);
    for (const [index, line] of value.proofLines.entries()) {
      if (volatileProofKinds.has(line.kind) && !line.verifiedAt) {
        ctx.addIssue({
          code: 'custom',
          message: `proofLines[${index}] kind "${line.kind}" is volatile and requires verifiedAt`,
          path: ['proofLines', index, 'verifiedAt'],
        });
      }
      // ecosystem-scale lines require an external owner (never personal scale).
      if (line.kind === 'ecosystem-scale' && value.repositoryOwner === 'ulises-jeremias') {
        ctx.addIssue({
          code: 'custom',
          message: `proofLines[${index}] ecosystem-scale requires an external repository owner`,
          path: ['proofLines', index, 'kind'],
        });
      }
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
      'Portable skills, agents, loops, and runtime tooling that work across coding assistants — plus machine provisioning and a persistent workspace, as three separate projects.',
    memberIds: ['agent-toolkit', 'agentic-workstation', 'agentic-harness'],
  },
  {
    id: 'hornero',
    title: 'Hornero Linux Desktop',
    path: '/dotfiles',
    proposition:
      'A Wayland desktop built around Hyprland and Quickshell — HorneroConfig, the long-running personal configuration, and Hornero OS, the early Arch-based OS extracted from it.',
    memberIds: ['horneroconfig', 'hornero-os'],
  },
  {
    id: 'v-ecosystem',
    title: 'V Ecosystem',
    path: '/v',
    proposition:
      'Scientific computing, tensors and autograd, reactive streams, and CI tooling for the V programming language — plus contributions to the compiler itself.',
    memberIds: ['v', 'vsl', 'vtl', 'rxv', 'setup-v', 'awesome-v'],
  },
  {
    id: 'create-awesome',
    title: 'Create Awesome',
    path: '/create-awesome',
    proposition:
      'Application scaffolding for Node.js, Python, V, and Rust: pick a template, add extensions, and start from a project that already builds, lints, and tests.',
    memberIds: ['create-node-app', 'create-python-app', 'create-vlang-app', 'create-rust-app'],
  },
];

/**
 * Raw portfolio entry definitions — parsed through `portfolioEntrySchema` on
 * export (see `portfolioEntries` below) so schema defaults apply.
 */
const rawPortfolioEntries = [
  // --- Agentic Developer Stack ---
  {
    id: 'agent-toolkit',
    title: 'Agent Toolkit',
    path: '/agent-toolkit',
    area: 'agentic',
    tier: 'flagship-component',
    roleLabel: 'Creator and maintainer',
    responsibility: 'author-owner',
    repositoryOwner: 'ulises-jeremias',
    repositorySlug: 'agent-toolkit',
    timeLens: 'current',
    relationship: 'component-product',
    description:
      'Portable skills, agents, loops, and MCP templates for many coding assistants, plus the native CLI, local API, and desktop app that run them.',
    channels: ['GitHub Releases', 'npm', 'PyPI', 'AUR', 'Homebrew tap', 'Plugin marketplaces'],
    maturity: 'active',
    proofLines: [
      {
        kind: 'distribution',
        text: 'Distributed through GitHub Releases, npm, PyPI, AUR, a Homebrew tap, and Claude Code / Cursor plugin marketplaces.',
      },
      {
        kind: 'channel-freshness',
        text: 'GitHub Releases, npm, PyPI, and AUR ship v1.35.0; the Homebrew tap trails behind.',
        verifiedAt: '2026-09-30',
      },
    ],
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
    roleLabel: 'Creator and maintainer',
    responsibility: 'author-owner',
    repositoryOwner: 'ulises-jeremias',
    repositorySlug: 'agentic-workstation',
    timeLens: 'current',
    relationship: 'component-product',
    description: 'Thin machine provisioning and host LLM policy for an AI-native developer workstation.',
    channels: ['chezmoi', 'GitHub Releases'],
    maturity: 'active',
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
    roleLabel: 'Creator and maintainer',
    responsibility: 'author-owner',
    repositoryOwner: 'ulises-jeremias',
    repositorySlug: 'agentic-harness',
    timeLens: 'current',
    relationship: 'component-product',
    description:
      'Persistent workspace scaffold for knowledge, personas, packs, and run history, powered by Agent Toolkit.',
    channels: ['GitHub'],
    maturity: 'early',
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
    roleLabel: 'Creator',
    responsibility: 'author-owner',
    repositoryOwner: 'ulises-jeremias',
    repositorySlug: 'agentic-workstation-demo',
    timeLens: 'current',
    relationship: 'supporting-demo',
    description:
      'Small demo repository showing AGENTS.md routing work to skills and sub-agents (plan, implement, review).',
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
    area: 'hornero',
    tier: 'flagship-component',
    roleLabel: 'Creator and maintainer',
    responsibility: 'author-owner',
    repositoryOwner: 'ulises-jeremias',
    repositorySlug: 'dotfiles',
    timeLens: 'current-and-proven',
    relationship: 'parent-family',
    description:
      'A chezmoi-managed Hyprland desktop with 14 appearance themes and a wallpaper-driven Smart Colors pipeline — the personal layer on top of Hornero components.',
    channels: ['GitHub', 'chezmoi'],
    maturity: 'established',
    proofLines: [
      {
        kind: 'history',
        text: 'A long-running personal dotfiles framework, reworked from X11 to Hyprland and Quickshell in 2026.',
      },
      {
        kind: 'maintenance',
        text: 'Shell and system commands now come from Hornero OS components (horneroctl); the repository keeps personal overrides.',
        verifiedAt: '2026-09-30',
      },
    ],
    evidence: {
      sourceUrl: 'https://github.com/ulises-jeremias/dotfiles',
      sourceType: 'editorial',
    },
    homepageEligible: true,
  },

  {
    id: 'hornero-os',
    title: 'Hornero OS',
    path: '/hornero-os',
    area: 'hornero',
    tier: 'flagship-component',
    roleLabel: 'Creator and maintainer',
    responsibility: 'author-owner',
    repositoryOwner: 'HorneroOS',
    repositorySlug: 'hornero',
    timeLens: 'current',
    relationship: 'component-product',
    description:
      'An early-stage Arch-based Wayland desktop OS composed from separate shell, config, CLI, and greeter repositories. Development previews only — not installable yet.',
    channels: ['GitHub pre-releases', 'AUR (components)'],
    maturity: 'preview',
    proofLines: [
      {
        kind: 'release',
        text: 'Composition preview v0.2.0-preview12 pins the shell and config and passes a VM smoke test; it ships no installable image.',
        verifiedAt: '2026-09-30',
      },
      {
        kind: 'history',
        text: 'Extracted from HorneroConfig in 2026 and developed in the open across eight repositories.',
      },
    ],
    evidence: {
      sourceUrl: 'https://github.com/HorneroOS/hornero',
      sourceType: 'repository-metadata',
      sourceRevision: '36c2c4b',
      verifiedAt: '2026-09-30',
    },
    homepageEligible: false,
  },

  // --- V Ecosystem ---
  {
    id: 'v',
    title: 'V',
    path: '/v#v',
    area: 'v-ecosystem',
    tier: 'flagship-component',
    roleLabel: 'Organization member and compiler contributor',
    responsibility: 'org-member-work',
    repositoryOwner: 'vlang',
    repositorySlug: 'v',
    timeLens: 'proven',
    relationship: 'external-ecosystem',
    description:
      'Simple, fast, compiled language. Contributions to the compiler, standard library, tooling, and docs since 2019.',
    channels: [],
    externalContext: 'vlang organization project — external scale is context, not personal ownership',
    proofLines: [
      {
        kind: 'ecosystem-scale',
        text: 'vlang organization project — scale belongs to the ecosystem, not to personal ownership.',
      },
      {
        kind: 'role',
        text: 'Public vlang organization member with 34 merged pull requests to the compiler repository (2019–2026).',
        verifiedAt: '2026-09-30',
      },
    ],
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
    roleLabel: 'Creator and lead maintainer',
    responsibility: 'primary-maintainer',
    repositoryOwner: 'vlang',
    repositorySlug: 'vsl',
    timeLens: 'current-and-proven',
    relationship: 'component-product',
    description:
      'V Scientific Library — linear algebra, BLAS/LAPACK bindings, FFT, ML primitives, plotting, and MPI, with optional OpenCL, CUDA, and Vulkan backends.',
    channels: ['VPM'],
    proofLines: [
      {
        kind: 'history',
        text: 'Started by Ulises in 2019 and led by him since; hosted by the vlang organization.',
      },
    ],
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
    roleLabel: 'Lead maintainer',
    responsibility: 'primary-maintainer',
    repositoryOwner: 'vlang',
    repositorySlug: 'vtl',
    timeLens: 'current',
    relationship: 'component-product',
    description:
      'V Tensor Library — tensors, reverse-mode autograd, and neural-network modules built on VSL. Beta releases.',
    proofLines: [
      {
        kind: 'history',
        text: 'Primary author since the repository was created under the vlang organization in 2020.',
      },
    ],
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
    roleLabel: 'Author and maintainer',
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
    roleLabel: 'Creator and code owner',
    responsibility: 'primary-maintainer',
    repositoryOwner: 'vlang',
    repositorySlug: 'setup-v',
    timeLens: 'proven',
    relationship: 'component-product',
    description: 'GitHub Action that installs V in CI, with version pinning, caching, and architecture detection.',
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
    roleLabel: 'Contributor',
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
    roleLabel: 'Author',
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
    roleLabel: 'Creator and maintainer',
    responsibility: 'author-owner',
    repositoryOwner: 'Create-Node-App',
    repositorySlug: 'create-node-app',
    timeLens: 'current-and-proven',
    relationship: 'component-product',
    maturity: 'established',
    description: 'Mature Node.js scaffolding — 10 templates and 56 extensions from a community template bank.',
    channels: ['npm', 'AUR', 'Homebrew', 'Docker Hub'],
    proofLines: [
      {
        kind: 'history',
        text: 'The mature family member — maintained since 2020 with npm distribution.',
      },
      {
        kind: 'channel-freshness',
        text: 'npm, AUR, Homebrew, and Docker Hub all ship v0.17.2.',
        verifiedAt: '2026-09-30',
      },
    ],
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
    roleLabel: 'Creator and maintainer',
    responsibility: 'author-owner',
    repositoryOwner: 'Create-Python-App',
    repositorySlug: 'create-python-app',
    timeLens: 'current',
    relationship: 'component-product',
    description: 'Python scaffolding — 9 templates and 29 extensions, released on PyPI (0.3.x).',
    channels: ['PyPI', 'Homebrew', 'AUR', 'Docker Hub'],
    maturity: 'early',
    proofLines: [
      {
        kind: 'history',
        text: 'Newer family member with PyPI, Homebrew, AUR, and Docker Hub channels released together.',
      },
    ],
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
    roleLabel: 'Creator and maintainer',
    responsibility: 'author-owner',
    repositoryOwner: 'Create-Vlang-App',
    repositorySlug: 'create-vlang-app',
    timeLens: 'current',
    relationship: 'component-product',
    description: 'V scaffolding — 7 templates and 14 add-ons, shipped as native binaries (0.2.x).',
    channels: ['GitHub Releases', 'install.sh', 'AUR', 'Homebrew', 'Docker Hub'],
    maturity: 'early',
    proofLines: [
      {
        kind: 'history',
        text: 'Newer family expansion — early shipped release.',
      },
    ],
    evidence: {
      sourceUrl: 'https://github.com/Create-Vlang-App/create-vlang-app',
      sourceType: 'editorial',
    },
    homepageEligible: false,
  },
  {
    id: 'create-rust-app',
    title: 'Create Awesome Rust App',
    path: '/create-awesome#rust',
    area: 'create-awesome',
    tier: 'flagship-component',
    roleLabel: 'Creator and maintainer',
    responsibility: 'author-owner',
    repositoryOwner: 'Create-Rust-App',
    repositorySlug: 'create-rust-app',
    timeLens: 'current',
    relationship: 'component-product',
    description: 'Rust scaffolding — 6 templates and 18 extensions, shipped as native binaries (0.4.0).',
    channels: ['GitHub Releases', 'install.sh', 'crates.io', 'AUR', 'Homebrew'],
    maturity: 'early',
    proofLines: [
      {
        kind: 'history',
        text: 'Newest family expansion — early shipped release.',
      },
    ],
    evidence: {
      sourceUrl: 'https://github.com/Create-Rust-App/create-rust-app',
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
    roleLabel: 'Maintainer',
    responsibility: 'maintainer',
    repositoryOwner: 'ulises-jeremias',
    repositorySlug: 'recoil-devtools',
    timeLens: 'proven',
    relationship: 'component-product',
    description:
      'Maintained DevTools for existing Recoil applications. Upstream Recoil is archived; this tool remains maintained for compatibility.',
    channels: ['npm'],
    proofLines: [
      {
        kind: 'release',
        text: 'Published v1.2.3 with current npm packages and a live demo.',
        verifiedAt: '2026-09-30',
      },
      {
        kind: 'maintenance',
        text: 'Independently maintained for existing Recoil applications while upstream Recoil is archived.',
        verifiedAt: '2026-09-30',
      },
    ],
    evidence: {
      sourceUrl: 'https://github.com/ulises-jeremias/recoil-devtools',
      sourceType: 'repository-metadata',
    },
    homepageEligible: false,
  },
];

/**
 * Parsed portfolio entries — schema defaults (e.g. proofLines: []) are applied
 * at import time so consumers never see missing optional fields.
 */
export const portfolioEntries: PortfolioEntry[] = rawPortfolioEntries.map((entry, index) => {
  const parsed = portfolioEntrySchema.safeParse(entry);
  if (!parsed.success) {
    throw new Error(
      `Invalid portfolio entry at index ${index} (${(entry as { id?: string }).id}): ${parsed.error.message}`,
    );
  }
  return parsed.data;
});

// ---------------------------------------------------------------------------
// Boundary (ADR-003, #393)
//
// portfolio.ts answers: "What does Ulises build and how should it be
// interpreted professionally?" It owns flagship areas, tiers,
// responsibility, maturity, proof, and ownership.
//
// project-worlds.ts answers: "How is the Digital Nest exploratory world
// organized?" It owns visual world identity, atlas ordering, immersive
// navigation, themes, and illustrations. Inventory counts inside a
// projectWorlds description are exploration-layer content.
//
// Editorial facts must not be retyped in both places: consumers derive from
// the selectors below.
// ---------------------------------------------------------------------------

/** Contextual (non-volatile) proof kinds acceptable for homepage summaries. */
const SUMMARY_PROOF_KINDS = new Set(['history', 'distribution', 'role', 'ecosystem-scale', 'release', 'demo']);

export interface HomepagePortfolioArea {
  id: string;
  title: string;
  /** Overview route when one exists (Agentic), else the area's canonical path. */
  path: string;
  proposition: string;
  /** Derived from member timeLens — not hand-maintained. */
  lens: 'Building now' | 'Proven over time' | 'Building now · Proven over time';
  /** Member titles when the area has more than one flagship component. */
  members?: string;
  /** Flagship-component members with their routes (always present). */
  memberLinks: Array<{ title: string; path: string; maturity?: PortfolioMaturity }>;
  /** Contextual proof summary from member proofLines (non-volatile kinds). */
  proof?: string;
}

/**
 * Homepage view model for the four flagship areas. Canonical editorial facts
 * (title, path, proposition, lens, members, proof) come from the taxonomy;
 * purely visual concerns (accent, island art) stay in the consuming feature.
 */
export function getHomepagePortfolioAreas(): HomepagePortfolioArea[] {
  return portfolioAreas.map((area) => {
    const members = area.memberIds
      .map((id) => getPortfolioEntryById(id))
      .filter((entry): entry is PortfolioEntry => Boolean(entry));

    const timeLenses = new Set(members.map((entry) => entry.timeLens));
    const hasCurrent = timeLenses.has('current') || timeLenses.has('current-and-proven');
    const hasProven = timeLenses.has('proven') || timeLenses.has('current-and-proven');
    const lens: HomepagePortfolioArea['lens'] =
      hasCurrent && hasProven ? 'Building now · Proven over time' : hasCurrent ? 'Building now' : 'Proven over time';

    const components = members.filter((entry) => entry.tier === 'flagship-component');
    const componentTitles = components.map((entry) => entry.title);
    const memberLinks = components.map((entry) => ({
      title: entry.title,
      path: entry.path,
      ...(entry.maturity ? { maturity: entry.maturity } : {}),
    }));
    const membersLabel = componentTitles.length > 1 ? componentTitles.join(' · ') : undefined;

    const proof = members.flatMap((entry) => entry.proofLines).find((line) => SUMMARY_PROOF_KINDS.has(line.kind))?.text;

    return {
      id: area.id,
      title: area.title,
      path: area.overviewPath ?? area.path,
      proposition: area.proposition,
      lens,
      members: membersLabel,
      memberLinks,
      proof,
    };
  });
}

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

  // Verify internal paths resolve to a registered route (ADR-004: the route
  // registry, not the exploration-layer worlds, is the source of truth).
  for (const entry of portfolioEntries) {
    if (!entry.path.startsWith('/')) continue;
    const routePath = entry.path.split('#')[0] || '/';
    if (!getRouteByPath(routePath)) {
      errors.push(`[${entry.id}] internal path ${entry.path} does not resolve to a known route`);
    }
  }
  for (const area of portfolioAreas) {
    for (const path of [area.path, area.overviewPath].filter((value): value is string => Boolean(value))) {
      if (!getRouteByPath(path)) errors.push(`[${area.id}] area path ${path} is not a registered route`);
    }
  }

  // Hornero OS maturity guard: a preview must never be homepage-eligible or
  // described as installable/downloadable.
  for (const entry of portfolioEntries) {
    if (entry.maturity === 'preview') {
      if (entry.homepageEligible) errors.push(`[${entry.id}] preview entries cannot be homepage-eligible`);
      const text = [entry.description, ...entry.proofLines.map((line) => line.text)].join(' ');
      if (/\b(download the iso|install hornero os|installable today|production[- ]ready)\b/i.test(text)) {
        errors.push(`[${entry.id}] preview copy must not claim installability`);
      }
    }
  }

  return errors;
}
