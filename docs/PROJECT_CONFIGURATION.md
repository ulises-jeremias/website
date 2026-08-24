# ⚙️ Project Configuration

This project is bootstrapped with [create-awesome-node-app](https://github.com/Create-Node-App/create-node-app). Dependencies and scripts are resolved from the template's `package/` folder at generation time.

## Node.js

- **Pinned version**: `22.22.0` (see `.node-version`; `package.json` permits compatible Node 22 releases)
- Use `fnm use`, `nvm use`, or your preferred version manager before installing

## Astro

Configuration lives in [`astro.config.mjs`](../astro.config.mjs). The starter uses static output:

```js
export default defineConfig({
  output: 'static',
});
```

Changing static output or adding framework integrations requires an explicit
architecture decision and corresponding documentation.

## TypeScript

[`tsconfig.json`](../tsconfig.json) enables strict mode and path aliases (`@/` → `src/`).

Run type checking with:

```sh
pnpm type-check
```

This invokes `astro check`, which understands `.astro` files and content collection types.

## ESLint

[`eslint.config.mjs`](../eslint.config.mjs) uses the flat config format with `eslint-plugin-astro`:

- Recommended Astro rules via `astro.configs['flat/recommended']`
- Ignores: `dist/`, `.astro/`, `node_modules/`

```sh
pnpm lint
pnpm lint:fix
```

## Prettier

[`/.prettierrc.cjs`](../.prettierrc.cjs) includes `prettier-plugin-astro` for `.astro` file formatting.

```sh
pnpm format
```

Enable format-on-save in your editor for consistent style.

## Content collections

[`src/content.config.ts`](../src/content.config.ts) registers collections with loaders and Zod schemas. After changing schemas:

1. Restart the dev server
2. Run `pnpm type-check` to surface frontmatter errors

See [Project Structure](./PROJECT_STRUCTURE.md) for folder conventions.

## Environment variables

Copy [`.env.example`](../.env.example) to `.env` for local values.

- **`PUBLIC_*`** — exposed to client code (e.g. site name, analytics flags)
- **Unprefixed** — server/build only; never leak secrets to the browser

`.env`, `.env.local`, and similar files are gitignored.

## EditorConfig

[`.editorconfig`](../.editorconfig) sets two-space indentation, LF line endings, and UTF-8 encoding across editors.

## Absolute imports

Configure `baseUrl` and `paths` in `tsconfig.json` (already set for `@/`). Import from `@/layouts/BaseLayout.astro` instead of deep relative paths like `../../layouts/...`.

## Quality tooling

The repository includes Husky, lint-staged, commitlint, Vitest, Playwright,
Codecov, cspell, knip, and MegaLinter. Commands and CI parity are documented in
[CONTRIBUTING.md](../CONTRIBUTING.md) and [TESTING_GUIDE.md](./TESTING_GUIDE.md).

## Deployment

`pnpm build` writes static assets to `dist/`. Deploy that folder to any static host (Netlify, Vercel, Cloudflare Pages, S3 + CDN).

When deployed on Vercel, `vercel.json` applies baseline response headers to every
route: MIME sniffing and framing are disabled, referrer sharing is restricted to
the configured policy, and camera, microphone, geolocation, and browsing topics
are disabled. Stable files under `/fonts/` and `/assets/` use a one-day browser
cache; they are not marked `immutable` because their public filenames are not
content-hashed.

If you need SSR, server islands, or on-demand rendering, add an [Astro adapter](https://docs.astro.build/en/guides/deploy/) and update `astro.config.mjs`.
