# Navigation — desktop and mobile

- **Scope**: Epic B — B-03 (desktop) + B-04 (mobile)
- **Status**: Spec (pre-implementation tokens)
- **Related**: `docs/adr/ADR-001-route-map.md`, `src/data/project-worlds.ts`, `src/shared/components/Header.astro`, `src/shared/components/MobileNav.astro`
- **Tokens**: preliminary — see `src/styles/tokens.css` (Epic C owns final palette); this spec uses token names, not hard values

## Overview

Global navigation exposes the 9 project worlds plus home. It must work across
all themes, support future subdomain migration, and remain accessible without
JavaScript where possible. Mobile compresses the same information into a drawer
with focus trap and reduced-motion support.

Primary sources:

- `src/data/project-worlds.ts` — `worldsByPriority`, `featuredWorlds`, `crossLinks`
- `docs/adr/ADR-001-route-map.md` — route table and subdomain strategy

## World labels (from B-02)

| Priority | id | Label | Path |
| --- | --- | --- | --- |
| 10 | dotfiles | Dotfiles | `/dotfiles` |
| 20 | workstation | Workstation | `/agentic-workstation` |
| 30 | toolkit | Toolkit | `/agent-toolkit` |
| 40 | v | V | `/v` |
| 50 | create-awesome | Create Awesome | `/create-awesome` |
| 60 | community | Community | `/community` |
| 70 | blog | Blog | `/blog` |
| 80 | projects | Projects | `/projects` |
| 90 | open-source | Open Source | `/open-source` |

Home (`/`) is the brand link, not a world. Nav shows worlds in priority order.

## Desktop (`≥768px`)

### Layout

```
┌──────────────────────────────────────────────────────────────────────────┐
│ [◉ Hornero] Ulises Jeremias   Dotfiles  Workstation  Toolkit  V  Create…  More ▾   [Collaborate] │
│                                ────────                                              (CTA)       │
│                                active underline + aria-current                       │
└──────────────────────────────────────────────────────────────────────────┘
```

- **Brand**: hornero mark (◉ placeholder until SVG) + “Ulises Jeremias” — links to `/`.
- **Primary nav**: up to 7 items visible before overflow. With 9 worlds, overflow is required.
  Visible by default: Dotfiles, Workstation, Toolkit, V, Create Awesome, Community, Blog.
  Overflow (“More ▾”) contains: Projects, Open Source.
  Overflow uses `<details>` + CSS, no JS for initial open/close; JS enhances for `aria-expanded` and ESC.
- **CTA**: “Collaborate” → `mailto:ulisescf.24@gmail.com` (from profile). Always visible, rightmost, pill style.
- **Max 7 before overflow**: satisfies B-03 acceptance criterion. Overflow keeps header scannable at 1024px.

### Breakpoints

| Viewport | Behavior |
| --- | --- |
| ≥1440px | All spacing at `--space-4`, nav gap `--space-4`, brand + 7 visible + More + CTA |
| 1024–1439px | Same, but CTA may collapse to icon-only on narrow 1024 if needed |
| 768–1023px | Hide secondary labels? No — keep 5 visible + More. Use CSS `flex-wrap` only as fallback. |

### States

| State | Visual | Non-color affordance |
| --- | --- | --- |
| Default | `color: var(--color-muted)`, no background | — |
| Hover | `color: var(--color-text)`, `background: var(--color-paper)` soft | background change + underline on hover (not color-only) |
| Active (`aria-current="page"`) | `color: var(--color-text)`, `background: var(--color-paper)`, `box-shadow: inset 0 -2px 0 var(--color-accent)` | underline (2px solid) + `aria-current` |
| Focus | `outline: 2px solid var(--color-focus)` , `outline-offset: 2px` | outline always visible, no `:focus { outline:none }` |
| Pressed | same as hover, slight scale 0.98 | — |

All states respect `prefers-reduced-motion: reduce` — no transition, instant.

### Accessibility (desktop)

- `<header role="banner">` + `<nav aria-label="Primary">` landmarks.
- `<ul>` + `<li>` list for nav links, not divs.
- `aria-current="page"` on active link; compare via `Astro.url.pathname` (exact) and `startsWith` for subpaths (`/blog/*`).
- Keyboard: Tab → brand → each nav link → More summary → overflow links → CTA. Shift+Tab reverse. ESC closes overflow when open.
- Focus visible: `a:focus-visible`, `button:focus-visible`, `summary:focus-visible` share token outline.
- Color contrast: text AA (4.5:1) via tokens; active underline is extra affordance beyond color.
- No trap, no scroll lock on desktop.
- External links (future) use `rel="noreferrer"` + external icon with `aria-label` “(external)”.

### Tokens (preliminary)

```
--color-bg, --color-text, --color-muted, --color-border, --color-accent,
--color-paper, --color-focus,
--space-2, --space-3, --space-4, --space-8,
--radius-sm, --radius-md,
--max-width: 72rem
--font-sans, --font-mono
```

Final values live in `src/styles/tokens.css` (Epic C). Header uses only these names.

### Component plan

- `src/shared/components/Header.astro` — server-rendered, reads `worldsByPriority` from `src/data/project-worlds.ts`, splits into `visible` (first 7) and `overflow` (rest via B-05 “More”).
- No client JS for desktop layout; overflow `<details>` is CSS-only, enhanced JS for a11y is `client:idle` if needed.

---

## Mobile (`<768px`, tested at 375px and 360px)

### Layout

```
Closed:
┌──────────────────────────────────┐
│ [◉] Ulises  ───────────  [☰ Menu] │  ← hamburger, 44px touch target
└──────────────────────────────────┘

Open (drawer from right, 85% width, backdrop):
┌──────────────────┬───────────────┐
│ backdrop (dim)   │ Drawer        │
│ tap/ESC to close │ [✕ Close] 44px│
│                  │ Dotfiles      │
│                  │ Workstation   │
│                  │ Toolkit       │
│                  │ V             │
│                  │ Create Awesome│
│                  │ Community     │
│                  │ Blog          │
│                  │ ───────────── │
│                  │ Projects      │
│                  │ Open Source   │
│                  │ ───────────── │
│                  │ [Collaborate] │
│                  │ GH · LinkedIn │
└──────────────────┴───────────────┘
```

- **Trigger**: hamburger button `aria-expanded`, `aria-controls="mobile-drawer"`, `aria-label="Open menu"`.
- **Drawer**: `role="dialog"`, `aria-modal="true"`, `aria-label="Menu"`, `id="mobile-drawer"`.
- **Backdrop**: full-screen dim, click to close, `aria-hidden` when drawer closed.

### Breakpoints

| Viewport | Behavior |
| --- | --- |
| 375px (iPhone) | Drawer 85% / 320px max, backdrop 15%, all touch targets ≥44px |
| 360px (Android small) | Same, drawer scrolls internally if height overflows |

### Open / closed states

| State | DOM | Animation |
| --- | --- | --- |
| Closed | `hidden` attribute on drawer, `aria-expanded="false"` on trigger, backdrop hidden | — |
| Opening | Remove `hidden`, set `aria-expanded="true"`, add `is-open` class | `transform: translateX(0)` with `transition: transform 240ms cubic-bezier(0.16,1,0.3,1)` |
| Open | `aria-expanded="true"`, drawer focus on first link or Close button | — |
| Closing | `is-closing` class, `transform: translateX(100%)` | same transition reversed |
| Reduced motion | No transform, instant show/hide | `@media (prefers-reduced-motion: reduce) { transition: none }` |

No layout shift: drawer uses `position: fixed`, `inset: 0`, `transform` only (no width/height reflow).

### Interaction

| Input | Behavior |
| --- | --- |
| Tap hamburger | Toggle drawer, trap focus inside drawer |
| Tap backdrop | Close drawer, return focus to trigger |
| Tap link | Navigate, close drawer |
| Swipe (future) | Optional swipe-to-close, not required for B-04 |
| ESC | Close drawer, return focus to trigger, remove trap |
| Focus Tab / Shift+Tab | Cycle within drawer when open (trap) |

### Accessibility (mobile)

- **Touch targets**: all interactive elements ≥44×44px (WCAG 2.5.5). Measured: hamburger 44px, close 44px, each link 44px min-height with padding.
- **Focus trap**: when open, Tab cycles from last focusable back to first; Shift+Tab reverse. Implemented via JS `keydown` listener that checks `document.activeElement` against focusable list (`a, button, [tabindex]:not([tabindex="-1"])`).
- **Scroll lock**: `document.documentElement.style.overflow = "hidden"` when open, restored on close. Preserves scroll position.
- **`aria-expanded`**: trigger button toggles `"true"` / `"false"` synchronously with drawer visibility.
- **`aria-modal` + `role="dialog"`**: on drawer when open.
- **Escape**: `keydown` on `Escape` closes drawer, even if focus is on backdrop.
- **Reflow**: drawer is `overflow-y: auto`, never forces horizontal scroll; content reflows at 320px.
- **Screen reader**: nav uses same `<ul>` list as desktop, just visually compressed; no duplicate nav landmarks.
- **Visible focus**: same token outline as desktop.

### Performance

- No layout shift (CLS 0) — drawer is `fixed` + `transform`.
- JS budget: <2 KB (focus trap + toggle + ESC + scroll lock). No framework, vanilla.
- CSS only for backdrop fade; JS only for trap/ESC/toggle.
- Lazy: MobileNav is `client:idle` or inline script; desktop Header ships zero JS.

---

## Shared rules

- **No color-only active**: active uses underline + background + `aria-current`, not color alone.
- **Reduced motion**: all transitions disable when `(prefers-reduced-motion: reduce)`.
- **Landmarks**: single `banner` + `contentinfo` (footer) + primary nav; no duplicate `navigation` without label.
- **Heading hierarchy**: header contains no `h1`–`h6`; page `h1` stays in `<main>`.
- **External link affordance**: external links append `↗` with `aria-hidden` + screen-reader “(external)”.
- **Overflow strategy**: overflow pattern (“More”) is B-05 detail; this spec reserves the mechanism and the 7-item limit.
- **Future subdomain**: nav links remain `href="/dotfiles"` etc.; `canonicalUrl` handles host, not `Header`.

## Prototype notes (Figma / Astro)

- Desktop comps: 1440px and 1024px, light and dark (via `prefers-color-scheme`), with active/focus/hover annotations.
- Mobile comps: 375px closed + open, 360px open, plus reduced-motion frame.
- Astro prototype: `Header.astro` (desktop) + `MobileNav.astro` (mobile) share `worldsByPriority` but render distinct DOM.

## Validation

- [ ] Axe on prototype: 0 violations for landmark, color-contrast, link-name, aria-required.
- [ ] Keyboard: Tab through header in <12 presses, ESC closes mobile drawer, focus returns to trigger.
- [ ] Touch: all mobile targets ≥44px (measure via DevTools).
- [ ] Reduced motion: toggle OS setting, verify no drawer slide, instant open/close.
- [ ] 768px breakpoint: resize from 767→768, verify MobileNav hides and Header shows without flash.

## References

- `docs/adr/ADR-001-route-map.md` — route table
- `src/data/project-worlds.ts` — world list and ordering
- `src/shared/components/Header.astro` — desktop impl
- `src/shared/components/MobileNav.astro` — mobile impl
- WCAG 2.2: 2.4.7 Focus Visible, 2.5.5 Target Size, 1.4.3 Contrast
