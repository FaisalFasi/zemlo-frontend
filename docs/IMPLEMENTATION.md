<!--
═══════════════ EXPLANATION (is change ki wajah) ═══════════════
YE KYA HAI: Aapki quick-reference file — poore project ka implementation
summary ek jagah: kya ban chuka hai, flow kaise chalta hai, kaunsi file
kahan hai. Har phase mukammal hone par main isay update karunga.
REASON: Aapne kaha tha "later me quickly smj skn k mera project ka
architecture or flow kya hai" — ye wohi file hai. To-the-point, har
cheez 1-2 lines.
RISK: Zero — sirf documentation.
═════════════════════════════════════════════════════════════════
-->

# Zemlo — Implementation Notes (Quick Reference)

> One page to remember how everything works. Updated after every phase.
> Detail docs: [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) · [ROADMAP.md](ROADMAP.md) · [AUDIT.md](AUDIT.md)
> Last updated: 2026-08-16 (Phase 6 — admin dashboard bug-fix pass)

---

## The Big Picture

```
Browser
  │
  ├─ Server pages (shop, product) ──────────► backend directly (API_BASE_URL)
  │                                            cached 5 min (ISR)
  │
  └─ Client data (cart, orders, auth) ─ axios ─► /api/backend/[...path] proxy
                                                  │  attaches:
                                                  │  • customer token (from httpOnly cookie)
                                                  │  • x-guest-id header
                                                  ▼
                                              NestJS backend (zemlo-store)
```

**Golden rule:** the browser NEVER holds an auth token. Tokens live in
httpOnly cookies; Next.js route handlers / the proxy attach them server-side.

---

## Auth (Phase 1 + 2)

| Who | Cookie | Login route | Guarded by |
|---|---|---|---|
| Admin | `zemlo_admin_session` | `POST /api/admin/auth/login` | `middleware.ts` (/admin/*) + AdminShell role check |
| Customer | `zemlo_customer_session` | `POST /api/auth/login` / `register` | `middleware.ts` (/account/*) |

- Both flows share the same helpers: `src/lib/auth/session-cookies.ts` (cookie factory) + `session-auth-routes.ts` (login/me/logout handlers).
- Logout revokes the backend DB session, then clears the cookie.
- `middleware.ts` = first gate (cookie presence, redirects). Real authorization = backend JWT check. Signed-in users get bounced away from /login & /signup.
- Customer state in React: `useCurrentCustomerQuery()` (`features/auth/hooks/use-customer-auth.ts`); navbar shows account icon + green dot when signed in.

## Guest → User Cart Merge (Phase 2)

On login/register: snapshot guest cart → sign in → replay items into user cart → clear guest id → refetch. (Backend has no merge endpoint; owner resolution prefers userId.) Code: `features/auth/lib/merge-guest-cart.ts`.

## Cart (server-backed, guests included)

- Identity: `x-guest-id` UUID from localStorage (guests) or session cookie (users).
- State: TanStack Query only — key `["cart","current"]`, hooks in `features/cart/hooks/use-cart.ts`.
- **Optimistic updates** (Phase 3): update/remove/clear apply to the cache instantly, roll back on error. Add-to-cart stays server-first (needs product data).

## Image safety (2026-07-20 hardening)

- **`shared/lib/safe-image-url.ts`** — `getSafeImageUrl(url, fallback)` is the ONE place that checks a backend-sourced image URL against `shared/config/image-hosts.ts` (also used by `next.config.ts`, so there's a single allowlist, not two). Returns the fallback instead of letting `next/image` crash on an unlisted host.
- **`entities/product/model/product-utils.ts`** — `resolveBestProductImage()` is the ONE "pick the best image from a product's images/variants" chain, used by both `entities/product` (shop, product detail) and `components/home` mappers (previously two copies of the same logic with two different fallback images — now one).
- Applied at every image entry point: product card, product detail gallery, cart line item, home page cards/categories.
- **Error boundaries:** `(admin)/error.tsx` (didn't exist before — an admin crash had nowhere to land but the raw Next.js error overlay), root `not-found.tsx`, root `global-error.tsx` (last-resort net if the root layout itself throws).

## Category & Brand Admin Management (Phase 6, 2026-08-16)

- `/admin/catalog` page renders `AdminCategoriesManager` + `AdminBrandsManager` (`src/features/admin/catalog/`) — full CRUD (create/edit/delete) with RHF forms + validation, list/error/empty/loading states.
- Proxy routes `/api/admin/categories*` and `/api/admin/brands*` (GET/POST/PATCH/DELETE) attach the admin token via `proxyToBackend`, same pattern as products/orders.
- `hooks/use-admin-catalog.ts` wraps TanStack Query mutations; `api/admin-catalog-api.ts` wraps generated Orval calls; types in `types/admin-catalog.types.ts`.
- Nav: `AdminShell` sidebar has a "Categories & brands" link.

## RBAC UI Gating (Phase 6, 2026-08-16 — revised same day once real backend permissions were confirmed live)

**First pass (superseded):** started with a hand-maintained `admin-permissions.ts` — a hardcoded role→permission map for 7 invented frontend roles. Worked, but was a second source of truth for authorization data the backend already computes.

**Current, real version:** `GET /auth/me` returns the backend's actual resolved permission list — `user.permissions: string[]`, real values like `"products.update"`, `"orders.view_all"` (verified directly against the live `/api-json` spec, not assumed). The frontend now reads that array directly; `admin-permissions.ts` is deleted.

- **`features/admin/auth/types/admin-auth.types.ts`** — `AdminRole` matches the backend's real 4-value enum (`CUSTOMER | STAFF | ADMIN | SUPER_ADMIN`, not 7 invented ones). `AdminPermission` is a literal union of the backend's real permission strings (`products.view/create/update/delete`, `categories.*`, `brands.*`, `orders.view_own/view_all/update/cancel`, `customers.*`, `staff.*`, `settings.*`, `analytics.view`) — for typo-safety/autocomplete, not a second authorization source (the values themselves come from the backend response, this union just types them).
- **`features/admin/auth/hooks/use-admin-auth.ts`** — the ONE place admin identity/authorization logic lives now: `useCurrentAdminQuery()` (shared cache, see below), `hasAdminPermission(user, permission)` (`user.permissions.includes(permission)` — no lookup table), `canAccessAdmin(user)` (`role !== "CUSTOMER"` — any staff-or-above role may open the panel; per-action permissions gate what they can do inside it), and `useAdminPermission(permission)` for components.
- Gated surfaces (same UI behavior as before, just correct permission strings now): product create/edit/archive (`products.create` / `products.update` / `products.delete` — the backend's archive route is literally `DELETE`, despite being a soft-archive); variants add/edit/delete (`products.update`); categories add/edit/delete now check `categories.create`/`categories.update`/`categories.delete` **separately** (previously one combined `categories:manage` — the backend has always been this granular, e.g. a role could theoretically have `categories.update` without `categories.delete`); brands the same (`brands.create`/`update`/`delete`); order status + shipping forms (`orders.update`).
- **Pattern going forward:** never hand-maintain a role→permission map again. If a new action needs gating, use the exact backend permission string from `AdminPermission` (add it to that union if it's missing) and call `useAdminPermission(key)` — the backend's `/auth/me` response is the only source of truth.

## Admin Dashboard Bug-Fix Pass (Phase 6, 2026-08-16)

User reported real bugs while testing locally (a crash on "Save status", every product image showing as a gray placeholder, "nothing works 100%"). Ran a 4-way audit across products/variants, categories/brands, orders, and auth/shell — full findings not reproduced here, but the fixes:

**Root cause of the reported crash — not a browser extension, a real regression:**
`getCurrentAdminUser()` (`features/admin/auth/api/admin-auth-api.ts`) used to collapse ANY non-2xx response — a real 401 **or** a transient 5xx/network blip — into `return null`. Since `useCurrentAdminQuery()` is shared by `AdminShell` and every `useAdminPermission()` check across the whole admin panel, a single transient hiccup made the query "succeed" with `null`, which `AdminShell` treated as a confirmed logout — unmounting the entire admin subtree (mid-click, mid-mutation) and redirecting to `/admin/login`. Because the redirect only cleared the cookie `if (user)` (false in this path), the cookie survived and middleware bounced straight back to `/admin`, looping. **Fix:** `getCurrentAdminUser` now returns `null` ONLY for a real 401 and throws for anything else, so a transient error is a query **error** (previous cached user untouched) instead of a fake "success with null". `AdminShell` now has three distinct states — loading / confirmed-unauthorized / unverifiable-but-not-logged-out (shows a "Try again" retry, doesn't tear down the panel or redirect) — and always clears the cookie + the admin-auth query cache before bouncing to login (fixes the loop for genuine expired sessions too, and stops stale identity/permissions surviving a re-login).

**Other fixes, by area:**
- **Shared:** `getErrorMessage()` (`shared/lib/http.ts`) no longer shows a raw HTML gateway-error page (e.g. Render cold-start 502s) verbatim in an error banner — falls back to the generic message instead.
- **Backend proxy:** `readBackendResponse()` (`lib/api/backend.ts`) now special-cases 204/205/304 — constructing a `Response` with any body (even `""`) on those statuses throws per the Fetch spec, so every DELETE proxying a 204 (categories, brands) was failing outright.
- **Categories/Brands:** clearing Description (or Website, for brands) on **edit** used to silently no-op — `"" → undefined` drops the key from a PATCH, which means "leave unchanged." Now sends the trimmed value as-is. Delete errors are now shown (previously swallowed — no `onError` anywhere). Edit/Delete/Add are disabled while any mutation for that manager is in flight (previously switching targets mid-save let the first save's `closeForm()`/error land on whatever the form had since been repointed to). `products?.length ?? 0` guards against one malformed record blanking the whole page.
- **Products:** archiving now has a try/catch (an unhandled rejection there was surfacing as a full dev-overlay "crash"). Product list has a real error state (was falling into the empty-state "no products yet" CTA on a fetch failure). Price field: `Number("")` is `0`, not `NaN` — an empty Price silently saved as €0.00 with no validation error; now forced through the invalid branch. **Editing any product no longer deletes its other images** — the form only ever edits one image slot, but used to replace the whole `images` array on every save; now the non-default images are preserved.
- **Variants:** stock now requires a whole number (was accepting `2.5`). A variant with no price override (`price: null`, inheriting the base product's price) can now be edited (name/SKU/stock) without being forced to set an explicit price — blank price on **edit** just omits the key.
- **Orders:** clearing Carrier/Tracking on the shipping form had the same silent-no-op bug as categories/brands, fixed the same way. The status/shipping forms now resync their local state after a successful save (previously the dropdowns kept showing what was clicked, not what actually persisted). Stale "Status updated."/error banners now clear the moment the admin changes a field again (previously lingered until the next submit). Dashboard revenue sum now coerces `order.total` the same way `formatMoney` does (a numeric-string total would have silently summed as `"0" + "49.99"` string concatenation, quietly showing €0.00); `PROCESSING` orders now count toward "Needs action" (they didn't, despite being reachable from the admin's own status dropdown). `/admin/orders/[orderId]` no longer crashes on a malformed `%` in the URL segment.

**Known, deliberately deferred** (lower severity / bigger redesign, not urgent for a single-owner store): full order-status cross-field validation, a confirm step before destructive status transitions (CANCELLED/REFUNDED), a lost-update race if Status and Shipping are saved within the same ~30s window (last response wins in the cache, not a merge), and 3 dead/unused files under `features/admin/products/` (`FormFieldError.tsx`, `ProductFieldLabel.tsx`, `validation/admin-product-form-validation.ts`) safe to delete whenever someone's touching that area anyway.

## Admin CRUD Manager Pattern (Phase 6, 2026-08-16) — the standard for any new admin list+form screen

Categories, brands, and variants managers were near-duplicate ~300-line files (list/skeleton/error/form-state/save-cancel all copy-pasted). Extracted the repeated pieces once — **reuse these for any future admin CRUD screen (e.g. tags, coupons) instead of copy-pasting a manager again:**

- **`features/admin/lib/use-admin-entity-form.ts`** — `useAdminEntityForm<TForm>(emptyForm)`: the "closed / adding / editing-id" state machine (`editingId`, `isNew`, `isOpen`, `form`, `formError`, `openAddForm`, `openEditForm`, `closeForm`). Generic over the form shape, so any entity can use it as-is.
- **`features/admin/components/AdminEntityListSkeleton.tsx`** / **`AdminEntityLoadError.tsx`** / **`AdminFormActions.tsx`** — shared loading rows, "could not load X — Try again", and the Save/Cancel button row with spinner.
- **`features/admin/lib/admin-form-styles.ts`** — `adminInputClassName` / `adminTextareaClassName`, the one place inline-form field styling is defined.
- **`features/admin/catalog/lib/catalog-confirm.ts`** — `buildCatalogDeleteConfirmMessage()`, the shared "delete this + product-count warning" copy for categories/brands.
- **`features/admin/catalog/hooks/use-admin-catalog.ts`** — `createAdminCatalogResourceHooks()`, a factory that builds list-query + create/update/delete-mutation-with-invalidate hooks for any top-level catalog resource; categories and brands are both one call into it.
- **Not unified (deliberately):** `use-admin-variants.ts` keeps its own hooks — variant mutations also invalidate the parent product's cache (`hasVariants` changes), a genuinely different shape from the catalog factory, not just copy-paste.

## Backend Integration Wave (Phase 5B/6/2, 2026-08-17)

Backend shipped 5 things at once (`zemlo-backend`'s `FRONTEND_INTEGRATION_NOTES.md`, copied into this repo). Verified live against `/api-json` before building anything (a first check found them NOT deployed yet — don't trust that doc's claims without re-checking `git diff src/shared/api/generated` after `npm run api:generate`).

- **Catalog pagination (closes Phase 5B) — `GET /products` is now `{items, total, page, limit, pageCount}`, not a plain array.** `features/catalog/api/catalog-api.ts` has two functions: `getCatalogProductsPage(query)` — the raw paginated shape; `getAllCatalogProducts()` — loops every page (`limit: 100`) and flattens to an array, used where the WHOLE catalog is genuinely needed (home page sections, sitemap, and the shop's category-count computation — see "Paginated Shop UI" below). The `/shop` grid itself now uses `getCatalogProductsPage()` directly — real server-side pagination, not fetch-everything-then-filter.
- **Cart merge — `POST /cart/merge`.** Replaced the old "snapshot the guest cart, sign in, replay every item one-by-one" workaround (`features/auth/lib/merge-guest-cart.ts`) with a single call to the new endpoint (keyed off the `x-guest-id` header, attached automatically by the axios interceptor). Called unconditionally right after login/register in `use-customer-auth.ts` — a no-op if there's nothing to merge.
- **Admin dashboard stats — `GET /admin/stats`.** `AdminDashboardStats.tsx` no longer fetches the full orders list and counts client-side (didn't scale) — it calls the real endpoint (`useAdminStatsQuery`, gated on the `analytics.view` permission — STAFF doesn't have it, sees a permission message instead of the cards). Cards changed meaning: was all-time totals + a "needs action" count; now `ordersToday` / `revenueToday` / `lowStockCount` (a genuinely new metric nothing showed before). Proxy route: `/api/admin/stats` (same `proxyToBackend` pattern as every other admin route).
- **Forgot/reset password (closes the Phase 2 DEFERRED item).** New pages `/forgot-password` (`ForgotPasswordForm`) and `/reset-password` (`ResetPasswordForm`, reads `?token=` from the URL on mount — not during render, to avoid an SSR/hydration mismatch). Both call the generated auth client directly (`authControllerForgotPassword`/`ResetPassword`) — these are public endpoints, no cookie/token involved, so they don't need a dedicated proxy route the way admin endpoints do (client-side axios already routes through `/api/backend/[...path]` automatically). Forgot-password always shows the same generic "check your email" success message regardless of whether the account exists — the backend deliberately doesn't distinguish, so the UI must not either. Reset-password shows "sign in again" on success (backend invalidates every session for that user). "Forgot password?" linked from `LoginForm`.
- **Real image upload — `POST /admin/uploads/image`.** This one COULDN'T use the generated client directly the way forgot/reset-password could: admin auth is a *different* cookie (`zemlo_admin_session`) than the customer-session proxy the generated axios client is wired to, and it's the browser's own `/api/backend` catch-all proxy that only ever forwards the *customer* cookie. New dedicated route `/api/admin/uploads/image` (`route.ts`) parses the incoming `multipart/form-data` via `request.formData()`, re-packages the file into a fresh `FormData`, and forwards it with the admin bearer token — the generic `proxyToBackend`/`adminApiRequest` JSON-only path can't carry a file. `adminApiRequest` (`features/admin/lib/admin-api-request.ts`) got a small extension: skips JSON-stringifying/Content-Type when the body is a `FormData` instance. UI: `AdminProductForm.tsx`'s Media section got an "Upload" button (native file input, hidden, triggered via a ref) next to the existing Image URL field — uploading fills the URL field with the returned Cloudinary URL; manually pasting a URL from an allowed host still works as a fallback. `res.cloudinary.com` added to `ALLOWED_IMAGE_HOSTS`.

## Paginated Shop UI (Phase 5B, 2026-08-17)

`/shop` and `/categories/[slug]` now do real server-side pagination/search/sort instead of fetching the whole catalog and filtering in the render.

- **`features/shop/lib/get-shop-data.ts`** — `getShopPageData(params)` (replaces the old `getSafeShopData()`) calls `getCatalogProductsPage({ page, limit: 24, search, category, sort })` for the grid, PLUS a separate `getAllCatalogProducts()` call just for category-rail counts (the public `/categories` endpoint has no per-category count — this is a deliberate, cheap-at-this-scale tradeoff, cached by the same 5-minute ISR as everything else on the page, not a "fetch everything then filter" regression). Demo-catalog fallback (real catalog empty + flag on) still uses the old in-memory `filterAndSortShopProducts` + manual pagination, since demo data is a small static array that never hits the backend.
- **`ResolvedShopSearchParams`** gained a `page: number` field (`shop-filters.ts`'s `resolveShopSearchParams`/`createShopHref` updated to match — changing any filter resets to page 1 unless a page number is explicitly passed, which is exactly what the new `ShopPagination` component's Previous/Next links do).
- **Category pages get their own pagination/search/sort** — the route's slug is the fixed category (a stray `?category=` in the query string can't override it), everything else works the same as `/shop`. `ShopFilters`/`ShopPagination` take a `basePath` prop (`"/categories/kitchen"` instead of `"/shop"`) so navigating within a category page stays on that URL instead of jumping to `/shop?category=...`.
- **Not built:** a brand filter in the UI (the API supports `?brand=`, nothing calls it yet) and page-number links beyond Previous/Next (fine at this catalog's scale — revisit if `pageCount` regularly exceeds ~5-10).

## Fixed: `notFound()` returning HTTP 200 instead of 404 (2026-08-17)

**Found while testing the paginated shop UI, but pre-existing since Phase 5A — affected `/products/[slug]` too, untouched by this change.** This is a confirmed upstream Next.js bug (vercel/next.js#75543, #77235, #82041): when a route has a `loading.tsx` in its ancestry (even inherited from a route-group root), Next.js starts streaming the response as `200` before an in-page `notFound()` call can be evaluated — the correct "Page not found" UI renders, but the HTTP status stays `200`, which real browsers don't notice but search engines and any status-aware tooling do (an indexable "200 OK" 404 page is a real SEO defect).

**Root cause found by testing, not guessing:** verified with `curl -D -` against a production build (`next build && next start`) — both `/products/[slug]` and `/categories/[slug]` (the only two routes that call `notFound()`) returned `200` for a nonexistent slug; `/shop` and `/` (no `notFound()` calls) were unaffected. The trigger was `(public)/loading.tsx` — a route-group-level loading skeleton that Next.js applies to every page below it, including the two that call `notFound()`.

**Fix:** moved `(public)/loading.tsx` → `(public)/shop/loading.tsx` — scoped to the one page that both needs a loading skeleton and never calls `notFound()`. `/products/[slug]` and `/categories/[slug]` now render without any ambient `loading.tsx`, so their status code resolves correctly (404 confirmed via the same `curl -D -` check post-fix). **Tradeoff:** the home page (`/`) also lost its blanket loading skeleton as a side effect (route groups can't selectively cascade `loading.tsx` to some children and not others) — a minor UX regression, fixable later with a page-level `<Suspense>` boundary inside `HomePage.tsx` instead of a route-level `loading.tsx`, but not done here since it's a separate, non-trivial restructuring.

## Catalog & Category Pages (Phase 5A)

- Shop data loading lives in ONE place: `features/shop/lib/get-shop-data.ts` (products + categories + demo-catalog fallback) — used by `/shop` AND `/categories/[slug]`.
- Category pages: `/categories/[slug]` — per-category SEO metadata (`generateMetadata`), `notFound()` for bad slugs, ISR 5 min; renders `ShopPage` with `heading`/`description` props.
- `/products` redirects to `/shop`. Navbar search icon goes to `/shop` (a `/search` page never existed).
- Image fallback: `public/images/product-placeholder.png` (local, generated) — never a third-party URL. Fallback constants: `entities/product/model/product-utils.ts`.
- **Scale limits (known):** filtering/sort/pagination are still client-side because the backend `GET /products` takes no query params. The ready-made backend spec lives in [BACKEND-TODO.md](BACKEND-TODO.md) — after it ships: `npm run api:generate`, adapt `catalog-api.ts` + shop + sitemap, add pagination UI.

## Money (Phase 3)

- ONE formatter: `shared/lib/formatters.ts` → `formatDefaultMoney()` / `formatMoney()` / `formatDefaultDate()`.
- Currency/locale come from `shared/config/markets.ts` (`defaultMarket` = DE / EUR / de-DE → "49,99 €").
- Never hand-write `Intl.NumberFormat` in components.

## Checkout + Payments (Phase 3)

```
/checkout form (RHF+Zod) ─► POST /checkout/from-cart ─► order + Stripe clientSecret
        ─► <PaymentElement> ─► stripe.confirmPayment(return_url=/checkout/success)
        ─► /checkout/success: CheckoutResultPanel asks STRIPE for the real
           PaymentIntent status (never trusts URL params)
              succeeded → success UI · processing → info UI
              failed/canceled → redirect /checkout/failure
        ─► backend webhook finalizes the order (source of truth)
```

- Shipping: backend computes flat cost + free-over threshold (no selectable methods yet).

## Orders (Phase 4)

**Customer side:**
- Pages: `/account/orders` (history list) · `/account/orders/[orderNumber]` (detail: items, totals, address, tracking). Both noIndex + middleware-protected.
- Feature: `src/features/orders/` — `api/orders-api.ts` (wraps generated `ordersControllerFindMyOrders` / `...ByOrderNumber`), `queries/`, `hooks/use-orders.ts`, `lib/order-status.ts` (status code → label + badge color, exhaustive via `Record<OrderStatus,...>`), components `OrdersList` / `OrderDetailPanel` / `OrderStatusBadge`.
- Order detail renders the order **snapshot** (productName/prices saved at purchase) — editing products later never rewrites old receipts. Totals come from backend, never recalculated.
- Account page (`AccountPanel`) links to orders.

**Admin side:**
- Pages: `/admin/orders` (table) · `/admin/orders/[orderId]` (fulfilment view: customer contact, items/totals, address, status history, update forms).
- Proxy routes `/api/admin/orders*` (GET list/detail, PATCH `/status`, PATCH `/shipping`) — attach the admin token from the httpOnly cookie via `proxyToBackend`, same as admin products.
- Feature: `src/features/admin/orders/` — `api/admin-orders-api.ts` (via `adminApiRequest`), `hooks/use-admin-orders.ts` (update mutations sync detail cache + invalidate list), components `AdminOrdersTable` / `AdminOrderDetailPanel` / `AdminOrderUpdateForms` / `AdminDashboardStats`.
- Status badges reused from `features/orders` — one status mapping everywhere.
- Dashboard (`/admin`) shows total orders / needs-action / paid revenue, computed **client-side** from the orders list (backend has no stats endpoint yet — needed at scale).

---

## Testing & CI (Phase 8)

- **Unit tests:** Vitest (`npm test` / `npm run test:watch`), config in `vitest.config.ts` (node env, `@/` alias). 40 tests across 6 files: money/date formatters (EUR de-DE lock), `safe-redirect` (open-redirect security), shop filter/sort logic, auth password schemas (mirror backend rules), order-status fallback, `safe-image-url`/`isAllowedImageUrl` (image-host allowlist).
- **Convention:** test files live NEXT TO the code they test (`foo.ts` → `foo.test.ts`) — start with pure logic; add jsdom + React Testing Library only when component tests arrive.
- **CI:** `.github/workflows/ci.yml` — every push/PR runs `npm ci` → lint → typecheck → test → build. Red = don't merge.
- **Security state (2026-07-19):** swiper critical fixed, Next bumped 15.5.9→15.5.20 (DoS patches). 2 moderate remain in Next's bundled postcss (build-time transitive — accept until next Next release; NEVER `npm audit fix --force`, it downgrades Next to v9).

## Conventions (follow these when adding code)

1. **Layers:** `app/` = thin routes only → `features/<name>/{api,hooks,queries,components,lib,schemas}` → `entities` → `shared`. Components never import Orval-generated code directly — always via a feature `api/` wrapper.
2. **Data fetching:** client = TanStack Query (keys centralized in `queries/`); server pages = fetch helpers in `src/lib/api`.
3. **Every data screen has 4 states:** loading skeleton / error + retry / empty + CTA / data.
4. **Forms:** react-hook-form + Zod schema matching backend validation (`features/*/schemas/`).
5. **Status/enum display:** map raw codes to labels in one `lib/` file per feature (see `order-status.ts`).
6. **Personal pages:** `noIndex: true` + middleware protection.
7. **Env contract:** documented in `.env.example` — add every new var there.
8. **Before adding a new admin CRUD screen or list+form pattern:** check "Admin CRUD Manager Pattern" above first — reuse `useAdminEntityForm`, `AdminEntityListSkeleton`/`AdminEntityLoadError`/`AdminFormActions`, `admin-form-styles.ts` instead of writing another near-duplicate manager.
9. **Before adding a new admin-gated action:** check "RBAC UI Gating" above — reuse/extend `admin-permissions.ts` + `useAdminPermission()`, don't invent a second permission-checking mechanism.

## Key Files Cheat-Sheet

| What | Where |
|---|---|
| Middleware (route guards) | `src/middleware.ts` |
| Session cookies + auth handlers | `src/lib/auth/session-cookies.ts`, `session-auth-routes.ts` |
| Backend proxy (browser traffic) | `src/app/api/backend/[...path]/route.ts` |
| Axios + interceptors | `src/shared/api/axios-instance.ts` |
| Money/date formatting | `src/shared/lib/formatters.ts` |
| Markets/locale/currency | `src/shared/config/markets.ts` |
| Route constants | `src/shared/config/routes.ts` |
| Regenerate API client | `npm run api:generate` (orval.config.ts) |

## Phase Log

- **Phase 1** (2026-07-13): httpOnly admin session, middleware, 401 interceptor, image-host allowlist, `.env.example`
- **Phase 2** (2026-07-14): customer auth (login/signup/account), shared session helpers, proxy auth, guest-cart merge, legacy UI kit deleted
- **Phase 3** (2026-07-14): single EUR formatter, Stripe-verified success page, reachable failure page, optimistic cart
- **Phase 4** (2026-07-14): customer order history + detail; admin orders table + fulfilment view (status/shipping updates, history) + dashboard stats; admin nav Orders link (duplicate "Add product" removed)
- **Phase 5A** (2026-07-19): category pages with per-category SEO, shared shop-data loader, `/products`→`/shop` redirect, navbar search 404 fix, local placeholder image; **5B (server-side pagination/search) blocked on backend** — spec in BACKEND-TODO.md
- **Phase 8 part 1** (2026-07-19): Vitest + 31 unit tests, GitHub Actions CI (lint/typecheck/test/build on every push/PR), security fixes (swiper critical, Next 15.5.20). Remaining: Playwright E2E, component tests, dedupe sprint
- **Phase 6 part 1** (2026-07-19): admin **variants manager** on the product edit page (`AdminVariantsManager` + `/api/admin/products/[id]/variants*` proxies + api/hooks in `features/admin/products/`); fixed `hasVariants: false` hardcode (backend owns the flag — it recalculates on variant changes, so never send it); ARCHIVED status round-trip + restore; mapper file typo renamed.
- **Phase 6 part 2** (2026-08-16): image-host crash fix (`safe-image-url.ts`, `resolveBestProductImage()`, error boundaries for `(admin)`/root/global — see "Image safety" above) + **category/brand admin management** (`/admin/catalog`, `features/admin/catalog/**`, see section above).
- **Phase 6 part 3** (2026-08-16): **RBAC UI gating** (per-action permission checks, see section above) + **admin CRUD manager dedup** — categories/brands/variants managers were ~300-line near-duplicates; extracted shared form-state hook, list/error/save-cancel components, input styles, and a catalog-hooks factory (see "Admin CRUD Manager Pattern" above). This is now the standard for any future admin list+form screen — don't re-derive it. Remaining in Phase 6: image upload (backend batch).
- **Phase 6 part 4** (2026-08-16): **admin dashboard bug-fix pass** — 4-way audit (products/variants, categories/brands, orders, auth/shell) surfaced a real crash-causing regression in the shared admin-auth query plus ~15 correctness/validation/error-handling bugs across the admin panel; see "Admin Dashboard Bug-Fix Pass" above for the full list and root causes.
- **Phase 6 part 5** (2026-08-16): responsive admin sidebar (hamburger + `Sheet` drawer below `lg`, reusing the same primitive the storefront's mobile nav already uses — `AdminMobileNav`/`AdminNavLinks`, one nav-item list instead of two); a per-admin-crash-resilience `AdminSectionErrorBoundary` wraps order forms / catalog managers / product+variants forms so a rendering hiccup in one section shows an inline "Try again" instead of taking down the whole page; an admin "Discount" control (checkbox + %, computes `compareAtPrice` — no backend change, reuses the existing discount-badge mechanism) replaced the raw "Compare at price" number input; a "-X%" indicator was added to the admin products table.
- **Phase 6 part 6** (2026-08-16): **RBAC now reads real backend permissions** — see the revised "RBAC UI Gating" above. Backend confirmed (via `zemlo-backend`'s own `FRONTEND_INTEGRATION_NOTES.md`, cross-checked directly against the live `/api-json` spec, not assumed) that `/auth/me` already returns `user.permissions: string[]`. Deleted the hand-maintained `admin-permissions.ts` role→permission map entirely. **Verified NOT yet live on the reachable backend at the time:** catalog pagination, `/admin/stats`, `POST /cart/merge`, forgot/reset-password, `/admin/uploads/image` — despite the integration notes describing them as already shipped. User pushed the backend to `main` the same day; redeployed and confirmed live (see next entry).
- **Phase 5B + 6 + 2 (backend integration wave)** (2026-08-17): backend redeployed with pagination, cart-merge, admin-stats, forgot/reset-password, and image-upload all live (verified against `/api-json` directly — 47 paths, up from 42). Integrated all five in one pass — see "Backend Integration Wave" above.
- **Phase 5B part 2 — paginated shop UI** (2026-08-17): `/shop` and `/categories/[slug]` now use real server-side pagination/search/sort (`getCatalogProductsPage()`) instead of fetching the whole catalog — see "Paginated Shop UI" above. This closes Phase 5B completely. Found and fixed a real, pre-existing bug while testing: `notFound()` was returning HTTP 200 instead of 404 on `/products/[slug]` and `/categories/[slug]` (a confirmed upstream Next.js bug triggered by a route-group-level `loading.tsx`) — see "Fixed: `notFound()` returning HTTP 200" above.
