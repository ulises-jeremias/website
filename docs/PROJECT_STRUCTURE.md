# Project structure

The Digital Nest is an Astro static site organized around file-based routes and
feature areas. Pages compose route-specific content; shared shell, canonical
editorial data, and visual systems live in dedicated modules. There is no
client-side UI framework.

```text
public/                 Static assets, fonts, icons, images, social cards
src/
  content/blog/         Future Markdown/MDX Field Notes (currently empty)
  data/                 Canonical routes, portfolio, profile, evidence, SEO,
                        open-source and sponsorship data
  features/             Route/domain components, data, tests and public APIs
  components/           BaseHead document metadata
  layouts/              BaseLayout document shell and SectionLayout
  pages/                Astro file routes and generated endpoints
  shared/
    components/         Site shell, reusable controls and visual primitives
    scripts/            Small progressive-enhancement scripts
    lib/                Cross-feature utilities
  styles/               Global tokens, semantics, themes, motion and textures
docs/                   Architecture, product and design authority
scripts/                Asset/data generation and validation tools
tests/                  Browser, deployment and visual regression suites
```

## Routes and feature boundaries

`src/pages/` defines the public URL structure. Most pages import a route feature
and pass it through the shared layout. Keep route files focused on composition,
SEO metadata and route-specific structured data. Special endpoints such as
`robots.txt.ts`, `rss.xml.ts` and `sitemap.xml.ts` generate their responses at
build time.

The professional portfolio hierarchy is canonical in
[`src/data/portfolio.ts`](../src/data/portfolio.ts). The visual exploration
taxonomy is separate in `src/data/project-worlds.ts`; do not use exploration
worlds as a replacement for professional portfolio areas. Route labels and
navigation behavior belong in `src/data/routes.ts`.

Feature areas include Home, Agent Toolkit, Agentic Workstation, Agentic Harness,
HorneroConfig, Hornero OS, V, Create Awesome, Projects/Work, Open Source, About,
Community, Writing and Sponsor. A feature may contain Astro components, local
data, styles, tests and an `index.ts` public API as appropriate; the directory
shape is intentionally not forced when a feature has no need for those layers.
Prefer public feature exports over cross-feature deep imports.

Shared responsibility and adoption relationships live in
`src/data/personal-dx-stack.ts` and render through `src/features/personal-dx/`.
Sponsorship terms are canonical in `src/data/sponsorship.ts` and project routes
reuse the shared `SupportNote` component.

## Content and evidence

`src/content.config.ts` defines the Astro content collection schema. Field Notes
content belongs in `src/content/blog/`; the collection is intentionally empty
until real articles are ready. Do not add sample or invented posts.

Portfolio facts, route metadata, social cards and generated evidence have
different owners. Keep editorial facts in their canonical data modules. Files
under `src/data/generated/` and source snapshots are refreshed or checked with
the corresponding scripts in `package.json`; do not hand-edit generated output
unless its generation workflow explicitly requires it.

## Development conventions

- Keep the default page output static HTML; add browser JavaScript only for a
  meaningful interaction, with a complete no-JavaScript reading path.
- Keep shared components in `src/shared/components/` only when they represent
  a repeated site-level pattern. Route-specific illustrations stay with their
  feature.
- Preserve the separation between professional portfolio data and the Digital
  Nest exploration map.
- Read `docs/COMPONENTS_AND_STYLING.md` before changing component or CSS
  conventions, and `docs/design/current/README.md` for current design authority
  and acceptance state.
- Validate source-backed and generated content with the scripts documented in
  `package.json`; run the repository checks before opening a PR.

The `@/*` TypeScript alias maps to `src/*`.
