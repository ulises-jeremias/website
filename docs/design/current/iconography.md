# Iconography

## Visual language

First-party interface icons use simple geometric SVG outlines with rounded
joins, a 1.7px stroke on a 24×24 viewBox, and `currentColor`. Render them at
16px for dense inline controls, 20px for navigation and buttons, and 24px for
standalone explanatory marks. Keep one icon optically centered in a square
wrapper; the wrapper sets layout size and the SVG keeps its 24×24 coordinate
system. Do not add glow to a default icon state.

Use filled glyphs only when the shape is a recognizable external brand mark
(GitHub, Discord, LinkedIn, and similar). Brand shapes retain their official
silhouette and use the surrounding text or link color; they are not a second
general-purpose interface style. Route illustrations and system diagrams can
use their own documented visual vocabulary when they explain real structure.

## Accessibility

- Decorative icons beside visible text use `aria-hidden="true"` and are not
  focusable.
- Icon-only controls get an accessible name from the control (`aria-label` or
  visually hidden text), not from a decorative SVG.
- An icon that conveys information unavailable in nearby text uses an SVG
  `<title>` with a caller-supplied unique `id` and `aria-labelledby`.
- Color never carries the only meaning. Focus and state also use shape, text,
  or a visible state marker.

## Source and licensing

Small first-party symbols are inline SVG authored for this site. External
service marks are minimal inline path data used only to identify links to those
services; their silhouettes remain attributable to their respective owners.
No icon font, runtime icon package, or remote sprite is loaded. If a third-party
icon set is introduced, record its name, version, license, and required notices
here before use.

## Current icon sheet

`src/shared/components/Icon.astro` is the first-party line icon set. Each icon
uses the same viewBox, stroke, joins, size contract, and current color:

| Icon            | Meaning                     | Current placement                   |
| --------------- | --------------------------- | ----------------------------------- |
| `agent-network` | Connected agents            | Homepage Agentic destination        |
| `stack`         | Layered operating system    | Homepage Hornero destination        |
| `lattice`       | Scientific computation grid | Homepage V destination              |
| `modules`       | Reusable scaffold parts     | Homepage Create Awesome destination |

These marks are navigation cues, not data visualizations. The labels remain
visible and complete without the icons.

## Current samples

`SiteHeader.astro` and `SiteFooter.astro` are the maintained shell examples.
The footer social marks demonstrate the branded-fill exception; its mail icon
demonstrates the first-party outline treatment. The heart in “Built with” is
decorative because the adjacent words convey the meaning.
