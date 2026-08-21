# Social and icon asset provenance

The route social cards and application icons were generated on 2026-08-21 from
first-party Digital Nest assets already committed under `public/assets/nest/`.
No external illustration or generated portrait was introduced.

## Social cards

- Output: `public/social/*.jpg`
- Dimensions: 1200x630
- Source plate: `public/assets/nest/hero-bg.webp`
- Route art: the corresponding first-party island under
  `public/assets/nest/island-*.webp`
- Home art: `public/assets/nest/logo-nest.webp`
- Generator: `scripts/generate-social-cards.mjs`
- Font used during generation: locally installed Noto Sans; rendered text is
  embedded in the JPEG output

Run `pnpm assets:social` only when route identity or approved art changes. Review
all ten outputs before committing regenerated cards.

## Application icons

PNG and ICO derivatives are generated from `public/favicon.svg` and the
first-party Digital Nest logo. Maskable icons use the approved midnight
background with a safe inset around the logo.
