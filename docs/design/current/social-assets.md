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
all 15 outputs before committing regenerated cards.

## Application icons

PNG and ICO derivatives are generated from `public/favicon.svg` and the
first-party Digital Nest logo. Maskable icons use the approved midnight
background with a safe inset around the logo.

## Homepage featured art

Four 192×192 WebP thumbnails are derived from the committed 440×440 island
images with `pnpm assets:featured`. `FeaturedAreas.astro` serves the 192px
source for its 64–96 CSS pixel art at device-pixel ratios 1 and 2, and the
640px source for larger rendered sizes. PNG remains the fallback. The
thumbnails are each 3.6–4.5 KB with the committed ImageMagick output and add no
runtime dependency.

## 2026-09-30 update (ADR-004)

- Added `sponsor.jpg` (Digital Nest mark) and `hornero-os.jpg` (Hornero OS MIT mark, rasterized from
  `public/media/hornero-os/hornero-logo.svg` in a separate step so SVG density never scales card text).
- Refreshed subtitles for `home`, `dotfiles`, `agent-toolkit`, and `projects` (now titled WORK). The dotfiles card describes personal configuration and its HorneroOS ownership boundary.
- The generator uses locally resolved Noto Sans and ImageMagick. Generated
  bytes can vary with those local tool versions, so review every output after
  regeneration; do not claim byte-for-byte determinism across machines.
