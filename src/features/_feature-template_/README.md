# Feature Template

This directory is a **template** for creating new features. Copy it, rename it, and adapt the internals.

**Source of truth:** `docs/PROJECT_STRUCTURE.md` for feature-module conventions (mirrors `nextjs-saas-ai-template` pattern).

## Structure

```
_feature-template_/
├── components/       # UI (Astro and/or framework islands)
│   ├── ExampleCard.astro
│   └── ExampleCard.module.css (if needed)
├── hooks/            # Client hooks (if using React island)
│   └── useExample.ts
├── services/         # Data fetching / business logic
│   └── exampleService.ts
├── types/
│   └── index.ts
├── index.ts          # Public API — only export what consumers need
└── README.md
```

## Usage

```bash
cp -r src/features/_feature-template_ src/features/my-feature
# rename files, update exports, update types
```

```ts
// Consuming from a page
import { ExampleCard } from '@/features/my-feature';
```

## Best Practices

- **Encapsulation:** keep internals private; export only via `index.ts`.
- **No cross-feature imports of internals:** `import { X } from '@/features/other/services/internal'` is not allowed — use the public `index.ts`.
- **Services have no UI:** keep data fetching and business logic in `services/`.
- **Components receive data via props:** do not query `astro:content` inside components; pass data from pages or services.

## Variants

- **Static content feature (default):** components in `.astro`, logic in plain TS.
- **Interactive island:** add `npx astro add react` and place `client:*` components inside `components/`.

## Checklist

- [ ] `index.ts` re-exports public surface
- [ ] `types/index.ts` defines feature domain types
- [ ] `services/` has no UI
- [ ] `components/` has no direct `astro:content` queries (pass data via props)
