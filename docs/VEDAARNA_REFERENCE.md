# VedAarna Studio — Project Reference

> **Purpose:** Quick-reference for Bob (AI assistant) and any developer starting a new task.  
> Keep this file updated after every major change so the next session can pick up cleanly.

---

## Architecture at a Glance

| Layer              | Technology                                     | Hosted on                                             |
| ------------------ | ---------------------------------------------- | ----------------------------------------------------- |
| **Storefront**     | TanStack Start (React 19, Vite 8, Tailwind v4) | Cloudflare Worker (`vedaarna-studio`)                 |
| **Backend / API**  | Medusa v2                                      | Railway (`vedaarna-studio-production.up.railway.app`) |
| **Product Images** | Cloudflare R2 bucket `vedaarna-products`       | CDN `cdn.vedaarnastudio.com`                          |
| **Database**       | PostgreSQL (Railway-managed)                   | Railway                                               |

---

## Deploy Pipeline

```
1.  Edit code locally
2.  npm run build          # Vite + Nitro → .output/server/
3.  npx wrangler deploy    # Push Worker bundle to Cloudflare
```

- **`VITE_*` env vars are baked in at build time** from `.env.production` (gitignored).  
  Changing them in Cloudflare's dashboard has **no** effect — you must re-build and re-deploy.
- `.env.production` lives locally only, never committed.
- `.env.example` tracks all required keys (safe to commit, no real values).

---

## Key Files

| File                                          | Role                                                                                                                                                  |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/routes/index.tsx`                        | Home page — HeroCarousel, category tiles, New Arrivals carousel, Everyday Co-Ords, Festive Dresses, VedAarna Promise strip, Women of VedAarna preview |
| `src/lib/shop-data.ts`                        | Static product catalogue, collection list, `womenReviews` array, all CDN URL constants                                                                |
| `src/components/site/NewArrivalsCarousel.tsx` | Auto-advancing 4-up desktop / 1-up mobile product carousel (3 s interval)                                                                             |
| `src/components/site/HeroCarousel.tsx`        | Full-width hero banner (3 slides, 5.5 s auto-advance)                                                                                                 |
| `src/routes/women-of-vedaarna.tsx`            | `/women-of-vedaarna` page — 14 client review cards, R2 CDN images with local fallback                                                                 |
| `src/components/site/Header.tsx`              | Site nav (links from `shop-data.navLinks`)                                                                                                            |
| `src/components/site/Footer.tsx`              | Site footer                                                                                                                                           |
| `src/components/site/CartDrawer.tsx`          | Slide-out cart                                                                                                                                        |
| `src/lib/cart.ts`                             | Cart state (Zustand)                                                                                                                                  |
| `src/lib/medusa.ts`                           | Medusa Store API client — products & collections                                                                                                      |
| `scripts/upload-to-r2.ts`                     | Upload product photos to R2 `products/` folder                                                                                                        |
| `scripts/upload-women-images-to-r2.ts`        | Upload Women of VedAarna client photos to R2 `Women_Of_VedAarna/` folder                                                                              |
| `wrangler.toml`                               | Cloudflare Worker config (routes, vars)                                                                                                               |
| `.env.production`                             | Real secrets — **gitignored, never commit**                                                                                                           |
| `AGENTS.md`                                   | Critical coding rules for Bob — always read first                                                                                                     |

---

## R2 Bucket Layout (`vedaarna-products`)

```
vedaarna-products/
├── products/              ← Product catalogue images (VS-*.png)
│   ├── VS-CRD-2PC-0001-BRN-26-01-FR.png
│   └── ...  (186 objects as of 2025-07)
└── Women_Of_VedAarna/     ← Client review photos (uploaded 2025-07)
    ├── Client_Pic1.png
    ├── Client_Pic2.jpeg
    └── ...  (14 images, Client_Pic1–14)
```

**CDN base:** `https://cdn.vedaarnastudio.com`

- Product images: `https://cdn.vedaarnastudio.com/products/<filename>`
- Women photos: `https://cdn.vedaarnastudio.com/Women_Of_VedAarna/<filename>`

### Upload Women Photos to R2

```bash
# Requires R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY in .env
npx tsx scripts/upload-women-images-to-r2.ts
```

### Upload Product Photos to R2

```bash
# Edit DESIGN_RANGE in scripts/upload-to-r2.ts first, then:
npx tsx scripts/upload-to-r2.ts
```

---

## Do the Women of VedAarna images need to go into Medusa/PostgreSQL?

**No.** The Women of VedAarna photos are **static content** (customer review photos). They:

- Live in R2 (`Women_Of_VedAarna/` folder)
- Are referenced as hard-coded CDN URLs in `src/lib/shop-data.ts` → `womenReviews[]`
- Are bundled into the Worker at build time — **zero DB queries at runtime**
- Have local fallback imports (`src/assets/Women_Of_VedAarna/`) that fire via `onError` if CDN fails

Only **product catalogue data** (prices, variants, stock) benefits from being in Medusa/PostgreSQL.  
Static UGC/reviews content is best kept in source code + R2.

---

## Image Strategy Summary

| Image type        | Source                                      | Notes                                                                                |
| ----------------- | ------------------------------------------- | ------------------------------------------------------------------------------------ |
| Product photos    | R2 `products/` → CDN                        | Uploaded via `scripts/upload-to-r2.ts`                                               |
| Women of VedAarna | R2 `Women_Of_VedAarna/` → CDN               | Uploaded via `scripts/upload-women-images-to-r2.ts`; local fallback in `src/assets/` |
| Hero banners      | Local `src/assets/hero-*.jpg`               | Bundled in Worker; small enough not to need CDN                                      |
| Collection tiles  | R2 CDN (first product image per collection) | Reuses product CDN URLs                                                              |

---

## Home Page Sections (in order)

1. **HeroCarousel** — 3 full-width hero slides, 5.5 s auto-advance
2. **Category Ribbon (Marquee)** — Continuous auto-moving collection banner (Bunai-style) linking to category pages
3. **New Arrivals** — `NewArrivalsCarousel` (smooth continuous multi-card auto-sliding carousel with touch/drag support and dot indicators)
4. **Everyday Co-Ords** — 4-card grid, blush tinted background
5. **Festive Dresses** — 4-card grid
6. **VedAarna Promise** — brand values strip on sand background
7. **Women of VedAarna** — 6-photo preview grid, hover reveals review; links to `/women-of-vedaarna`

---

## Medusa Backend Notes & Database Inspection

- URL: `https://vedaarna-studio-production.up.railway.app`
- Admin panel is **disabled** (`admin: { disable: true }` in `medusa-config.js`)
- Falls back to static data in `shop-data.ts` if Medusa is unreachable (zero-downtime safety net)
- Module keys in `medusa-config.js` must be **snake_case** (`api_key`, `event_bus`, etc.)
- `JWT_SECRET` and `COOKIE_SECRET` must be set in Railway environment variables

### How to Inspect Live Products Directly in Backend / PostgreSQL

You can verify and inspect all products currently loaded in the database using the following methods:

1. **Store API Endpoint (Public Storefront Query):**

   ```bash
   curl "https://vedaarna-studio-production.up.railway.app/store/products?limit=100" \
     -H "x-publishable-api-key: <VITE_MEDUSA_PUBLISHABLE_KEY>"
   ```

   _Returns the list of all live published products currently accessible by the storefront._

2. **Medusa CLI Diagnostic Script (`check-db-state.ts`):**
   Run from `vedaarna-medusa/` directory:

   ```bash
   npx medusa exec ./src/scripts/check-db-state.ts
   ```

   _Queries the product module, lists all product IDs, titles, published statuses, sales channels, and API key bindings._

3. **Direct PostgreSQL Database Query (via Railway CLI / psql):**
   ```sql
   -- View all registered products with status and handle
   SELECT id, title, handle, status, created_at FROM product ORDER BY created_at ASC;

   -- Count published products
   SELECT status, count(*) FROM product GROUP BY status;
   ```

### Product Catalog Status Breakdown (Master Inventory Sheet)

- **Designs 0001 – 0027:** `Website Status: Live` (already active in PostgreSQL backend & live on website).
- **Designs 0028 – 0034:** `Website Status: Draft` (7 new shirt/top styles prepared with 56 photoshoot images, staged in `seed.ts` ready for database loading and R2 CDN upload).

---

## Tailwind Design Tokens (`src/styles.css`)

| Token          | Value       | Usage                     |
| -------------- | ----------- | ------------------------- |
| `--sand`       | warm beige  | Section backgrounds       |
| `--blush`      | soft pink   | Co-Ords section tint      |
| `--terracotta` | warm orange | Accent text, star ratings |
| `font-display` | Marcellus   | Headings                  |
| `font-body`    | Jost        | Body text                 |

---

## Change Log

### 2025-07 — Home Page Rebuild, Bunai Marquee & New Batch Products (0012–0034)

- Added infinite auto-running horizontal continuous marquee banner (Bunai-style) for category collections on the home page.
- Upgraded `NewArrivalsCarousel` with responsive sliding viewport, touch/drag gesture handling, and hover pause.
- Updated inventory sheet parsing and Medusa seed data:
  - Designs `0012` through `0027` (Live products in Inventory Master) wired with full R2 shoot images and sizes.
  - Designs `0028` through `0034` (Draft shirts/tops in Inventory Master) added to Medusa backend seed (`vedaarna-medusa/src/scripts/seed.ts`).
  - Updated `scripts/upload-to-r2.ts` design range `12..34`.
- Replaced old static placeholder image fallbacks with real high-resolution CDN images across collection tiles and product cards.
- `Women of VedAarna` page rebuilt with 14 real client photos, star ratings, review text, dress names (`womenReviews[]` in `src/lib/shop-data.ts`).
- Created `scripts/upload-women-images-to-r2.ts` to upload client photos to R2 `Women_Of_VedAarna/` folder.

### 2025-07 — Cart + Checkout

- Added `CartDrawer.tsx` (Zustand cart state in `src/lib/cart.ts`)
- Added `checkout.tsx` route with Razorpay integration
- Razorpay Key ID baked into build via `VITE_RAZORPAY_KEY_ID`; secret stored as Cloudflare Worker secret

### 2025-07 — Initial Launch

- Product catalogue (11 SKUs) with CDN images live at `cdn.vedaarnastudio.com/products/`
- Medusa backend deployed to Railway; static fallback active
- TanStack Router file-based routing; `routeTree.gen.ts` auto-generated — never edit by hand
