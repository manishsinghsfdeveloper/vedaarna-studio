# Project Architecture Constraints (Non-Obvious Only)

## Frontend Architecture

- **SSR entry is wrapped**: TanStack Start's default server entry is redirected to [`src/server.ts`](../../src/server.ts) via `vite.config.ts` `tanstackStart.server.entry: "server"`. This wrapper handles h3-swallowed 500 errors. Any architectural change to server handling must preserve this wrapper.
- **Router context carries QueryClient**: `createRootRouteWithContext<{ queryClient: QueryClient }>()` in [`src/routes/__root.tsx`](../../src/routes/__root.tsx). Every route that uses React Query must receive it through context, not by creating its own QueryClient.
- **Middleware order matters** in [`src/start.ts`](../../src/start.ts): error middleware runs before CSRF middleware so CSRF violations still get caught by the error handler.
- **Static product data** in [`src/lib/shop-data.ts`](../../src/lib/shop-data.ts) is the current source of truth — no Medusa API calls yet. Planning Medusa integration means replacing/wrapping this file, not adding parallel data fetching.
- **Two custom CSS utilities** defined via `@utility` in `styles.css`: `marquee-track` (animated scroll banner) and `link-underline` (hover underline animation). Do not re-implement as Tailwind plugins.

## Backend Architecture

- **Medusa v2 module system**: all commerce capabilities (cart, order, payment, inventory, etc.) run as isolated modules declared in `medusa-config.js`. The `workflowEngine` module orchestrates cross-module workflows. Adding a new capability = adding a module entry.
- **`workflowEngine` uses in-memory store** — workflow state does not survive restarts in the current config. For durable workflows, switch to `@medusajs/workflow-engine-redis` and provide `REDIS_URL`.
- **Event bus is local** (`@medusajs/event-bus-local`) — events do not persist or fan out. For production reliability, switch to `@medusajs/event-bus-redis`.
- **Cache is in-memory** (`@medusajs/cache-inmemory`) — cache is lost on restart. Acceptable for current scale.
- **Railway deploy flow**: every deploy runs `db:migrate` before `start` (see [`railway.json`](../../vedaarna-medusa/railway.json)) — migrations are forward-only and run automatically in production.
- **No custom API routes yet** — `vedaarna-medusa/src/index.ts` is a stub. Custom routes, subscribers, and workflows go under `src/api/`, `src/subscribers/`, `src/workflows/` respectively (Medusa v2 conventions).

## Two-Repo Boundary

- The frontend and backend are **intentionally decoupled** — the storefront currently uses static data. Medusa integration will require adding API client calls (likely via TanStack Query in route loaders) and configuring `MEDUSA_BACKEND_URL` in the frontend environment.
- Do not add backend dependencies to the root `package.json` or frontend code to `vedaarna-medusa/`.
