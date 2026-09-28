# Project Documentation Context (Non-Obvious Only)

- **This is NOT a Next.js or Remix project.** It uses TanStack Start. Common Next.js patterns — `pages/`, `app/layout.tsx`, `getServerSideProps`, `server-only` package — do not apply.
- **`src/routes/__root.tsx`** is the only root layout; it uses `shellComponent` + `component` split (TanStack Start specific, not standard TanStack Router). `shellComponent` renders the HTML shell; `component` wraps the app providers.
- **Tailwind config lives in CSS** ([`src/styles.css`](../../src/styles.css)), not in a JS/TS config file. Tailwind v4 uses `@theme inline` blocks.
- **`src/lib/shop-data.ts`** is a static data file — products, collections, nav links are all hardcoded (not fetched from Medusa yet). This is the source of truth for current product listings.
- **The Medusa backend** is a separate git repo embedded at `vedaarna-medusa/` — it has its own `.git`, own `package.json`, and is deployed independently to Railway.
- **`vedaarna-medusa/src/index.ts`** is currently a stub — the backend has no custom modules yet. All commerce logic runs through Medusa's built-in modules.
- **Medusa admin is intentionally disabled** — there is no admin UI deployed. Management must be done via API or scripts.
- **CORS values in `medusa-config.js`** contain hard-coded production URLs as fallbacks — this means the backend will accept requests from `vedaarnastudio.com` even without env vars set.
- **Payment provider**: Razorpay (Indian payments) — env vars `RAZORPAY_ID`, `RAZORPAY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` (not Stripe).
- **File storage**: Cloudflare R2 (S3-compatible) — env vars are `S3_*` prefixed; endpoint is `*.r2.cloudflarestorage.com`.
- **Frontend deploy target**: Cloudflare Workers/Pages via Nitro (configured inside `@lovable.dev/vite-tanstack-config`, not visible in `vite.config.ts`).
