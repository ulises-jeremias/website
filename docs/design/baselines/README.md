# Visual baselines

Regenerate with production preview + Brave/Chromium via Playwright:

```bash
pnpm build && pnpm preview --host 127.0.0.1 --port 4321
# then run the capture script used in the 2026-08-07 audit session
```

- Full multi-viewport sets may be large; prefer committing **contact sheets** under `YYYY-MM-DD/contact-sheets/`.
- Art-direction comparison shots live in `../art-directions/screenshots/`.
