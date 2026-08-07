# 🗄️ Project Structure — website

This Astro site is **content-first** and **feature-based** (inspired by [`nextjs-saas-ai-template/src/features`](https://github.com/Create-Node-App/nextjs-saas-ai-template/tree/main/src/features)). Pages are thin routers; domain logic lives in `src/features/`.

## Top-level layout

```sh
.
├── public/                 # static assets (favicon, images) → served as-is
├── src/
│   ├── content/            # Markdown/MDX collections
│   │   └── blog/           # sample blog
│   ├── content.config.ts   # loaders (glob) + Zod schemas
│   ├── features/           # domain modules
│   │   ├── _feature-template_/  # scaffold for new features
│   │   ├── blog/           # blog: components, services, types
│   │   └── landing/        # landing: data + Features component
│   ├── shared/
│   │   ├── lib/            # cross-feature utils (cn, formatDate, slugify)
│   │   └── components/     # cross-feature UI
│   ├── components/         # legacy shared (BaseHead)
│   ├── layouts/            # BaseLayout (HTML shell)
│   ├── pages/              # file-based routes (thin)
│   │   ├── index.astro     # -> /
│   │   └── blog/           # -> /blog, /blog/[slug]
│   └── styles/             # global CSS (landing, blog)
├── docs/                   # human-readable guides
├── .github/workflows/      # CI: build, lint, type-check, tests, mega-linter, pr-review, todo
├── .husky/                 # pre-commit, commit-msg, pre-push
├── astro.config.mjs
├── eslint.config.mjs
├── tsconfig.json
└── vitest.config.ts
```

## Routing

| `src/pages/` file         | Route         |
| ------------------------- | ------------- |
| `pages/index.astro`       | `/`           |
| `pages/blog/index.astro`  | `/blog`       |
| `pages/blog/[slug].astro` | `/blog/:slug` |

Add new marketing pages as `pages/<slug>.astro`; tenant/slug logic belongs in features.

## Content collections

- **Config:** `src/content.config.ts` defines `blog` collection with Zod schema (title, description, pubDate, updatedDate, draft).
- **Loader:** `glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' })`
- **Query:** `getCollection('blog')` in `src/features/blog/services/blog.ts` or directly in pages; filter `!data.draft` and sort by date.
- **New collection:** add `defineCollection` entry and export in `collections`, then create `src/content/<name>/`.

## Feature modules

Encapsulated domains under `src/features/<name>`:

```
<feature>/
├── components/  # Astro components (or React islands)
├── services/    # data fetching / business logic (e.g., blog.ts)
├── types/       # domain types
├── hooks/       # client hooks (if island)
├── index.ts     # public API — only exports
└── README.md
```

**Rules:**

- Import only via public API: `import { BlogCard } from '@/features/blog'` — never `from '@/features/blog/services/blog'`.
- `services/` has no UI; `components/` receives data via props (no direct `getCollection` inside components).
- Start from `_feature-template_` (`cp -r src/features/_feature-template_ src/features/my-feature`).

### Example

```ts
// src/pages/blog/index.astro (thin router)
---
import { getPublishedPosts } from '@/features/blog';
const posts = await getPublishedPosts();
---
<ul>{posts.map(p => <li>{p.title}</li>)}</ul>
```

## Shared

- `src/shared/lib/utils.ts` — `cn`, `formatDate`, `slugify` (tested via Vitest)
- `src/shared/components/` — cross-feature UI stubs (add Button, Card, etc.)

## Layouts & components

- `layouts/BaseLayout.astro` — `<html>`, `<body>`, slots for `BaseHead`
- `components/BaseHead.astro` — `<title>`, meta description, charset, viewport

## Import alias

`tsconfig.json` maps `@/*` → `src/*`:

```ts
import BaseLayout from '@/layouts/BaseLayout.astro';
import { getPublishedPosts } from '@/features/blog';
```

## When to add folders

| Need               | Location                                                             |
| ------------------ | -------------------------------------------------------------------- |
| New marketing page | `pages/about.astro` (thin, delegates to feature)                     |
| New domain         | `features/<domain>/` (copy template)                                 |
| Shared util/UI     | `shared/lib/` or `shared/components/`                                |
| Blog/docs content  | `content/<collection>/`                                              |
| Global styles      | `styles/` or component `<style>`                                     |
| Interactive widget | `features/<domain>/components/` + `npx astro add react` + `client:*` |

## Principles

1. **Content-first** — static HTML & collections over client state.
2. **Feature encapsulation** — public `index.ts`, no cross-feature deep imports.
3. **Thin pages** — routing only; logic in features/shared.
4. **Schema at the edge** — Zod in `content.config.ts` validates frontmatter early.
5. **CI is law** — `pnpm lint && pnpm type-check && pnpm test && pnpm build` must pass on `main`.
