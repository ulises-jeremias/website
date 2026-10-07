# Digital Nest route redesign plan

**Date:** 2026-08-24
**Baseline:** `main@b56dbf03`
**Direction:** Synthwave Systems Atlas
**Delivery:** route-specific waves through protected pull requests

> **Amended 2026-08-31:** ADR-003 (`docs/adr/ADR-003-portfolio-first-ia.md`)
> supersedes the flat world priority ordering as the visitor hierarchy and adds
> `/agentic` and `/about` to the route set. All canonical URLs from this plan
> remain preserved. The route-specific wave work described here is complete.

## Intent

The first route-identity pass corrected content, spacing, and obvious density
problems, but six world routes still share the same visual cadence. This pass
changes the composition of every public route while preserving the approved
Digital Nest shell, source-of-truth data, native HTML controls, and static Astro
delivery.

The shell is shared. The page is not. Each route must have one dominant surface
that comes from its subject: a desktop cockpit, a provisioning chassis, a
capability console, a laboratory bench, an assembly line, a workshop plaza, an
editorial desk, an evidence ledger, an archive, a recovery atlas, or the main
observatory.

## Follow-up — 2026-10-06

The `/projects` Work route now leads with its four canonical portfolio areas.
Each area is rendered as a clipped atlas plate with its first-party world art,
role maturity, and direct member links. The more granular Digital Nest route
map follows as a second layer, then the searchable provenance-rich ledger. This
keeps the professional portfolio hierarchy ahead of the exploration taxonomy.
The route stylesheet limit moves one 1 KiB step from 13,312 to 14,336 bytes
for the four responsive art plates. The final measured sheet is 13,628 bytes
(316 bytes above the old limit); total route delivery remains well below its
existing 256,400-byte ceiling. Against the same-day pre-change capture from
`main@28a449e`, desktop delivery moves from 128,274 to 129,386 bytes (+1,112);
mobile moves from 128,274 to 124,296 bytes (−3,978),
with route JavaScript remaining at zero. Mobile image delivery drops from
34,464 to 29,374 bytes as the professional area plates replace the map's
above-the-fold image load. The maintained route performance baseline was
refreshed from the same-day capture.

The Create Awesome workbench now keeps its generated command beside the runtime
and project choices while templates and addons remain directly below. The
command dock stays visible while configuring addons; narrow phones get a
keyboard-scrollable single-line command. The server-rendered family fallback
remains complete without JavaScript.

The `/v/` hero keeps its verified role and source-backed ownership proof in view
while removing a repeated cross-station ownership note. This reduces evidence
density before the lab bench without moving provenance out of the initial page.

The `/open-source/` constellation now navigates into four matching evidence
groups. Each colored lane is a keyboard-operable jump link, its markers and
record count come from the evidence cache, and the destination group keeps the
same provenance color and count. Native anchors work without client JavaScript
and reserve space for the sticky header on mobile.
The route stays at zero JavaScript and within its existing budgets. Against the
same-day `main@a6fa8e23` capture, `/open-source/` grows from 64,249 to 64,732
bytes in both viewports (+483 bytes: 220 document, 263 stylesheet); image and
font delivery are unchanged. The maintained baseline was refreshed from this
capture.

## Route directions

| Route                   | Dominant surface            | Signature interaction or artifact                       |
| ----------------------- | --------------------------- | ------------------------------------------------------- |
| `/`                     | Atlas observatory           | Connected floating project worlds in the landscape      |
| `/dotfiles/`            | Configuration cockpit       | Wallpaper → palette → desktop consumer pipeline         |
| `/agentic-workstation/` | Provisioning chassis        | Boot stages illuminate the machine responsibilities     |
| `/agent-toolkit/`       | Orchestration console       | Capability families distribute into native profiles     |
| `/v/`                   | Computational laboratory    | Station index selects a distinct instrument             |
| `/create-awesome/`      | Assembly line and workbench | Generated command is the visible output artifact        |
| `/community/`           | Shared workshop plaza       | Neighborhood selection routes participation             |
| `/blog/`                | Technical field journal     | Publication contract and readable writing column        |
| `/projects/`            | Case-study archive          | World pointers transition into an evidence ledger       |
| `/open-source/`         | Provenance ledger           | Four source-backed lanes distinguish contribution kinds |
| `/404.html`             | Signal recovery atlas       | Canonical world directory is the recovery action        |

## Waves

### A — Personal DX

Redesign Dotfiles, Agentic Workstation, and Agent Toolkit without changing the
homepage. The routes receive different outer compositions, stronger subject
framing, and explicit surface treatments at their active feature roots.

### B — Technical ecosystems

Redesign V and Create Awesome around a laboratory bench and a real assembly-line
workbench. Preserve hashes, static station indexes, compatibility data, and
no-JavaScript content.

The Create Awesome route places its live template + addon composer immediately
after the hero so the generated project command is the primary interactive
experience. The assembly line remains as the supporting family map, and its
native runtime selector stays with the composer while remaining synchronized
with the family stations. Runtime commands are labeled as project creation or
CLI installation according to what they actually do. Provenance and catalog
totals follow the composer as supporting family evidence.

### C — Workshop and editorial

Redesign Community and Blog so their visual language no longer resembles a
technical stage. Keep contribution routing, RSS, empty-state honesty, and
privacy language intact.

### D — Archive and recovery

Redesign Projects, Open Source, and 404 around archive reading, provenance, and
fast recovery rather than generic cards or atmospheric voids.

### E — Observatory closure

Revisit Home after the other worlds are distinct. Preserve the project-first
orientation and use the final route set to tune the atlas connections, world
labels, and responsive landscape without turning the homepage into a directory.

## Constraints

- Keep `SectionLayout`, `BaseLayout`, `SiteHeader`, `MobileNav`, and `SiteFooter`.
- Keep Astro static output, CSS, SVG, and small route-local scripts.
- Do not add React, animation frameworks, WebGL, fake telemetry, or unverified facts.
- Preserve `docs/INTERACTIVE_DIAGRAM_SEMANTICS.md` for informative/decorative SVGs.
- Preserve native controls, no-JavaScript fallbacks, reduced-motion behavior,
  focus visibility, and 320px reflow.
- Use existing tokens for semantic UI chrome; keep literal SVG colors only when
  they are part of an intentional illustration palette.
- Do not update maintained screenshots blindly. Capture the changed routes,
  inspect the rendered composition, then update only the approved route goldens.

## Evidence contract

Each wave records:

- changed route and feature roots;
- desktop `1440px` and mobile `390px` captures;
- route smoke, semantic, reduced-motion, and reflow results;
- `pnpm test`, `pnpm build`, `pnpm performance:check`, and Lighthouse status;
- any route-budget delta with its reason.

The repository owner has explicitly authorized implementation of this redesign.
The remaining manual assistive-technology and visual sign-off records are not a
stop condition for this engineering pass, but the implementation must not claim
those human validations were performed.

## VTL motion pass — 2026-10-06

The VTL station now teaches one symbolic multiplication graph (`y = x × w`,
`L = y`) through a user-triggered forward value pass and reverse gradient pass.
The signal follows the recorded-gate topology; the caption makes clear that
this is an illustrative graph rather than a trace from a running model.
Desktop animates SVG paths with the Web Animations API. Mobile uses its own
vertical stage composition because the lab intentionally suppresses dense SVG
diagrams at narrow widths. Reduced-motion mode selects a static path, and the
server-rendered page includes both directions without requiring JavaScript.
The `/v/` document ceiling is raised one 1 KiB step to 17 KiB for the semantic
SVG explanation and its mobile-only sequence; the complete route remains below
its existing total budget, and the trace JavaScript is budgeted separately at
2 KiB.

## Harness session lifecycle trace — 2026-10-06

The Agentic Harness hero now lets visitors end and restart an illustrative
coding session. The temporary session and its runtime link animate away or
return, while the knowledge, personas, projects, and Toolkit runtime remain
visibly present. The single native button keeps keyboard focus as its action
label changes; a concise status message reports the new state. The caption
clarifies that this is an explanatory model, not a live agent session.

The server-rendered diagram remains complete without JavaScript, and controls
appear only after their script is ready. Reduced-motion mode changes the same
states without playing autonomous or user-triggered movement. The focused
browser spec checks both animated transitions, the persistent nodes, mobile
reflow, reduced motion, and no-JavaScript output; its desktop and mobile
captures record the active and ended-session states. The separate Vite asset
is forced out of its inline data URL, so route delivery measures the interaction
as JavaScript: 889 gzipped bytes. Harness remains at 120,565 bytes total against
its existing 127,278-byte route ceiling. Its script budget is now 1 KiB, and the
CSS budget moves one 1 KiB step to 14 KiB for the control, focus, reduced-motion,
and forced-colors states; the measured stylesheet is 13,570 bytes.

## Create Awesome atlas art — 2026-10-06

The Create Awesome world now uses an assembly-workshop island across the home
atlas, featured portfolio portal, Work map, and social card. Cyan template
modules and magenta add-ons feed a completed orange application artifact, so
the art communicates the project's composition model at a glance. The source is
first-party image-generation output, recorded with its reference and repeatable
responsive asset pipeline in `docs/design/current/social-assets.md`. Its 640px
WebP is 45 KiB, the 440px WebP is 24 KiB, and the 192px thumbnail is 5.9 KiB.

The compact V provenance changes VTL capture bounds slightly in Chromium, and
CI/local renderers vary mobile scene height by one or two pixels due to text
metrics. The desktop golden remains; mobile coverage asserts the vertical flow,
input/output equations, reverse-gradient values, and zero autonomous movement
before and after interaction. The focused mobile smoke suite checks route reflow.

## About reading-path motion — 2026-10-06

The About story now traces the active systems-builder station through its
five-stage map. As the reader moves through the story, a restrained color path
extends to the current waypoint; the station's diamond and heading transition
into the active state. This is reading-position feedback, not an autonomous
timeline or a claim that the projects depended on one another. At mobile widths,
the active station marker carries the feedback alongside the text because the
map is intentionally not pinned over the reading area.

The full story and map remain static HTML and work without JavaScript. Reduced
motion removes the transitions while keeping the current stage and progress
state. Desktop and mobile active-station captures cover the changed composition;
the focused browser spec checks forward and reverse progress, real transition
timing, 320px reflow, reduced motion, forced colors, and the no-JavaScript path.
The `/about/` baseline moves from 66,802 to 67,056 bytes (+254: 114 document
and 140 stylesheet), with no new image, request, or external script payload;
the route remains below its existing budget.

## Atlas landing platforms — 2026-10-06

Each atlas island now docks over a shallow, clipped hexagonal platform whose
grid and beacon use that world's semantic accent. This replaces the generic
elliptical orbital ring with a constructed landing surface, making the
floating-world metaphor clearer while keeping each existing first-party island
illustration in focus. The platform is CSS-only, uses no new image or script,
and keeps its slow rotation disabled under reduced motion. Desktop and mobile
Create Awesome captures record the updated atlas surface.

## VSL frequency instrument — 2026-10-07

The VSL station replaces its static matrix-to-plot beat with an interactive
signal analyzer. A fundamental-frequency control recomputes a deterministic
64-sample signal and its direct DFT in the browser, and a user-triggered trace
follows the signal into the resulting bins. The interface labels this as a
browser-side math model and does not imply that VSL itself runs in the page.
The complete initial plot remains static HTML/SVG for no-JavaScript users;
reduced-motion skips autonomous movement and renders the completed state
immediately. On narrow screens the plot keeps readable annotation in an
internally scrollable viewport, with a visible scroll cue and keyboard access.
The browser interaction is a standalone first-party asset so executable code
does not inflate the route's HTML document payload.

The mobile V laboratory previously hid every station SVG below 620px. That rule
now excludes the VSL analyzer so this station's primary instrument remains
visible while the compact fallback behavior for other legacy diagrams stays
unchanged. Focused browser coverage checks frequency changes, animated and
reduced-motion runs, 320px reflow, no-JavaScript fallback, and desktop/mobile
visual baselines.

The measured `/v/` route increases from 152,066 to 156,534 bytes (+4,468): the
HTML document grows 1,599 bytes for the controls and instrument, the route's
script payload grows 2,084 bytes for the DFT interaction, styles grow 785 bytes,
and one first-party script request is added. The overall route remains 20,697
bytes below its existing 177,231-byte ceiling. To retain a clear margin around
the new measured payload, the route ceilings move to 19,456 document bytes,
4,096 script bytes, 17,408 stylesheet bytes, and 15 requests. Other route
limits remain unchanged; the baseline records the exact mobile and desktop
measurements.

## Hornero OS manifest assembly — 2026-10-07

The real manifest rows now read as shallow, extruded component plates: pinned
shell and defaults use the reusable cyan pin, the locally built CLI uses the
Hornero amber, and the installer/ISO reservations stay hatched and visibly
empty. The existing user-triggered trace now docks each row with a precise
Web Animations API tilt-and-settle sequence. It never starts without input or
implies an installer/ISO exists; the live status announces the exact source
state. The information remains complete in server HTML, the control appears
only after the external route script is ready, and reduced motion resolves the
same action immediately to the completed static composition. Desktop and
mobile assembled-state captures are maintained in the focused Playwright
goldens; a 320px forced-colors golden and assertions verify reflow, keyboard
activation, and the visible system focus outline.

Moving the interaction out of inline HTML puts it under an explicit script
budget and saves document bytes. Before: mobile and desktop 105,710 / 134,702
total bytes, 11,256 document, 0 script, 13,937 stylesheet, and 12 requests.
After: 106,492 / 135,484 total bytes, 10,716 document, 1,040 script, 14,219
stylesheet, and 13 requests. The route remains within its existing total,
document, style, image, font, and request limits. Its script budget is 2 KiB to
cover the measured 1,040-byte asset with 1 KiB headroom; only `/hornero-os/`
uses this additional route-local JavaScript.

## Community workshop signal map — 2026-10-07

The `/community/` plaza now reads as a small shared fabrication floor instead
of a set of floating rounded boxes. Five clipped, isometric project benches
connect to one Discord signal hub; each bench uses a subject-specific glyph,
and the floor label explains the real participation path from conversation to
project work to a durable GitHub trail. Selecting a project station illuminates
its neighborhood and sends a brief Web Animations API pulse along the matching
connector. This is user-triggered explanatory motion, not live activity.

Mobile uses a separate vertical circuit composition so station labels retain
their shape and reading order. The route keeps its complete static station
index and no-JavaScript behavior. Reduced-motion mode preserves the selected
route highlight and skips the traveling pulse. The browser checks cover the
static fallback, keyboard activation, animated desktop/mobile routes, reduced
motion, and 320px reflow.

The route grows from 92,253 to 94,385 compressed bytes (+2,132): the semantic
document adds 1,295 bytes and route styles add 837 bytes. The existing 3,802-byte
image payload, 62,740-byte font payload, zero script requests, and 10 total
requests are unchanged. The `/community/` document, stylesheet, and total caps
now use the repository's 10% rounded-up KiB headroom policy for this intentionally
dual-composition map; every other route limit is unchanged.

## Create Awesome package assembly — 2026-10-07

The line now carries a real project parcel instead of a single glowing dot.
Runtime selection sets its family accent and label; the chosen template docks
into its chassis, compatible addons attach as magenta modules, and the finished
composition reaches the app station. Web Animations API motion gives each
station a short arrival pulse while the parcel travels the line. Only actual
user composition changes start the sequence; it is never autoplay telemetry.

The parcel and the visible stage index share the same runtime → template →
addons → app state. On narrow layouts the stage index replaces the horizontal
line. When reduced motion is preferred, the selected configuration appears as
a complete, still assembled parcel with the app stage selected; the four-stage
explanation and generated command remain visible. Without JavaScript, the
server-rendered family index and base commands remain complete.

## V lab selection signal — 2026-10-07

Selecting VSL, VTL, or RxV now lights its matching station in the ecosystem
map. The enlarged node and its short connector pulse reinforce which area is
open while the station selector and live status continue to carry the readable
selection. Compiler, CI, and catalog stations do not illuminate unrelated map
areas. Reduced-motion mode keeps the selected node visibly distinct without
transitions, and the map's caption still states that grouping lines are not
dependency edges.

## Homepage featured-world portals — 2026-10-07

The four professional portfolio areas now read as distinct, clipped system
portals rather than rounded sibling cards. Their small atlas islands sit over
route-specific instrument traces: capability handoffs, desktop layers, a
computational waveform, and a template-to-application line. Hover or keyboard
focus activates a short, subject-specific animation; the motion never runs on
its own. At narrow widths the art and copy form a compact side-by-side route
entry, and every primary/member link keeps a touch-sized target. Reduced-motion
mode retains the art, selected focus, and contrast response without movement.
