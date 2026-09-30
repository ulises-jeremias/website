import { z } from 'astro/zod';
import sponsorMetricsSnapshot from './generated/sponsor-metrics.json';
import { getPortfolioAreaById, portfolioAreaSchema } from './portfolio.js';
import { profile } from './profile.js';

// ---------------------------------------------------------------------------
// Sponsorship & partnership model — ADR-004
//
// Single source of truth for everything the /sponsor route and the site-wide
// support surfaces say about sponsorship. Pages compose this data; they never
// retype commercial wording.
//
// Integrity rules encoded here (and asserted in sponsorship.test.ts):
// - No sponsor, partner, logo, or testimonial exists unless it is a real,
//   confirmed relationship. The `sponsors` list starts empty on purpose.
// - Every sponsor entry must carry disclosure text and a relationship type.
// - Compensated outbound sponsor links render with rel="sponsored".
// - No public price tiers: individual support goes through GitHub Sponsors;
//   project and commercial partnerships start as a conversation.
// - Adoption metrics come only from the dated generated snapshot, each with a
//   unit, period, source, and caveat. Downloads are never presented as users.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Areas — what support can be attached to
// ---------------------------------------------------------------------------

export const sponsorshipAreaSchema = z.object({
  /** Portfolio area this sponsorship area maps to (reuses the ADR-003/004 taxonomy). */
  id: portfolioAreaSchema,
  title: z.string().min(1),
  /** Short, concrete description of the body of work. */
  summary: z.string().min(1),
  /** Project names inside the area, as they appear on the site. */
  projects: z.array(z.string().min(1)).min(1),
  /** Scoping note — maturity or ownership caveats a sponsor must read. */
  scope: z.string().min(1).optional(),
  /** Two or three short labels for where support goes (hero routing table). */
  focus: z.array(z.string().min(1).max(24)).min(2).max(3),
  /** Concrete work that support would fund or enable. */
  supportEnables: z.array(z.string().min(1)).min(3),
  /** Category-level partner fit. Never company names. */
  partnerFit: z.array(z.string().min(1)).min(2),
  /** Internal route that explains the work in depth. */
  href: z.string().startsWith('/'),
  /** One-sentence contextual invitation shown quietly on the area's project pages. */
  invitation: z.string().min(1).max(160),
});
export type SponsorshipArea = z.infer<typeof sponsorshipAreaSchema>;

// ---------------------------------------------------------------------------
// Modes — ways to support (no prices)
// ---------------------------------------------------------------------------

export const sponsorshipModeSchema = z.object({
  id: z.enum(['supporter', 'project', 'integration', 'infrastructure', 'hardware', 'community']),
  title: z.string().min(1),
  description: z.string().min(1),
  examples: z.array(z.string().min(1)).min(2),
  /** Which support path starts this relationship. */
  path: z.enum(['github-sponsors', 'conversation']),
});
export type SponsorshipMode = z.infer<typeof sponsorshipModeSchema>;

// ---------------------------------------------------------------------------
// Sponsors — confirmed relationships only
// ---------------------------------------------------------------------------

export const sponsorRelationshipSchema = z.enum([
  'supporter',
  'project-sponsor',
  'integration-partner',
  'infrastructure-partner',
  'hardware-partner',
  'community-partner',
]);
export type SponsorRelationship = z.infer<typeof sponsorRelationshipSchema>;

export const sponsorSchema = z
  .object({
    name: z.string().min(1),
    url: z
      .string()
      .url()
      .refine((url) => url.startsWith('https://'), 'sponsor URLs must use https'),
    /** Root-relative optimized logo under /public (SVG or WebP, ≤ 24 KiB). */
    logo: z
      .string()
      .regex(/^\/assets\/sponsors\/[a-z0-9-]+\.(svg|webp)$/)
      .optional(),
    /** Accessible alt text; required whenever a logo is shown. */
    logoAlt: z.string().min(1).optional(),
    relationship: sponsorRelationshipSchema,
    /** Portfolio areas the relationship supports. */
    areas: z.array(portfolioAreaSchema).min(1),
    startDate: z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/),
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}(-\d{2})?$/)
      .optional(),
    /** Plain-language disclosure shown next to the sponsor. */
    disclosure: z.string().min(20),
    /** Whether the relationship involves payment or material support (drives rel="sponsored"). */
    compensated: z.boolean(),
    active: z.boolean(),
  })
  .superRefine((value, ctx) => {
    if (value.logo && !value.logoAlt) {
      ctx.addIssue({ code: 'custom', message: 'logo requires logoAlt', path: ['logoAlt'] });
    }
    if (value.active && value.endDate) {
      ctx.addIssue({ code: 'custom', message: 'active sponsors cannot have an endDate', path: ['endDate'] });
    }
    if (value.endDate && value.endDate < value.startDate) {
      ctx.addIssue({ code: 'custom', message: 'endDate must not precede startDate', path: ['endDate'] });
    }
    if (new Set(value.areas).size !== value.areas.length) {
      ctx.addIssue({ code: 'custom', message: 'areas must be unique', path: ['areas'] });
    }
  });
export type Sponsor = z.infer<typeof sponsorSchema>;

// ---------------------------------------------------------------------------
// Metrics — dated, sourced, caveated snapshot (never fetched at runtime)
// ---------------------------------------------------------------------------

const PEOPLE_PATTERN = /\busers?\b|\binstalls?\b|\bpeople\b/i;

export const sponsorMetricSchema = z.object({
  id: z.string().min(1),
  /** Project the metric belongs to (display name). */
  project: z.string().min(1),
  label: z
    .string()
    .min(1)
    .refine((label) => !PEOPLE_PATTERN.test(label), 'labels must not imply people or installs'),
  value: z.number().int().nonnegative(),
  /** Unit wording — e.g. "package downloads". Never "users". */
  unit: z
    .string()
    .min(1)
    .refine((unit) => !PEOPLE_PATTERN.test(unit), 'units must not imply people or installs'),
  period: z.object({
    start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  }),
  /** Day this metric was last fetched; last-known-good values keep their original date. */
  retrievedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  source: z.object({ name: z.string().min(1), url: z.string().url().startsWith('https://') }),
  caveat: z.string().min(20),
});
export type SponsorMetric = z.infer<typeof sponsorMetricSchema>;

export const sponsorMetricsSnapshotSchema = z.object({
  generatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}T/),
  generator: z.string().min(1),
  metrics: z.array(sponsorMetricSchema),
});
export type SponsorMetricsSnapshot = z.infer<typeof sponsorMetricsSnapshotSchema>;

export const sponsorMetrics: SponsorMetricsSnapshot = sponsorMetricsSnapshotSchema.parse(sponsorMetricsSnapshot);

/** Oldest per-metric retrieval date — what the page may honestly call "as of". */
export function getMetricsAsOf(snapshot: SponsorMetricsSnapshot = sponsorMetrics): string | undefined {
  return snapshot.metrics.map((metric) => metric.retrievedAt).sort()[0];
}

// ---------------------------------------------------------------------------
// Canonical data
// ---------------------------------------------------------------------------

export const GITHUB_SPONSORS_URL = profile.links.sponsors;

/** Relationship-specific contact starter. Uses the canonical profile email. */
export function getPartnershipMailto(subject = 'Open-source partnership'): string {
  return `mailto:${profile.contact.email}?subject=${encodeURIComponent(subject)}`;
}

/**
 * What support pays for. Concrete maintenance work, not a pitch. None of these
 * projects depend on sponsorship to exist — support decides how much time and
 * hardware they get.
 */
export const supportUses: Array<{ id: string; title: string; detail: string }> = [
  {
    id: 'maintenance',
    title: 'Maintenance and releases',
    detail: 'Triage, dependency updates, security fixes, and release work across the active repositories.',
  },
  {
    id: 'compatibility',
    title: 'Compatibility testing',
    detail: 'Keeping skills, templates, and desktops working as assistants, runtimes, and Linux packages move.',
  },
  {
    id: 'hardware',
    title: 'Hardware and CI',
    detail: 'Test devices for the Linux desktop work, plus CI minutes and release infrastructure.',
  },
  {
    id: 'packaging',
    title: 'Packaging and distribution',
    detail: 'npm, PyPI, AUR, Homebrew, container, and binary channels that stay in sync with releases.',
  },
  {
    id: 'docs',
    title: 'Documentation',
    detail: 'Install guides, architecture notes, ADRs, and examples that let people adopt the tools without help.',
  },
  {
    id: 'community',
    title: 'Community time',
    detail: 'Reviewing contributions, answering questions, and mentoring first-time contributors.',
  },
];

export const sponsorshipPrincipleSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
});
export type SponsorshipPrinciple = z.infer<typeof sponsorshipPrincipleSchema>;

/**
 * Disclosure and independence policy. Part of the site's editorial identity —
 * rendered verbatim on /sponsor#principles and linked from the footer.
 */
export const sponsorshipPrinciples: SponsorshipPrinciple[] = [
  {
    id: 'no-endorsement',
    title: 'Support is not endorsement',
    body: 'Sponsoring a project does not mean I recommend your product, and funding does not change what the projects recommend.',
  },
  {
    id: 'independent-evaluation',
    title: 'Integrations earn their place',
    body: 'An integration, template, or example ships only if it holds up to the same technical review as any other contribution.',
  },
  {
    id: 'disclosure',
    title: 'Paid relationships are disclosed',
    body: 'Paid and material relationships are listed on this page with their scope and dates. Sponsored links are labelled and marked rel="sponsored".',
  },
  {
    id: 'no-hidden-influence',
    title: 'No hidden influence',
    body: 'Sponsors do not review, edit, or veto technical writing, benchmarks, or recommendations.',
  },
  {
    id: 'exclusivity',
    title: 'Nothing exclusive by default',
    body: 'A relationship is exclusive only when that is negotiated explicitly and disclosed.',
  },
  {
    id: 'trust-first',
    title: 'Users come first',
    body: 'If a relationship would compromise the trust of the people using these tools, I will not take it.',
  },
].map((principle) => sponsorshipPrincipleSchema.parse(principle));

const rawAreas: SponsorshipArea[] = [
  {
    id: 'agentic',
    title: 'Agentic Developer Stack',
    summary:
      'Portable skills, agents, loops, and MCP templates for many coding assistants, with a native CLI, local API, and desktop app — plus machine provisioning and a persistent workspace.',
    projects: ['Agent Toolkit', 'Agentic Workstation', 'Agentic Harness'],
    focus: ['assistant compatibility', 'desktop + local API', 'integrations'],
    supportEnables: [
      'Compatibility work as coding assistants change their plugin, skill, and MCP formats',
      'Desktop app and local API development',
      'Provider, observability, and evaluation integrations',
      'Packaging across npm, PyPI, AUR, Homebrew, and plugin marketplaces',
      'Regression testing of skills, loops, and swarm recipes',
    ],
    partnerFit: [
      'Coding-agent and AI IDE teams',
      'Model and API providers',
      'Evaluation and observability platforms',
      'Developer-tool and infrastructure platforms',
    ],
    href: '/agentic',
    invitation:
      'Interested in supporting open-source agent tooling, or in building an integration that users can rely on?',
  },
  {
    id: 'hornero',
    title: 'Hornero Linux Desktop',
    summary:
      'HorneroConfig, a long-running Hyprland and Quickshell desktop configuration, and Hornero OS, an early-stage Arch-based desktop OS extracted from it.',
    projects: ['HorneroConfig', 'Hornero OS'],
    focus: ['hardware testing', 'installer work', 'packaging'],
    scope:
      'Hornero OS is a development preview: there is no installer or ISO yet. Support goes to building it, not to a shipped distribution.',
    supportEnables: [
      'Testing on real laptops and desktops, including ARM devices',
      'A hardware compatibility record for Wayland, Hyprland, and Quickshell',
      'Installer and image work for Hornero OS',
      'Packaging and reproducible configuration',
      'Accessibility and visual polish of the shell',
    ],
    partnerFit: [
      'Linux laptop and desktop vendors',
      'ARM and single-board computer makers',
      'Linux infrastructure and mirror hosts',
    ],
    href: '/hornero-os',
    invitation: 'Hardware loans and Linux compatibility partnerships help Hornero run on more machines.',
  },
  {
    id: 'create-awesome',
    title: 'Create Awesome',
    summary:
      'Scaffolding CLIs for Node.js, Python, and V that compose a template with extensions into a project that already builds, lints, and tests.',
    projects: ['Create Awesome Node App', 'Create Awesome Python App', 'Create Awesome V App'],
    focus: ['platform templates', 'template CI', 'examples'],
    supportEnables: [
      'First-class templates and extensions for real platforms',
      'Keeping every template passing CI as frameworks release',
      'Deploy, database, queue, and observability integrations',
      'Documentation and runnable examples',
    ],
    partnerFit: [
      'Hosting and deployment platforms',
      'Database and queue providers',
      'Observability and email services',
      'Cloud and developer-infrastructure companies',
    ],
    href: '/create-awesome',
    invitation: 'Platform teams can help ship a first-class, tested template or extension for their product.',
  },
  {
    id: 'v-ecosystem',
    title: 'V ecosystem work',
    summary:
      'VSL scientific computing, VTL tensors and autograd, setup-v for CI, and RxV reactive streams — plus contributions to the V compiler.',
    projects: ['VSL', 'VTL', 'setup-v', 'RxV'],
    focus: ['numerics + GPU', 'autograd', 'CI tooling'],
    scope:
      'V, VSL, VTL, and setup-v belong to the vlang organization. Support here funds my maintenance and contribution time — it does not buy anything from the V project.',
    supportEnables: [
      'Numerical correctness, benchmarks, and backend coverage in VSL',
      'GPU backends (CUDA, OpenCL, Vulkan) and autograd work in VTL',
      'CI tooling for V projects through setup-v',
      'Examples and documentation for scientific users',
    ],
    partnerFit: [
      'Scientific-computing groups',
      'Compute and GPU infrastructure providers',
      'CI providers',
      'Accelerator and toolchain vendors',
    ],
    href: '/v',
    invitation:
      'Support my maintenance of VSL, VTL, and setup-v — scoped to my work, not to ownership of the V project.',
  },
];

const rawModes: SponsorshipMode[] = [
  {
    id: 'supporter',
    title: 'Open-source supporter',
    description: 'Recurring or one-time support with no integration or promotion attached.',
    examples: ['Monthly GitHub Sponsors tier', 'One-time contribution'],
    path: 'github-sponsors',
  },
  {
    id: 'project',
    title: 'Project sponsor',
    description: 'Support tied to one project area, disclosed where the project is presented.',
    examples: [
      'Listing on this page',
      'Acknowledgement in a project README or site, where agreed',
      'Funding for a specific milestone',
    ],
    path: 'conversation',
  },
  {
    id: 'integration',
    title: 'Integration partner',
    description:
      'For products that make a project better for its users. The work ships only if it passes normal review.',
    examples: ['Tested integration or extension', 'Template or example project', 'Joint technical documentation'],
    path: 'conversation',
  },
  {
    id: 'infrastructure',
    title: 'Infrastructure partner',
    description: 'Credits or services used directly for open-source development.',
    examples: ['CI minutes and runners', 'Model/API credits for agent testing', 'Hosting, storage, or observability'],
    path: 'conversation',
  },
  {
    id: 'hardware',
    title: 'Hardware partner',
    description: 'Devices donated or loaned for Linux compatibility testing.',
    examples: ['Laptops and desktops for Hornero testing', 'ARM boards', 'Peripherals with Linux driver gaps'],
    path: 'conversation',
  },
  {
    id: 'community',
    title: 'Community partner',
    description: 'Support for the open community around these projects.',
    examples: ['Contributor events and hackathons', 'Workshops on developer tooling', 'Community infrastructure'],
    path: 'conversation',
  },
];

export const sponsorshipAreas: SponsorshipArea[] = rawAreas.map((area) => sponsorshipAreaSchema.parse(area));
export const sponsorshipModes: SponsorshipMode[] = rawModes.map((mode) => sponsorshipModeSchema.parse(mode));

/** Confirmed sponsors and partners. Empty until a real relationship exists — never seeded. */
const rawSponsors: Sponsor[] = [];
export const sponsors: Sponsor[] = rawSponsors.map((sponsor) => sponsorSchema.parse(sponsor));

export function getSponsorshipAreaById(id: SponsorshipArea['id']): SponsorshipArea | undefined {
  return sponsorshipAreas.find((area) => area.id === id);
}

export function getActiveSponsors(): Sponsor[] {
  return sponsors.filter((sponsor) => sponsor.active);
}

/** Ended relationships stay listed for disclosure (ADR-004). */
export function getPastSponsors(): Sponsor[] {
  return sponsors.filter((sponsor) => !sponsor.active);
}

/** rel value for an outbound sponsor link — compensated relationships are marked sponsored. */
export function getSponsorLinkRel(sponsor: Pick<Sponsor, 'compensated'>): string {
  return sponsor.compensated ? 'sponsored noopener noreferrer' : 'noopener noreferrer';
}

export function validateSponsorship(): string[] {
  const errors: string[] = [];
  for (const area of sponsorshipAreas) {
    if (!getPortfolioAreaById(area.id)) errors.push(`[${area.id}] is not a declared portfolio area`);
  }
  return errors;
}
