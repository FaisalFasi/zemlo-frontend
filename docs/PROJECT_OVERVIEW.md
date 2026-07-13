# Zemlo Frontend — Project Overview

> Purpose of this document: a single quick-reference for the whole project — what tech is used, how it's structured, which features are done, which are pending, and what to build next. Companion document: [AUDIT.md](AUDIT.md) (detailed issues with file references).
>
> Last updated: 2026-07-13 · Status: **Work in progress (~50%)**

Zemlo is a production-oriented e-commerce storefront + admin panel built with **Next.js 15 (App Router)**, backed by a separate NestJS API (`zemlo-store`). The core purchase flow (browse → product → cart → checkout → Stripe payment) and admin product CRUD are functional. Customer accounts, order pages, and several supporting pages are not built yet.

---

## 1. Tech Stack

| Area | Technology | Notes |
|---|---|---|
| Framework | Next.js 15.5 (App Router, RSC) | Server-first; ISR on catalog pages |
| UI | React 19, Tailwind CSS v4, shadcn/ui (Radix), lucide-react | Legacy custom UI kit also exists in `src/components/custom` |
| Data fetching (client) | TanStack Query v5 | staleTime 30s, gcTime 5min, retry 1, no refetch-on-focus |
| Data fetching (server) | Native `fetch` helpers in `src/lib/api` | Direct to backend via `API_BASE_URL` |
| API client generation | Orval v8 | Typed client + React Query hooks from backend OpenAPI spec (`npm run api:generate`) |
| HTTP (browser) | Axios with request interceptor | Injects `Authorization` bearer + `x-guest-id`; routes through `/api/backend` proxy |
| Forms & validation | react-hook-form + Zod v4 | Checkout + admin product forms |
| Payments | Stripe Payment Element | PaymentIntent client-secret from backend; webhook confirms order |
| Carousels | Embla Carousel (+autoplay), Swiper | |
| Language / tooling | TypeScript 5.9 (`strict: true`), ESLint 9 (`next/core-web-vitals`) | `tsc` and `lint` both pass clean |
| Backend | NestJS REST API (separate repo) | Hosted at zemlo-store.onrender.com |

---

## 2. Architecture

Feature-Sliced Design (FSD)-inspired layering — full rules in [ARCHITECTURE.md](ARCHITECTURE.md):

```
src/
├── app/              # Next.js routes — thin wrappers only
│   ├── (public)/     # Storefront: home, shop, products/[slug], cart, checkout, legal
│   ├── (auth)/       # Customer login/signup (UI only — NOT wired yet)
│   ├── (admin)/      # Admin: login, dashboard, products CRUD
│   └── api/          # /api/backend/[...path] reverse proxy + admin proxy routes
├── features/         # cart, checkout, catalog, shop, product-detail, admin
│                     # (each: api/ hooks/ components/ schemas/)
├── entities/         # Domain models & mappers (product)
├── widgets/          # Navbar, footer, legal shell, public-page placeholder
├── shared/           # ui (shadcn), api (axios + orval-generated), config,
│                     # query, seo, navigation, hooks, lib
└── components/       # ⚠️ LEGACY flat components (home sections, custom UI kit)
                      # — pending migration into features/widgets/shared
```

**Data flow (browser):**
Component → feature hook (TanStack Query) → feature API wrapper → Orval-generated function → Axios mutator → `/api/backend/[...path]` proxy → NestJS backend.

**Data flow (server components):**
Page → `src/lib/api` fetch helpers → backend directly. Shop and product-detail use ISR (`revalidate: 300`), with a demo-catalog fallback when `DEMO_CATALOG_ENABLED=true`.

**Identity model:**
- **Guest:** `crypto.randomUUID()` stored in localStorage (`zemlo_guest_cart_id`), sent as `x-guest-id` header — powers the server-backed guest cart.
- **Admin:** bearer token from backend `/auth/login`, stored in localStorage (⚠️ should become httpOnly cookie — see AUDIT).
- **Customer accounts:** not implemented yet.

---

## 3. Implemented Features ✅

### Storefront
| Feature | Route | Status |
|---|---|---|
| Home page (hero, sections, carousels) | `/` | ✅ Done |
| Shop / catalog grid | `/shop` | ✅ Done — SSR + ISR, URL-based search/category/sort filters (client-side filtering), demo fallback |
| Product detail | `/products/[slug]` | ✅ Done — gallery, variant select, stock states, add-to-cart, dynamic metadata + Product JSON-LD |
| Cart (guest-capable, server-backed) | `/cart` | ✅ Done — qty update, remove, clear, live badge |
| Checkout | `/checkout` | ✅ Done — RHF+Zod address form → order from cart → Stripe Payment Element (client secret) |
| Checkout result pages | `/checkout/success`, `/checkout/failure` | ✅ Done (basic; webhook finalizes order) |
| Legal shell pages | `/privacy`, `/terms`, `/shipping`, `/returns`, `/impressum` | 🟡 Shell done, **placeholder text** |
| Content pages | `/contact`, `/blog`, `/story` | 🟡 Placeholder widget only |

### Admin
| Feature | Route | Status |
|---|---|---|
| Admin login (RBAC gate, 7-role permission map) | `/admin/login` | ✅ Done (client-side guard only) |
| Products list + archive | `/admin/products` | ✅ Done |
| Product create / edit (pricing, stock, media URLs, SEO, shipping dims, Zod rules) | `/admin/products/new`, `.../edit` | ✅ Done (no variants, no image upload) |
| Dashboard | `/admin` | 🟡 Static placeholder card |

### Platform / SEO / quality
- Global metadata + OpenGraph/Twitter (`layout.tsx`), per-product `generateMetadata`
- Dynamic `sitemap.xml` (all product URLs) + `robots.txt` (blocks `/admin`, `/checkout`)
- Organization / WebSite / Product JSON-LD
- Loading skeleton, error boundary, 404 page for the public route group
- Fully typed API surface regenerated from OpenAPI (161 generated files)
- Clean `tsc --noEmit` and `eslint` runs

---

## 4. Not Implemented Yet 🚧 (Roadmap)

### 🔴 High priority — blocks a real store launch
1. **Customer auth** — `/login`, `/signup`, `/forgot-password`, `/otp` are static UI stubs (`<form action="">`, no handlers). The Orval-generated `authController*` hooks already exist — wire them up. On login, merge guest cart → user cart.
2. **`middleware.ts` + server-side admin protection** — currently admin pages render first, then a client `useEffect` redirects. No middleware file exists at all.
3. **Auth token storage** — move bearer token from localStorage to httpOnly cookie (XSS exposure).
4. **Orders (customer)** — no order history, no `/orders/[id]`, success page only echoes `orderId`.
5. **Currency consistency** — UI money formatters hardcode **USD**; config/JSON-LD use **EUR** (`defaultMarket`). Centralize on one formatter driven by `defaultMarket.currency`.
6. **Real legal content** — impressum/privacy are legally required for the DE market; current text is placeholder.

### 🟠 Medium priority
7. **Server-side pagination + filtering** for `/shop` — currently the whole catalog is fetched and filtered in memory; "newest" sort compares IDs, not dates.
8. **Admin orders UI + dashboard metrics** — backend APIs are already generated; no screens exist.
9. **Product variants in admin** — `hasVariants` is hardcoded `false` in form mappers; variants can't be created from the UI (storefront can already display them).
10. **Image uploads** (Cloudinary/S3) — admin media is URL-paste only.
11. **Account area** — profile, address book, wishlist.
12. **Category pages** — `/categories/[slug]` exists in `routes.ts` config but has no page. Also `routes.auth.register` points to `/register` but the page is `/signup` (mismatch).
13. **Checkout polish** — shipping-method selection; handle `redirect_status=failed` on the success return URL (failure page is currently unreachable in the normal flow).

### 🟡 Engineering hygiene
14. **Tests** — none exist. Add Vitest + React Testing Library (mappers, cart hooks, checkout schema) and Playwright (checkout E2E).
15. **CI** — no `.github/workflows`. Add: install → lint → `tsc --noEmit` → build.
16. **`.env.example`** — no env file is committed; the env contract is undocumented (see §6 below, then commit it as `.env.example`).
17. **De-duplication / dead code** — see AUDIT.md §Cleanup: two API error classes, two `formatMoney` copies, two proxy styles, legacy `src/components/` vs `src/shared/ui`, commented-out root layout, empty validation file, leftover `console.log`.
18. **Security tightening** — `next.config.ts` allows images from **any** https host; restrict `remotePatterns` to your real image CDN.

---

## 5. Getting Started

```bash
npm install
# create .env.local (see table below)
npm run api:generate   # optional: regenerate API client from OpenAPI spec
npm run dev
```

Requires Node 20+ and a running Zemlo backend (local NestJS on :3000, or the hosted instance).

### Scripts
| Command | Purpose |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run api:generate` | Regenerate typed API client (Orval) |

---

## 6. Environment Variables

| Variable | Scope | Description |
|---|---|---|
| `API_BASE_URL` | server | Backend base URL (default `http://localhost:3000`) |
| `DEMO_CATALOG_ENABLED` | server | `true` → show 12 demo products when catalog is empty/unreachable |
| `ORVAL_API_SPEC_URL` | build | OpenAPI spec URL for `api:generate` (default: hosted backend `/api-json`) |
| `NEXT_PUBLIC_SITE_URL` | client | Canonical site URL (SEO metadata, Stripe return URLs) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | client | Stripe publishable key (required for checkout payment step) |
| `NEXT_PUBLIC_APP_NAME` | client | App display name |
| `NEXT_PUBLIC_DEFAULT_MARKET` / `NEXT_PUBLIC_APP_COUNTRY` / `NEXT_PUBLIC_APP_CURRENCY` / `NEXT_PUBLIC_APP_LOCALE` | client | Market defaults (currently DE / EUR / de-DE; only `de` market enabled) |

---

## 7. Key Directories Cheat-Sheet

| Path | What lives there |
|---|---|
| `src/shared/api/axios-instance.ts` | Browser axios client + auth/guest-id interceptor |
| `src/shared/api/generated/` | Orval-generated typed client (do not hand-edit) |
| `src/app/api/backend/[...path]/route.ts` | Generic reverse proxy → backend |
| `src/lib/api/backend.ts` | Server-only fetch + `proxyToBackend` (admin routes) |
| `src/shared/config/` | routes, markets, storage keys, stripe, query defaults, env readers |
| `src/features/cart/hooks/use-cart.ts` | Cart queries + mutations |
| `src/features/checkout/CheckoutPage.tsx` | Whole checkout flow |
| `src/features/admin/` | Admin auth (session, RBAC) + product CRUD |
| `src/shared/seo/` | sitemap, robots, JSON-LD builders |
| `orval.config.ts` | API client generation config |

---

## 8. Related Documents

- [ARCHITECTURE.md](ARCHITECTURE.md) — layering rules, API conventions, migration plan
- [AUDIT.md](AUDIT.md) — full audit: every known issue with file:line references and fixes
- `Zemlo Style Guide & Design System.md` (repo root) — visual design system
