# Social and icon asset provenance

The route social cards are generated from first-party Digital Nest scene art and
original SVG diagrams under `public/media/social/`. No stock illustration or
generated portrait is used.

## Social cards

- Output: `public/social/*.jpg`
- Dimensions: 1200x630
- Source plate: `public/assets/nest/hero-bg.webp`
- Route art: the corresponding first-party island under
  `public/assets/nest/island-*.webp`; the stack, trajectory, support dock, and
  Hornero OS mark use source SVGs already stored in the repository.
- Composition: one shared Synthwave Systems Atlas plate, route accent orbit,
  integrated art, and crop-safe title/subtitle area.
- Generator: `scripts/generate-social-cards.mjs`
- Font used during generation: locally installed Noto Sans; rendered text is
  embedded in the JPEG output

Card copy follows canonical route/project data. HorneroConfig describes its
personal configuration role, Agent Toolkit describes the portable CLI runtime,
Create Awesome names all four CLIs, and Hornero OS is labeled early-stage and
not yet installable. Sponsor and About use route-specific system diagrams
instead of the Digital Nest mark.

Run `pnpm assets:social` when route identity or approved art changes. Inspect
all 15 outputs at full resolution and in a contact sheet before committing.
The generator uses locally resolved Noto Sans and ImageMagick, so output bytes
can vary with tool and font versions; compare visual output, not hashes, across
different machines.

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

The legacy island PNG fallbacks under `public/assets/` can be regenerated from
the WebP sources with `node scripts/generate-island-pngs.mjs --regenerate`.
Island fallbacks now match their 640px source dimensions (instead of shipping
1024px copies) and the logo fallback uses its 256px source. The 1024px hero
fallback is an optimized JPEG generated from the first-party WebP source with
`pnpm assets:hero-fallback`; at 245 KB it preserves broad browser support while
reducing the former 1.27 MB PNG by 81%. The island fallback check also verifies
the hero JPEG alongside each island PNG fallback.

## 2026-10-04 update

- Added `sponsor.jpg` (Digital Nest mark) and `hornero-os.jpg` (Hornero OS MIT mark, rasterized from
  `public/media/hornero-os/hornero-logo.svg` in a separate step so SVG density never scales card text).
- Integrated art directly into the background plate with a restrained route-color orbit and an angled copy plane; removed the detached black art panel.
- Replaced reused Home artwork on About and Sponsor with original trajectory and support-dock SVGs; Agentic now has a separate three-project map.
- Corrected stale HorneroConfig and Hornero OS claims, added Rust to Create Awesome, and clarified that the Toolkit card describes portable capabilities plus its CLI runtime.
