# Components and styling

The site uses Astro components and plain CSS. Static HTML is the default; small
browser scripts progressively enhance interactions where needed. The project
has no React, Vue, Tailwind or general-purpose component-library integration.

## Components

- Use `.astro` for static structure and server-rendered data.
- Keep route composition in `src/pages/` and route/domain presentation in
  `src/features/<feature>/`.
- Put repeated site-level controls and shell elements in
  `src/shared/components/`. Existing examples include `SiteHeader`,
  `SiteFooter`, `Button`, `Link`, `Icon`, `MobileNav` and visual-stage
  primitives.
- Keep route-specific artwork and diagrams close to the feature that explains
  them. Extract a primitive when the same visual or behavior genuinely recurs.
- Prefer native HTML controls and small progressive-enhancement scripts over a
  framework island. Preserve useful content and navigation when JavaScript is
  unavailable.

Astro component-scoped `<style>` is suitable for local composition. Global
systems belong in `src/styles/`; `src/styles/index.css` assembles the reset,
tokens, semantic roles, typography, atmosphere, motion and world themes.

## Design system

The approved identity is **Synthwave Systems Atlas**. Its authority and current
implementation state are indexed in
[`docs/design/current/README.md`](design/current/README.md). Use the existing
tokens and semantic roles in `src/styles/tokens.css`, `semantic.css`,
`typography.css`, `spacing.css`, `effects.css`, `textures.css` and
`motion.css`. Route themes live in `src/styles/themes/`.

Use semantic color and spacing tokens for recurring decisions. Add a token when
a value becomes a stable pattern; keep one-off illustration details local. Do
not introduce generic card, glass, glow or gradient treatments where a
project-specific diagram or composition carries the information better.

## Interaction and motion

Use native links, buttons, forms and radio/checkbox controls whenever possible.
Interactive diagrams must follow
[`docs/INTERACTIVE_DIAGRAM_SEMANTICS.md`](INTERACTIVE_DIAGRAM_SEMANTICS.md):
provide visible control state and a text-equivalent explanation without making
the SVG itself the only source of meaning.

Motion should communicate atmosphere, feedback or a real system process. Every
autonomous or explanatory animation must respect `prefers-reduced-motion`; in
that mode, content remains visible and the essential state remains available.
Avoid scroll hijacking, hover-only information and motion that competes with
reading.

## Accessibility

- Preserve landmarks and a logical heading order.
- Give meaningful images useful alternative text; mark decorative SVG and
  icons as hidden from assistive technology.
- Give controls visible labels and visible keyboard focus.
- Keep state understandable without color alone.
- Maintain touch-sized actions and responsive reflow at narrow widths.
- Test keyboard behavior, no-JavaScript behavior and reduced motion for new
  interactions. Automated results do not replace the manual AT matrix in
  `docs/design/current/uiux-manual-qa-checklist.md`.

## Naming and validation

Use PascalCase for Astro components (`SiteHeader.astro`) and kebab-case for
route and content slugs. Keep feature data and tests beside the feature when
they are feature-specific; shared editorial facts belong in `src/data/`.

Use the package scripts for formatting, linting, type checking, tests, build,
route budgets, Lighthouse and generated-data checks. See `package.json` and the
repository workflows for the current commands and required gates.
