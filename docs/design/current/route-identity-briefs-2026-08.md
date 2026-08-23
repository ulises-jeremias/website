# Route identity briefs — 2026-08-23

Assessment and per-route design briefs for the route-identity redesign pass.
Authority order is unchanged (see `README.md`); this document records the
evidence-based diagnosis and the approved direction for each route before
implementation.

Baseline: production `https://www.ulises-jeremias.dev` at `main@118a2f34`,
inspected in Chromium at 1440×900, 390×844, and 320×700 on 2026-08-23.
Before-captures for all 11 routes at all three widths were reviewed; CI
`test-results/uiux-review/` remains the maintained capture location.

## Diagnosis

1. **Structural cloning.** Six routes (Dotfiles, Workstation, Toolkit, V,
   Create Awesome, Community) share one scaffold: eyebrow → title → lede →
   SVG diagram → radio/inspector → dock. The diagrams differ; the rhythm,
   framing, and interaction grammar do not.
2. **Duplicated topology.** `ResponsibilityTopology` renders in full on `/`,
   `/agentic-workstation/`, and `/agent-toolkit/`. Only the Workstation route
   is its canonical documented home (`docs/INTERACTIVE_DIAGRAM_SEMANTICS.md`).
3. **Concrete defects.** The Dotfiles `h1` fractures mid-word before its final letter —
   global `overflow-wrap: break-word` breaks the 13-character brand word
   inside its narrow hero column. `/blog/` and `/404.html` are mostly empty
   vertical space. The Open Source constellation is decorative and offers no
   legend for its four contribution kinds. The Create Awesome catalog renders
   as one undifferentiated full-width wall of ~150 rows.
4. **Deflective or generic copy.** "Diagrams teach — essays stay in the
   repos" (V), "Desk clear." (Blog), unexplained metaphors (assembly line,
   plaza, operations room), and interchangeable ledger descriptions.

## Constraints honored

- Synthwave Systems Atlas identity, palette, and anti-pattern list are kept.
- The interactive-diagram contract is preserved unchanged.
- All primary content stays visible (no new disclosures).
- No new dependencies, frameworks, or WebGL.
- Route budget baselines are regenerated only where a documented content
  change justifies it; JS payloads do not grow.
- Open product gates are respected: the accepted homepage hierarchy and the
  empty-Blog navigation entry are **not** changed here.

## Route briefs

### `/` — Home (atlas observatory)

- **Purpose / task:** orient, then route to a project world or contact.
- **Primary CTA:** Explore projects (unchanged — hierarchy is an open gate).
- **Direction:** keep the accepted composition unchanged. The featured-ledger
  descriptions were audited and already read as specific verified outcomes,
  so no home change ships in this pass.
- **Acceptance:** no home diff; snapshots unchanged.

### `/dotfiles/` — Configuration cockpit

- **Metaphor:** layered instrument panel; plum/pink/peach world.
- **Fix:** brand `h1` never fractures (no mid-word break at any width).
- **Direction:** cockpit surface treatment — faint plum grid layered into the
  route background in `src/styles/dotfiles.css`, realizing the texture intent
  declared in `themes/dotfiles.css`; tighter hero rhythm.
- **CTA:** GitHub install (unchanged). **Risks:** none — CSS + copy.
- **Acceptance:** headline intact at 320–1440 px; layer-stack contract tests
  still green.

### `/agentic-workstation/` — Operations room

- **Metaphor:** provisioning control surface; canonical home of the
  responsibility topology (kept).
- **Direction:** thin-rule operations surface applied at the system-map
  component root; boot sequence, profiles, and health console keep their
  established cadence.
- **Acceptance:** diagram-contract tests and CLS test green.

### `/agent-toolkit/` — Orchestration console

- **Direction:** remove the third full `ResponsibilityTopology` copy; replace
  with a compact ecosystem-context strip linking to the canonical topology on
  the Workstation route. The route keeps its own identity: capability nexus,
  queue-vs-swarm, swarm control room, install console.
- **Acceptance:** nexus contract tests green; route gets shorter, not longer.

### `/v/` — Computational laboratory

- **Direction:** replace the deflective lede; add a visible, no-JS station
  index with the verified role per station so the route teaches before any
  interaction. The index hides once the enhanced station selector is ready.
- **CTA:** per-station repository links. **Risk:** V source-fidelity tests
  assert stage indices and panel visibility — additions only, no removals.

### `/create-awesome/` — Builder pipeline

- **Direction:** keep every catalog entry visible but recompose the wall:
  per-group headers with visible counts and a denser entry grid (two columns
  at desktop, three at wide desktop) so tiers scan instead of scroll.
- **Acceptance:** family-history interaction tests green; no content hidden.

### `/community/` — Shared workshop

- **Direction:** one-sentence explanation of the plaza metaphor and cluster
  taxonomy at the top; warm pegboard-grid surface applied at the plaza
  component root; Discord CTA remains primary.

### `/blog/` — Editorial masthead

- **Direction:** honest editorial empty state — a masthead with rule lines,
  what will be published here, RSS as an explicit subscribe action, and
  destinations that already carry writing today. No fake posts, no
  "coming soon" dates. Navigation entry unchanged (open product gate).
- **Acceptance:** page reads as an intentional publication, not a gap.

### `/projects/` — Case-study archive

- **Direction:** explain the "world" tier in the ledger intro; per-group
  one-line framing so groups read as chapters, not filter buckets.

### `/open-source/` — Provenance ledger

- **Direction:** give the constellation a visible legend mapping node styles
  to the four contribution kinds (owned / maintained / organization /
  external) so the figure informs instead of decorates; ledger rows keep
  provenance-first hierarchy.

### `/404.html` — Signal recovery

- **Direction:** fill the dead space with a recovery atlas — the nine world
  links rendered as the primary exploration surface, plain statement of what
  happened first, metaphor second.

## Out of scope (unchanged human gates)

Homepage hierarchy variants, Blog navigation removal, production WebGL,
screen-reader pilots, owner visual sign-off, representative visitor testing.
