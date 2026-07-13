# Zemlo Frontend — Full Codebase Audit

> Audit date: 2026-07-13 · Baseline: `main` @ 366bc5b
> Verified: `tsc --noEmit` ✅ clean · `eslint` ✅ clean · No tests exist · No CI exists
> Companion: [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) for the feature/roadmap summary.

Issues are grouped by severity. Each has file references and a recommended industry-standard fix.

---

## 🔴 Critical — fix before any real launch

### C1. Admin auth token stored in localStorage
- **Where:** `src/features/admin/auth/lib/admin-session.ts` (keys in `src/shared/config/storage-keys.ts:5-6`), read by `src/shared/api/axios-instance.ts:45-62`.
- **Problem:** Bearer token + full user object in localStorage → any XSS can exfiltrate an admin session. No expiry handling, no refresh; `logoutAdmin()` only clears localStorage and never calls the backend logout.
- **Fix:** Set the token as an **httpOnly, Secure, SameSite=Lax cookie** from a Next.js route handler on login; read it server-side. Call backend logout on sign-out. Add token-expiry handling (401 → redirect to login).

### C2. No `middleware.ts` — admin protected only client-side
- **Where:** no middleware file exists anywhere; `src/app/(admin)/layout.tsx` is a pass-through; the only guard is `AdminShell.tsx:25-39` (`useEffect` → redirect after mount).
- **Problem:** Admin pages render (and ship their JS) before the client redirect fires. Route protection that runs after paint is not protection.
- **Fix:** Add root `middleware.ts` matching `/admin/:path*` that checks the session cookie (from C1) and redirects to `/admin/login`. Keep backend authorization as the real enforcement layer.

### C3. Customer auth pages are non-functional stubs
- **Where:** `(auth)/login/page.tsx`, `(auth)/signup/page.tsx`, `(public)/forgot-password/page.tsx`, `(public)/otp/page.tsx` — all `<form action="">` with no handlers; OTP page has a leftover `console.log(value)` (`otp/page.tsx:10`).
- **Problem:** Login/signup look real but do nothing. They also use the legacy `CInput`/`CButton` kit instead of `shared/ui`.
- **Fix:** Wire to the already-generated `authControllerRegister/Login/Me/Logout` hooks (`src/shared/api/generated/auth/auth.ts` — currently completely unused). Rebuild with react-hook-form + Zod + `shared/ui` like checkout. Merge guest cart into user cart on login.

### C4. Currency inconsistency (USD vs EUR)
- **Where (hardcoded USD):** `CartLineItem.tsx:14-20`, `CartSummary.tsx:11-17`, `CheckoutCartSummary.tsx:11-17`, `ShopProductCard.tsx:10-16`.
- **Where (EUR):** `src/shared/config/app.ts` / `markets.ts` (`defaultMarket` = DE/EUR), product JSON-LD.
- **Problem:** Customers see `$` in the UI while Stripe charges and structured data say EUR. This is a correctness bug, not cosmetic.
- **Fix:** One `formatMoney` in `shared` driven by `defaultMarket.currency` (also resolves duplicate formatters, see H7). Delete local `Intl.NumberFormat` copies.

### C5. Placeholder legal content in a DE-market store
- **Where:** `/privacy`, `/terms`, `/shipping`, `/returns`, `/impressum` pages; impressum uses `legal@zemlo.example`.
- **Problem:** Impressum + Datenschutzerklärung are legally mandatory in Germany (TMG/DSGVO). Placeholder text = legal exposure the moment the site is public.
- **Fix:** Real content before launch; keep `LegalPageShell` (it's good).

---

## 🟠 High — architectural/product gaps

### H1. No customer order surface
- No order history, no `/orders/[id]`. `/checkout/success` (`success/page.tsx:24`) only echoes `orderId` from the query string and ignores `redirect_status` — a failed redirect still lands on the success page.
- **Fix:** Order detail page fetching order by id; on success page, branch on `redirect_status` and verify payment/order state via API instead of trusting the URL.

### H2. `/checkout/failure` is unreachable in the normal flow
- `StripePaymentForm.tsx:34-48`: `return_url` only points to success; failure shows inline error text only.
- **Fix:** Either route hard failures to `/checkout/failure` or drop the page; handle `redirect_status=failed` on success (see H1).

### H3. Shop has no pagination and filters entirely client-side
- `src/app/(public)/shop/page.tsx` fetches the whole catalog; `shop-filters.ts:31-63` filters/sorts in memory; "newest" sort is `b.id.localeCompare(a.id)` (`:54-56`) — not a date.
- **Fix:** Server-side pagination + filter/sort/search via API query params (backend OpenAPI likely already supports it — check generated `catalogControllerFindProducts` params). Keep URL-based filter state (that part is good).

### H4. Admin cannot create product variants
- `admin-produc-form-mappers.ts:51` hardcodes `hasVariants: false` on every create/update payload, while the storefront fully supports variants (`ProductInfoPanel.tsx:148-168`).
- Also: edit form maps `ARCHIVED` → `DRAFT` (`admin-produc-form-mappers.ts:96`), so archived state can't be round-tripped. Filename typo: `admin-produc-form-mappers.ts` (missing "t").

### H5. Route config drift
- `src/shared/config/routes.ts`: `auth.register` → `/register` but the page lives at `/signup`; `categoryDetail(slug)` → `/categories/[slug]` but no such route exists; `(public)/products/page.tsx` is a bare `<div>Products</div>` stub.
- **Fix:** Make `routes.ts` the single source of truth and delete/redirect the strays.

### H6. Two parallel API stacks + two proxies + two error classes
- Stack A: `src/shared/api/*` (axios + Orval + `ApiClientError` from `shared/config/api-error.ts`).
- Stack B: `src/lib/api/*` (`backendFetch`, `apiFetch`, separate `ApiError` in `lib/api/api-error.ts`).
- Proxies: generic `/api/backend/[...path]` catch-all **and** bespoke `/api/admin/*` routes doing the same job via `proxyToBackend`.
- **Fix:** Pick one server fetch helper + one error type; route admin calls through the generic proxy (or keep admin routes but delete the duplication). Document the browser-vs-server split in ARCHITECTURE.md.

### H7. Duplicate/dead code inventory
| Item | Where |
|---|---|
| Duplicate `formatMoney` | `shared/config/formatters.ts` vs `shared/lib/formatters.ts` (near-identical) |
| Commented-out alternate root layout (~50 lines) | `src/app/layout.tsx:56-107` |
| Empty file (0 bytes) | `features/admin/products/validation/admin-product-form-validation.ts` |
| Never-imported components | `features/admin/products/components/FormFieldError.tsx`, `ProductFieldLabel.tsx` |
| Two OTP implementations | `components/custom/otp` vs `shared/ui/input-otp.tsx` |
| Stray file at shared root | `src/shared/FieldInfo.tsx` (belongs in `shared/forms/` or delete) |
| Unused generated auth hooks | `shared/api/generated/auth/auth.ts` (use them for C3 instead of deleting) |
| Legacy layer | `src/components/**` (home sections, custom kit, vendored `LogoLoop.tsx` with `as any` ×13 + eslint-disables) — migrate per ARCHITECTURE.md then delete |
| "Add product" nav item rendered twice | `AdminShell.tsx:104-110` and `:119-125` |
| Stale "coming next" copy for features that are already built | `CartSummary.tsx:54-56`, `admin/page.tsx:11-14`, `ProductInfoPanel.tsx:236-247` |

### H8. Missing route states outside `(public)`
- Only `(public)` has `loading.tsx` / `error.tsx` / `not-found.tsx`. No **root-level** `not-found.tsx`/`global-error.tsx`; no loading/error boundaries for `(admin)` or `(auth)`; no `loading.tsx` for the async `/shop` and `/products/[slug]` fetches.
- **Fix:** Add root `not-found.tsx` + `global-error.tsx`, and per-group boundaries for admin.

---

## 🟡 Medium — hygiene & hardening

### M1. No tests, no CI
- Zero test files, no test runner, no `.github/workflows`.
- **Fix (minimal industry baseline):**
  1. Vitest + React Testing Library — start with pure logic: `catalog-product-mappers.ts`, `shop-filters.ts`, `checkout.schema.ts`, `use-cart.ts` (with `msw`).
  2. Playwright E2E for the money path: shop → product → cart → checkout (Stripe test mode).
  3. GitHub Actions: `npm ci` → `lint` → `tsc --noEmit` → `test` → `build` on every PR.

### M2. No `.env.example`
- Env contract exists only in code (`shared/config/public.ts`, `server.ts`, `stripe.ts`, `orval.config.ts`). Commit a `.env.example` with every var + comment (see PROJECT_OVERVIEW.md §6).

### M3. `next.config.ts` allows images from any https host
- `images.remotePatterns` hostname `"*"` (line 9). Restrict to your real CDN + Unsplash (until demo data is removed).

### M4. Axios instance has no response interceptor
- `axios-instance.ts` — no 401 handling, no centralized error mapping, no retry/refresh. Add a response interceptor: on 401 clear session + redirect; map errors to `ApiClientError` in one place.

### M5. Hardcoded fallbacks & demo data
- Unsplash fallback images: `CartLineItem.tsx:26`, `ProductImageGallery.tsx:26`, `product-utils.ts:1-5` — replace with a local `/public` placeholder asset.
- Demo catalog (12 products): `features/shop/data/demo-shop-products.ts`, `features/product-detail/data/demo-product-details.ts` — fine for dev (nicely gated by `DEMO_CATALOG_ENABLED`), but ensure the flag is off in production.
- `orval.config.ts:3` hardcodes the production spec URL and `console.log`s it (line 7).

### M6. TypeScript config could be stricter
- `strict: true` is set ✅, but consider adding `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`; drop `allowJs` (no JS sources remain).

### M7. TanStack Query: no SSR hydration
- Server data (shop, product detail) is fetched via plain fetch and passed as props; the query client is browser-only. This is a valid pattern, but if you want cache continuity (e.g. product page → add to cart without refetch), adopt `HydrationBoundary` + `prefetchQuery`. Otherwise document the split explicitly.

### M8. Cart mutations are not optimistic
- `use-cart.ts:37-78` uses `onSuccess: setQueryData` and blocks UI per-item (`CartPage.tsx:24,128`). Acceptable, but for production-feel UX add `onMutate` optimistic updates with rollback (`onError` + `onSettled: invalidate`).

### M9. Checkout gaps
- No shipping-method selection (copy says backend computes it — confirm backend actually does).
- Payment method hardcoded to `STRIPE` (`checkout-mappers.ts:27`) — fine for now, worth an enum-driven UI later.
- Only `checkoutControllerCheckoutFromCart` is used; generated `/checkout/guest` and `/checkout/auth` variants unused (relevant once customer auth exists).

### M10. ARCHITECTURE.md is unfinished and drifted
- `docs/ARCHITECTURE.md` ends mid-thought (stray "# 2. Create src/shared/config/app.ts" block, lines 177-188); mandates Zustand for UI state but Zustand isn't installed; mandates Orval-only API calls but admin auth uses hand-written fetch.
- **Fix:** Update the doc to match reality (or the code to match the doc) — right now it misleads.

---

## ✅ What's genuinely good (keep doing this)

- **Server-first App Router usage** — only 2 `"use client"` files in `src/app`; client boundary pushed down into feature components. Async server pages use try/catch with graceful fallbacks.
- **Typed end-to-end API** via Orval + OpenAPI — regenerable client, tags-split, custom mutator. This is exactly the industry pattern.
- **Server-backed guest cart** with `x-guest-id` — correct architecture (not a localStorage cart).
- **Stripe done right** — Payment Element + client secret from backend, publishable key from env, webhook as source of truth, missing-key handled gracefully.
- **SEO foundation** — dynamic sitemap with product URLs, robots with sensible disallows, JSON-LD (site + product), `noIndex` on checkout results and demo products, canonical/OG metadata helper.
- **FSD layering** (`features/entities/widgets/shared`) with a written architecture contract and a migration plan — rare discipline for a learning project.
- **Zod business-rule validation** in admin forms (compare-at > price, cost-price sanity).
- **Clean `tsc --noEmit` + ESLint** on the whole repo.

---

## Suggested order of work (next 6 milestones)

1. **Security base:** httpOnly cookie session (C1) + `middleware.ts` (C2) + response interceptor (M4).
2. **Customer auth:** wire login/signup/forgot/OTP to generated hooks (C3), guest-cart merge.
3. **Money correctness:** single currency formatter (C4), success-page `redirect_status` handling (H1/H2).
4. **Orders:** customer order history + detail; admin orders list + dashboard (H1, gap #8 in overview).
5. **Catalog scale:** server-side pagination/filter/search (H3); category pages (H5).
6. **Hygiene sprint:** dedupe API layers/formatters (H6/H7), delete legacy `src/components`, `.env.example` (M2), Vitest + Playwright + CI (M1), restrict image hosts (M3), real legal content (C5).
