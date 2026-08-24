# Final Asset and License Audit

**Audit date:** 2026-08-24

**Audit baseline:** `main@6f8fc0abb5cd39062f9f616b1090657d38f3a5b2`; collage cleanup is included in this PR

**Production:** <https://www.ulises-jeremias.dev/>
**Status:** Engineering pass; owner review is still required for final legal sign-off.

## Scope

This audit covers every tracked file under `public/`, including direct URL
access to files that are not referenced by a page. It also covers the local
font packages used to produce the shipped WOFF2 files and the source/license
claims in the route data.

The audit does not grant rights to third-party material. It records the
provenance currently established by the repository and removes an asset whose
embedded artwork was explicitly excluded from the product.

## Inventory

The post-cleanup inventory contains 88 tracked public files:

| Area                     | Files | Contents                                                  |
| ------------------------ | ----: | --------------------------------------------------------- |
| `public/assets/`         |    33 | First-party atlas source PNGs and optimized Nest WEBP art |
| `public/media/dotfiles/` |    25 | Seven source captures and 18 responsive WEBP derivatives  |
| `public/social/`         |    10 | Route social cards, all JPEG                              |
| `public/icons/`          |     5 | Apple Touch Icon and 192/512 PNG variants                 |
| `public/fonts/`          |    10 | JetBrains Mono and Orbitron WOFF2 files                   |
| Public root              |     5 | Favicon SVG/ICO/PNG files and `site.webmanifest`          |

The byte inventory was measured with `find public -type f`. The route budget
checks, rather than this aggregate, remain authoritative for per-route delivery
limits.

## Provenance Matrix

| Asset family                  | Source and owner                                                                                                  | License or permission basis                                                                                 | Product treatment                                                                       |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Digital Nest atlas art        | First-party Digital Nest assets committed in this repository; owner Ulises Jeremias                               | Site `LICENSE` (MIT) for site-owned code and assets                                                         | Used by the home observatory, Projects archive, shared shell, and social-card generator |
| Dotfiles captures             | `ulises-jeremias/dotfiles/static`; source and credit are recorded in `src/features/dotfiles/data/index.ts`        | Dotfiles repository MIT; adapted Quickshell attribution is separately recorded as GPL-3.0                   | Gallery uses only the six approved first-party capture sets and responsive derivatives  |
| Social cards                  | `scripts/generate-social-cards.mjs`, using first-party Nest art and locally installed Noto Sans for rendered text | First-party art permissions plus the source licenses above; Noto Sans is only a local generation dependency | Ten 1200x630 cards reviewed for route text, artwork, safe canvas, and missing assets    |
| Favicon and application icons | `public/favicon.svg` and the first-party Digital Nest mark                                                        | Site-owned asset under the site MIT license                                                                 | PNG and ICO derivatives are used by the document head and manifest                      |
| JetBrains Mono                | `@fontsource/jetbrains-mono` 5.3.0 package                                                                        | SIL Open Font License 1.1; copyright notice is present in the package license                               | Ten shipped WOFF2 files are embedded locally; no remote font request                    |
| Orbitron                      | `@fontsource/orbitron` 5.3.0 package                                                                              | SIL Open Font License 1.1; copyright notice is present in the package license                               | Ten total font files include the six Orbitron weights used by the site                  |
| V ecosystem references        | License table in `src/features/v/data/index.ts`                                                                   | V, VSL, VTL, RxV, and setup-v are MIT; Awesome V is CC0 1.0                                                 | Repository links and text references only; no upstream artwork is copied                |
| V mascot reference            | `vlang/v-mascot`, recorded in the Projects and V license data                                                     | CC BY-NC 4.0; non-commercial and attribution restrictions apply                                             | No Veasel asset is embedded or featured; tests protect this boundary                    |

## Cleanup

`public/media/dotfiles/collage.png` was removed in this audit. The file was not
referenced by route data or components, and the code explicitly excluded it
because it embeds an anime wallpaper. Direct public access would nevertheless
have made it part of the shipped asset surface. The approved gallery remains
limited to the six capture sets listed in the Dotfiles data source.

`public/media/dotfiles/screenshot-nord-two-lines.png` remains a non-featured
first-party source capture from the Dotfiles repository. It is not used by the
gallery and carries no generated derivative.

## Verification

- [x] `git ls-files public` inventory completed before cleanup: 89 files.
- [x] Unreferenced third-party artwork identified and removed.
- [x] All route-referenced images have a source, owner, and license basis.
- [x] `public/social/*.jpg` are 1200x630 and map one-to-one to the ten route cards.
- [x] `src/features/dotfiles/data/index.ts` records capture credits and excludes the removed collage.
- [x] `src/features/v/data/index.test.ts` protects the upstream license matrix and mascot non-embedding rule.
- [x] `src/data/site.test.ts` covers favicon, icon, and manifest paths in the production build.
- [x] `git diff --check` passes after cleanup.

## Remaining Owner Review

- Confirm that the first-party Digital Nest art is owned or otherwise cleared for public redistribution under the site license.
- Confirm the continued use of the adapted Quickshell presentation and its GPL-3.0 attribution.
- Confirm that the ten local WOFF2 files are distributed with the OFL notices supplied by their packages.

This document is an engineering provenance record, not legal advice. A human
owner must review it before calling the audit a legal approval.

## References

- `LICENSE`
- `docs/design/current/social-assets.md`
- `src/features/dotfiles/data/index.ts`
- `src/features/v/data/index.ts`
- `src/features/v/data/index.test.ts`
- `scripts/generate-social-cards.mjs`
- `public/`
- Issue [#307](https://github.com/ulises-jeremias/website/issues/307)
