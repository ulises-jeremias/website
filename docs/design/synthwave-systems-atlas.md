# Synthwave Systems Atlas

## Decision

Ulises approved **Synthwave Systems Atlas** as the final Digital Nest visual
direction on 2026-08-07 in
[`#52`](https://github.com/ulises-jeremias/website/issues/52).

Digital Nest is a navigable retro-futuristic systems universe:

- Ulises is the builder and narrator.
- Digital Nest is the hub.
- Major projects are distinct worlds.
- Connections express verified conceptual or architectural relationships.
- Neon communicates identity, hierarchy, focus, state, and relationships.

This is a dark-first product identity, not a generic neon-on-black AI template,
cyberpunk dashboard, or retro arcade skin.

## References

Priority order:

1. The approved dark synthwave homepage reference supplied by Ulises: chrome
   name, asymmetric identity/atlas composition, striped sunset, landscape,
   connected project worlds, and lower evidence panels.
2. The cleaner synthwave reference supplied with the mission: circular
   organization, sunset orange, technical framing, and CTA treatment.
3. The implementation-oriented standalone HTML supplied with the mission.
4. Repository explorations under `docs/design/art-directions/`, especially:
   - E — synthwave atmosphere and perspective floor;
   - B/D — technical-atlas clarity and relationship diagrams;
   - F — editorial restraint for long-form routes.

The references are conceptual. Generated portraits, metrics, stars, commands,
and tiny copy are not sources of truth.

## Product principles

1. **Real systems before decoration.** Every diagram must make a project,
   capability, flow, or relationship easier to understand.
2. **One universe, different worlds.** The global shell is consistent; each
   route has a composition derived from its subject, not only a new accent.
3. **Static first.** Astro HTML, CSS, and accessible SVG are the default.
4. **Neon is semantic.** Strong glow is reserved for active, connected,
   focused, or selected states.
5. **Evidence over telemetry.** Never invent counts, stars, downloads,
   timelines, or activity.
6. **Mobile is recomposed.** Desktop atlas scatter becomes a connected
   narrative path, not a shrunken diagram or generic card column.
7. **Motion explains or confirms.** Ambient movement is subtle and optional;
   explanatory motion has a static equivalent.

## Palette

### Primitives

```css
--nest-midnight-950: #040212;
--nest-midnight-900: #050317;
--nest-midnight-850: #090428;
--nest-paper: #f7f5ff;
--nest-text-muted: #b9b2d8;
--nest-text-faint: #8f88b4;
--nest-magenta: #ff42d0;
--nest-pink: #ff84f1;
--nest-violet: #a05cff;
--nest-purple: #7358ff;
--nest-blue: #55b9ff;
--nest-cyan: #1cefff;
--nest-sunset-orange: #ff9a4d;
--nest-sunset-pink: #ff658f;
```

Semantic tokens map primitives to background, surface, text, border, link,
focus, primary accent, secondary accent, state, and project-world roles.
Project themes override semantic accents, never global readability tokens.

Body copy uses near-white or muted lavender with WCAG 2.2 AA contrast.
Magenta, cyan, and orange are not long-form body colors.

## Typography

- **Display:** a licensed, optimized geometric/retro face only when it improves
  the identity and remains legible. The name is real HTML text with a restrained
  chrome gradient.
- **Body:** a readable modern sans with a deliberate system fallback.
- **Technical:** a compact monospace for labels, commands, coordinates, and
  diagram annotations.

No font family may be named without being delivered. Self-hosted WOFF2 is
preferred when a webfont is selected; otherwise document the system stack.

The homepage hierarchy is:

1. `ULISES JEREMIAS`
2. `— DIGITAL NEST —`
3. verified positioning
4. focus keywords
5. project-world navigation

## Global shell

One `SiteHeader` and one `SiteFooter` serve every route.

The header contains:

- original Digital Nest mark and identity;
- compact navigation sourced from `src/data/routes.ts`;
- an explicit active-page indicator;
- verified GitHub/contact utilities;
- accessible mobile navigation.

The shell is near-black with a thin boundary. Blur is subtle and optional.
Active, hover, and keyboard-focus states use both shape and color.

## Homepage composition

### Desktop

The first viewport is asymmetric:

```text
identity and positioning  ←→  connected project-world atlas
```

The environment is built from lightweight layers:

- stars and atmospheric haze;
- a striped sunset;
- original mountain and skyline SVG silhouettes;
- a perspective grid that fades before text;
- restrained magenta/cyan horizon light.

The lower transition contains three distinct evidence surfaces:

1. Digital Nest status/current focus;
2. About Ulises;
3. selected project ledger.

No fake browser chrome, portrait, telemetry, or project metric is rendered.

### Mobile

The hero becomes identity → positioning → CTAs → atmosphere → connected world
path. Worlds remain environments on a vertical route with a shared connection
line; they do not become nine interchangeable cards.

## Project-world atlas

The atlas is generated from canonical project-world data:

1. Dotfiles / HorneroConfig
2. Agent Toolkit
3. Agentic Workstation
4. V ecosystem
5. Create Awesome
6. Community
7. Blog
8. Projects
9. Open Source

Each world combines:

- a clipped, polygonal floating platform;
- a small original SVG environment;
- a number, title, and concise verified description;
- a world-specific semantic accent;
- one or more relationships from canonical cross-link data.

The central Digital Nest mark uses woven arcs and an orbital core. It must not
resolve to a generic hexagon.

Hover and keyboard focus share the same behavior: slight lift, brighter border,
illuminated illustration, higher label contrast, and highlighted related paths.
The focused link remains visible without relying on glow.

## SVG language

Use a compact reusable vocabulary:

- thin geometric strokes;
- clipped/isometric platforms;
- duplicate colored strokes instead of expensive blur chains;
- small nodes, junctions, and orbital arcs;
- original silhouettes and project-specific motifs;
- meaningful `<title>`/`<desc>` for informative diagrams;
- `aria-hidden="true"` for decoration.

Avoid giant filters, thousands of nodes, copyrighted artwork, generated
portraits, stock robots, and mascot derivatives without verified permission.

## Motion

Motion belongs to one category:

- **ambient:** world float, star twinkle, core glow, grid luminance;
- **feedback:** navigation underline, button edge sweep, world/path activation;
- **explanation:** Smart Colors, capability distribution, swarm handoffs,
  worktree branching, composer output;
- **transition:** optional native page/world continuity.

Ambient motion stays within roughly 3–7 px and 5–9 second periods. Feedback is
120–240 ms. No bounce, shake, rapid hue cycling, continuous glitch, or high-rate
particles.

`prefers-reduced-motion: reduce` removes movement, travelling particles,
parallax, autoplay loops, and reveal transforms. Static composition remains
complete.

## World adaptations

- **Dotfiles:** plum/pink/peach desktop environment; real screenshots and a
  wallpaper → palette → scheme → app Smart Colors pipeline.
- **Agentic Workstation:** midnight/cyan/violet/lime provisioning sequence and
  a technically accurate Personal DX relationship graph.
- **Agent Toolkit:** capability/distribution graph and complete swarm story;
  most ambitious route, but route-local and progressively enhanced.
- **V:** scientific-computing lab using grids, tensors, graphs, streams, and CI
  pipelines.
- **Create Awesome:** runtime + template + addons → generated project.
- **Community:** contributor network and shared workshop.
- **Blog:** quiet late-night technical journal; readability dominates.
- **Projects:** dense technical ledger with meaningful grouping.
- **Open Source:** evidence and provenance trails, not a fake GitHub dashboard.

## Surfaces and shapes

Use distinct structures:

- floating world;
- technical panel;
- editorial block;
- diagram stage;
- ledger row;
- terminal annotation;
- immersive scene.

The shape language favors clipped corners, thin borders, irregular platforms,
technical polygons, selective circles, and occasional rectangles. Pills and
rounded cards are exceptional, not default.

## Accessibility

- Target WCAG 2.2 AA.
- Maintain 4.5:1 text contrast and 3:1 UI/focus contrast.
- Provide explicit focus outlines in addition to glow.
- Keep touch targets at least 44 × 44 px.
- Preserve semantic headings, landmarks, link names, and keyboard parity.
- Pair complex SVGs with adjacent text explanations.
- Verify 320 px reflow, 200% resize, forced colors, and reduced motion.

## Performance

- Preserve static Astro output and build-time data.
- Prefer CSS/SVG over raster environment art.
- Keep the hero LCP text or lightweight vector art.
- Optimize real screenshots with responsive variants and lazy load below fold.
- Hydrate only interactions that cannot be expressed accessibly with native
  HTML/CSS/inline script.
- Add no site-wide animation library by default.
- Track route JS, font payload, image weight, LCP, CLS, and SVG complexity.

## Data and asset truth

Canonical repeated facts live in typed data. Volatile counts include a
verification date or are omitted. Profile facts come from `src/data/profile.ts`
until a single generated source replaces it.

Every asset records:

- source;
- owner;
- license;
- allowed use;
- attribution, when required.

## Anti-patterns

Do not ship:

- generic Tailwind/shadcn landing grammar;
- repeated rounded glowing cards or pills;
- decorative blobs, stock robots, Matrix rain, CRT scanlines, or RGB gamer UI;
- fake terminal output, metrics, stars, testimonials, or contribution counts;
- inaccessible neon body text;
- video backgrounds or ornamental WebGL;
- one layout repeated across all worlds;
- issue IDs, implementation notes, or debug copy in public content.

## Implementation order

1. Foundation: global CSS, tokens, typography, shell, motion/effects, flexible
   world layout, visual test harness.
2. Homepage: environment, identity, atlas, evidence panels, responsive/reduced
   motion.
3. Agent Toolkit.
4. Personal DX: Dotfiles and Agentic Workstation.
5. V and Create Awesome.
6. Community and Blog.
7. Projects and Open Source.
8. Cross-site accessibility, performance, browser, and visual QA.

Historical explorations and the previous warm design remain in version history;
this document supersedes them for production decisions.
