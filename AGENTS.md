# AGENTS.md

This file provides guidance to agents when working with code in this repository.

Keep the `main` branch in a working state at all times. Avoid force-pushing or rewriting published git history.

---

## Project Layout

Two independent sub-projects in one repo:

| Directory | Stack | Notes |
|---|---|---|
| `/` (root) | TanStack Start (React 19, Vite 8, Tailwind v4) | SSR storefront, built + deployed by **Lovable's cloud pipeline** as a Cloudflare Worker |
| `vedaarna-medusa/` | Medusa v2 backend | Separate git repo, deployed to Railway via `railway.json` |

The two projects share **no** package.json or node_modules — commands must be run from the correct directory.

## Frontend Commands (run from repo root)

```sh
bun run dev        # dev server
bun run build      # production build (Cloudflare/Nitro target)
bun run lint       # ESLint
bun run format     # Prettier
```

No test runner is configured in the root — there are no test files.

## Backend Commands (run from `vedaarna-medusa/`)

```sh
npm run dev        # medusa develop (requires DATABASE_URL in .env)
npm run build      # medusa build
npm run seed       # medusa exec ./src/scripts/seed.ts
npx jest           # run all tests
npx jest --testPathPattern=<path>  # run a single test file
npx medusa db:migrate              # run migrations manually
```

Tests use Jest + `@swc/jest` (no Vitest). The `jest` config is inside `vedaarna-medusa/package.json`.

## Critical Gotchas

### Frontend

- **Build and deploy are Lovable-managed.** `npm run build` locally is for testing only. Production builds run inside Lovable's cloud sandbox; the Worker is deployed by their infrastructure, not by wrangler or a local script. There is no `wrangler.toml` or CI pipeline in this repo.
- **`VITE_*` env vars for production must be set in Lovable's project settings** (lovable.dev → project → Settings → Environment Variables). Setting them in Cloudflare's dashboard UI has no effect — those only apply to Worker runtime bindings, not Vite's build-time injection. After adding vars in Lovable, trigger a redeploy there.
- **Do NOT add plugins already bundled by `@lovable.dev/vite-tanstack-config`** to `vite.config.ts` — see the comment at the top of [`vite.config.ts`](vite.config.ts). Duplicating TanStack devtools, tailwindcss, tsConfigPaths, etc. will break the build.
- **`routeTree.gen.ts` is auto-generated** by TanStack Router — never edit it by hand. It updates on `dev`/`build`.
- **Server-only code**: use `*.server.ts` filename suffix or `@tanstack/react-start/server-only` — importing `server-only` (Next.js package) is an ESLint error.
- **SSR error handling**: [`src/server.ts`](src/server.ts) wraps TanStack's server entry to intercept h3-swallowed 500s (JSON `{"unhandled":true,"message":"HTTPError"}`) — do not remove this wrapper.
- **CSRF middleware** is re-added explicitly in [`src/start.ts`](src/start.ts) because defining that file opts out of TanStack's automatic installation.
- **`@/` path alias** maps to `src/` (configured in `tsconfig.json` and forwarded by vite-tsconfig-paths).
- **Tailwind v4**: uses CSS-first config in [`src/styles.css`](src/styles.css). Custom design tokens (`--sand`, `--blush`, `--terracotta`, `--font-display`, `--font-body`) are defined there — not in a `tailwind.config.*` file.
- **Fonts**: Marcellus (`font-display`) for headings, Jost (`font-body`) for body text.

### Backend (Medusa v2)

- **`medusa-config.js` uses `module.exports` (CommonJS)** with modules as a **keyed object** (not array) — Medusa v2 requires this format.
- **Medusa admin is disabled** (`admin: { disable: true }`) — there is no admin panel in this deployment.
- **`jwt_secret` / `cookie_secret`** must be set in `.env` (production). The fallback hard-coded values in `medusa-config.js` are for local development only; missing `JWT_SECRET` in production causes startup failure (the log error `No jwt_secret was provided` is the symptom).
- **Medusa `src/links/` directory is empty** — the `No link to load from /app/src/links` log is expected/normal.
- **Redis is optional**: `redisUrl` not found falls back to an in-memory fake — acceptable for development, not production.
- **Seeding**: `npm run seed` uses `medusa exec` targeting `src/scripts/seed.ts`. The seed file must be created under that path.
- **Railway deploy**: runs `npx medusa db:migrate && npx medusa start` on every deploy (see [`railway.json`](vedaarna-medusa/railway.json)).
- **Module keys in `medusa-config.js` must be snake_case** matching Medusa's internal `Modules` constants (e.g. `api_key`, `event_bus`, `sales_channel`, `stock_location`). camelCase keys (`apiKey`, `eventBus`, etc.) register the module under the wrong name in the DI container — core workflow steps that call `container.resolve(Modules.API_KEY)` find nothing and return `undefined`. Single-word keys (`auth`, `cart`, `user`, etc.) are unaffected since there is no underscore.
- **`locking` module must be registered** using `@medusajs/locking` (the module) with `@medusajs/locking-postgres` as a provider inside `options.providers`. `@medusajs/locking-postgres` alone is just a provider package with no service export — pointing `resolve` at it directly gives `No service found in module Locking`. Both packages must be in `dependencies`.
- **`sharedContainer` resolution error** means a module is loaded without being registered in `medusa-config.js` — add it to the `modules` object.

## Code Style

- **Prettier**: `printWidth: 100`, `semi: true`, `singleQuote: false`, `trailingComma: "all"` (see [`.prettierrc`](.prettierrc)).
- **TypeScript** (frontend): strict mode with `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitReturns` — avoid `any`.
- **TypeScript** (backend): strict is `false`, `experimentalDecorators` and `emitDecoratorMetadata` enabled (Medusa uses class decorators).
- **Component imports**: use `@/` alias, never relative `../..` paths.
- **shadcn/ui** components live in `src/components/ui/` — add via `npx shadcn add <component>`, do not hand-write them.
- **Site-specific** components live in `src/components/site/`.
- **`cn()` utility** from [`src/lib/utils.ts`](src/lib/utils.ts) (clsx + tailwind-merge) — always use it for conditional class names.
- **Routing**: file-based via TanStack Router. Dynamic segments use `$` prefix (e.g. `$slug`), not `:slug`. See [`src/routes/README.md`](src/routes/README.md).
- **`bun.lock`** is the canonical lock file for the frontend; backend uses `package-lock.json`. Bun install has a 24h `minimumReleaseAge` guard (see [`bunfig.toml`](bunfig.toml)).
