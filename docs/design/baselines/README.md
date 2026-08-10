# Visual baselines

The dated captures in this directory are historical design evidence. Do not
overwrite them during normal Playwright golden maintenance.

Update the maintained Playwright snapshots with its production-equivalent
server contract:

```bash
pnpm test:visual:update
```

Do not start a separate Astro dev or preview server. The visual harness builds the
current worktree, serves `dist/` on its dedicated test port, refuses to reuse an
existing server, and verifies the served document before capturing pixels. For
concurrent worktrees, assign each run an unused `VISUAL_TEST_PORT`.

If a future audit explicitly regenerates this historical directory, apply the
same isolated static-build contract and record the capture tool and viewport
metadata with the new evidence.

- Full multi-viewport sets may be large; prefer committing **contact sheets** under `YYYY-MM-DD/contact-sheets/`.
- Art-direction comparison shots live in `../art-directions/screenshots/`.
