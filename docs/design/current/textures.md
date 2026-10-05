# Background textures

## Usage

Keep body and card surfaces solid by default. A texture may support one
environment or section when it reinforces the content's setting; never place a
pattern under long-form copy, diagrams with fine labels, form controls, or
focus indicators. The homepage synthwave plate is the only current scanline
use and sits behind the hero content.

`src/styles/textures.css` is the source for original, CSS-only grid,
topographic, woven, and scanline surfaces. It adds no raster payload and has no
external asset dependency. Grid, topographic, and woven classes are optional
surface utilities; add one only when a route design calls for that setting.
The scanline utility is reserved for the homepage illustration plate.

## Contrast and intensity

Patterns are decorative and must not change the foreground/background color
pair that carries text. Pattern strokes use at most 6% of their accent token
over the solid surface. Text remains on the underlying `--color-surface` or
`--nest-midnight-*` token and must retain its normal WCAG contrast. Focus rings
remain above the texture and preserve the token-defined contrast. Forced-colors
mode removes textures.

## Reduced data and motion

All patterns are static CSS gradients, with no animation, image download, or
script. The layout and content remain complete if the browser omits background
images, including when `prefers-reduced-data: reduce` is available. Do not
replace these patterns with large raster noise or video.

## Swatches

The rules are easy to inspect in `src/styles/textures.css`: each
`.texture-*` class is a swatch that can be rendered over its existing solid
surface. The declared overlay alpha is the upper bound; route styles must not
raise it. No external texture assets are used, so there are no third-party
texture licenses.
