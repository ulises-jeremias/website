# Home — Epic E

Homepage and personal portfolio. Content-first, static, feature-based.

- `components/Hero.astro` — Digital Nest hero (SVG nest arcs + modules), static-first, prefers-reduced-motion.
- `components/ProfileSection.astro` — verified profile, roles, focus, links (E-05).
- `components/CurrentlyBuilding.astro` — active focus areas without vanity metrics (E-06).
- `components/FeaturedWorlds.astro` — project-universe navigation, 6 worlds with connectors (E-04/E-07).
- `components/Strengths.astro` — strengths as systems, no skill bars (E-08).
- `components/OpenSourceProof.astro` — evidence-based links, not stars (E-09).
- `components/Contact.astro` — verified GH/LinkedIn/email/Discord + collaboration CTA (E-11/E-12).

Tokens from `src/styles/tokens.css` (Epic C) and layout from `src/shared/components/Section.astro` (Epic D).
Data from `src/data/profile.ts` (Zod) and `src/features/home/data`.

Import via public API: `import { Hero, ProfileSection } from '@/features/home'`.
