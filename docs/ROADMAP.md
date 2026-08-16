# Zemlo — Production Roadmap (Master Checklist)

> Goal: take Zemlo from ~50% learning project to a **sustainable, production-grade store** that can be handed over to a real owner with zero known issues.
> Work through phases **in order** — each phase builds on the previous one. Tick boxes as we complete them.
> Detailed reasoning for each item: [AUDIT.md](AUDIT.md) · Architecture + what's built: [IMPLEMENTATION.md](IMPLEMENTATION.md)
> Created: 2026-07-13 · Baseline: `main` @ 366bc5b

Legend: 🆕 = new feature (doesn't exist) · 🔧 = update/fix (exists but wrong/incomplete) · 🧹 = cleanup

---

## 📍 Next Session — Start Here (last updated 2026-08-17)

**1. Everything below is UNCOMMITTED on purpose — user is testing locally
first.** Two full sessions' worth of work sits in the working tree: RBAC on
real backend permissions, admin-manager dedup, a large admin bug-fix pass,
responsive admin nav, and a full backend-integration wave (pagination,
cart-merge, admin-stats, forgot/reset-password, image upload) — see
IMPLEMENTATION.md, dated 2026-08-16/17 sections. `npm run lint && npm run
typecheck && npm test && npm run build` all green (40 tests) as of
2026-08-17. **Do not re-derive or redo any of this** — read
IMPLEMENTATION.md first. Ask the user before committing/pushing.

**2. Backend is now fully live and integrated.** Confirmed directly against
`/api-json` (47 paths). Every item from `zemlo-backend`'s own
`docs/FRONTEND_INTEGRATION_NOTES.md` (copied into this repo, same path) is
shipped AND wired into the frontend — see "Backend Integration Wave" in
IMPLEMENTATION.md for exactly what changed in which files. **One thing
NOT built yet despite the API being ready:** a real paginated `/shop` UI
(page-number controls, server-side search/category/brand/sort) — the shop
grid still fetches the whole catalog and filters client-side via
`getAllCatalogProducts()`. That's the natural next Phase 5B task.

**3. Phase 6 is done.** Category/brand admin CRUD, variants manager, RBAC
UI gating (real backend permissions), and real image upload are all built.
Nothing outstanding in Phase 6.

**4. Standing rule: no more duplicate admin managers.** See "Admin CRUD
Manager Pattern" in IMPLEMENTATION.md — reuse `useAdminEntityForm`,
`AdminEntityListSkeleton`/`AdminEntityLoadError`/`AdminFormActions`,
`admin-form-styles.ts`, and the catalog-hooks factory for any future admin
list+form screen instead of writing a new one from scratch.

**5. A real crash got fixed — the root cause was in `use-admin-auth.ts`,
not a browser extension.** The shared admin-auth query used to collapse a
transient 5xx/network error into "logged out," which could unmount the
whole admin panel mid-action. See "Admin Dashboard Bug-Fix Pass" in
IMPLEMENTATION.md. Also: every admin-mutating section (order forms, catalog
managers, product/variant forms) is now wrapped in
`AdminSectionErrorBoundary` — a rendering hiccup degrades that one section,
not the whole page.

**6. Suggested next big move:** either the Phase 5B paginated-shop UI
(item 2 above) or Phase 7 (legal pages) — ask the user which.

**7. Backend items still open, tracked in [BACKEND-TODO.md](BACKEND-TODO.md):**
§0 (automate expired-inventory release, small/safety-critical), §0b-ii/iii
(2 remaining RBAC gaps: no field-level stock-vs-full-product permission
split, unused staff/customer permissions), §0c (two small schema fields —
`Brand.isOwnBrand`, `Product.badgeText` — for admin badge/discount UX the
user asked about; the discount % control itself is already built using
existing fields, no backend change needed for that part).

**Docs map (avoid re-reading everything — pick the right one):**
- **This file (ROADMAP.md)** — the checklist: what's done ✅, what's left, in what order.
- **[IMPLEMENTATION.md](IMPLEMENTATION.md)** — living architecture reference: how auth/cart/checkout/orders/images work today, key file paths, conventions. Read this to understand "how is X built" without re-deriving it.
- **[AUDIT.md](AUDIT.md)** — the original day-1 audit (2026-07-13). Historical; many items are now fixed (check ROADMAP for current status) but it's still useful for the original reasoning behind a fix.
- **[BACKEND-TODO.md](BACKEND-TODO.md)** — backend-repo action items (pagination, cron, RBAC gaps, upload endpoint) with ready-to-paste NestJS code.
- **[PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)** — ⚠️ retired/stale (superseded by this file + IMPLEMENTATION.md), kept only so old links don't break.

---

## Phase 1 — Security & Session Foundation 🔐
*Everything else sits on top of this. Do first.*

- [x] 🔧 **Move admin auth to httpOnly cookies** — done 2026-07-13: token now lives in `zemlo_admin_session` httpOnly cookie set by `/api/admin/auth/login`; new `/api/admin/auth/logout` revokes the backend session; localStorage `admin-session.ts` deleted
- [x] 🆕 **Add `middleware.ts`** — done: `/admin/:path*` redirects to `/admin/login?from=…` without a session cookie (and login → `/admin` when already signed in); `AdminShell` still verifies role via `/auth/me`
- [x] 🆕 **Axios response interceptor** — done: 401 on `/admin` pages redirects to login; `adminApiRequest` does the same
- [x] 🔧 **Restrict image hosts** — done: `images.unsplash.com` + `swiperjs.com` only
- [x] 🆕 **Commit `.env.example`** — done (with `!.env.example` gitignore exception)
- [x] 🧹 Remove leftover `console.log` (`otp/page.tsx`) and commented-out layout block — done

**Done when:** admin panel is inaccessible without a valid session even with JS disabled; no tokens readable from `localStorage`.

---

## Phase 2 — Customer Authentication 👤
*Biggest missing product feature. Generated API hooks already exist — wire them.*

- [x] 🔧 **Login page** — done 2026-07-14: rebuilt with RHF + Zod + `shared/ui`, wired via `/api/auth/login` route handler (cookie set server-side; generated types reused, token never reaches client JS)
- [x] 🔧 **Signup page** — done: `/signup` with full backend-matching validation (password strength, name lengths); `routes.auth.register` now points to `/signup`
- [x] 🔧 **Forgot password + OTP** — done 2026-08-17: backend shipped `/auth/forgot-password` + `/auth/reset-password`. `/forgot-password` + `/reset-password` pages built (`ForgotPasswordForm`/`ResetPasswordForm`), linked from login. No OTP — link-based reset only (matches what the backend ships).
- [x] 🆕 **Customer session** — done: `zemlo_customer_session` httpOnly cookie, `/api/auth/*` route handlers share `session-auth-routes.ts` with admin; `useCurrentCustomerQuery()` hook; navbar/sidebar show account state; `/account` page with sign-out; middleware guards `/account` and skips auth pages when signed in
- [x] 🆕 **Guest→user cart merge** — done 2026-08-17 with the real `POST /cart/merge` endpoint (single server-side call, keyed off `x-guest-id`) — replaces the earlier client-side "snapshot + replay items one-by-one" workaround
- [x] 🆕 **Logout** — done: revokes backend session, clears cookie, resets user + cart query cache
- [x] 🧹 Deleted legacy `CInput`/`CButton`/custom OTP kit + dead `HorizontalCarousel`/`brandSlider`/`card`/`container`/`mainCarousel`/`HeroCarousel` (zero consumers); admin api helpers now use shared `shared/lib/http.ts`

**Done when:** a customer can register, log in, keep their cart, and log out — full round trip against the real backend. ✅ Verified 2026-07-14 (register → me → authenticated cart → logout → re-login, all against hosted backend)

---

## Phase 3 — Money Correctness & Checkout Polish 💶
*A store that shows the wrong currency or a wrong "success" page is broken.*

- [x] 🔧 **Single currency formatter** — done 2026-07-14: all 6 hardcoded-USD copies (CartLineItem, CartSummary, CheckoutCartSummary, ShopProductCard, HomeProductCard, AdminProductsTable) now delegate to `shared/lib/formatters.ts` driven by `defaultMarket` (EUR, de-DE format "49,99 €"); duplicate `shared/config/formatters.ts` deleted
- [x] 🔧 **Success page verifies payment** — done: new `CheckoutResultPanel` retrieves the PaymentIntent from Stripe via `payment_intent_client_secret` (official Stripe pattern — URL params are never trusted); states: verifying → succeeded / processing / unknown; definitive failures redirect to `/checkout/failure`
- [x] 🔧 **`/checkout/failure` reachable** — done: failed/canceled PaymentIntent states route there from the result panel; page shows order reference for support
- [ ] 🆕 **Shipping method selection** — **DEFERRED: backend has no shipping methods** — it computes a flat default cost + free-shipping-over threshold from platform settings (`checkout.service.ts`). Selectable methods = backend feature first; revisit with backend work
- [x] 🔧 **Cart optimistic updates** — done: `onMutate` snapshot + instant cache update + `onError` rollback for update/remove/clear (add-to-cart stays server-first — building a cart line needs product data the client may not have)
- [x] 🧹 Stale "coming next" copy replaced with accurate text (cart summary, admin dashboard, product panel)

**Done when:** currency is EUR everywhere; a declined test card never lands on a success screen. ✅ Verified 2026-07-14: shop renders "50 €" (de-DE), success page without params shows neutral "Order received", with client secret starts "Verifying", failure page reachable with reference

---

## Phase 4 — Orders 📦
*The other half of a store: what happens after payment.*

- [x] 🆕 **Customer order history** — done 2026-07-14: `/account/orders` with loading/error/empty/list states, status + payment badges, linked from AccountPanel
- [x] 🆕 **Order detail** — done: `/account/orders/[orderNumber]` — items from order snapshot, totals breakdown (subtotal/shipping/tax/discount), shipping address, tracking link; feature code in `src/features/orders/`
- [ ] 🔧 **Real order confirmation** — success page verifies payment (Phase 3) but still shows only the order id; full summary (items/totals) is a later polish
- [x] 🆕 **Admin orders list** — done 2026-07-14: `/admin/orders` table (customer, status/payment badges, total, date) via cookie-authenticated proxy routes
- [x] 🆕 **Admin order detail** — done: `/admin/orders/[orderId]` — customer/guest contact, items + totals, address, status history (audit trail), status update form (+note) and shipping/tracking form
- [x] 🆕 **Admin dashboard metrics** — done 2026-08-17 with the real `GET /admin/stats` endpoint (orders today / revenue today / low-stock count, gated on `analytics.view`) — replaces the earlier client-side "count the whole orders list" version

**Done when:** customer sees their orders; the store owner (your friend) can see and fulfil every order from `/admin`.

---

## Phase 5 — Catalog at Scale 🗂️
*Current shop breaks down past a few dozen products.*

- [x] 🔧 **`catalog-api.ts` adapted for pagination** — done 2026-08-17: backend shipped `GET /products` as `{items, total, page, limit, pageCount}` with `page/limit/search/category/brand/sort` params (verified live). `getCatalogProductsPage()` (raw paginated shape) + `getAllCatalogProducts()` (loops all pages, used by shop/home/sitemap) both added — see IMPLEMENTATION.md "Backend Integration Wave". **Not done yet:** an actual paginated `/shop` UI — page-number controls + wiring `ShopFilters` to the server params instead of client-side filtering. The API is ready; the UI still fetches everything and filters in the browser.
- [ ] 🔧 **Server-side filtering/search/sort UI** — API supports it now (`search`/`category`/`brand`/`sort` params, confirmed live); `ShopFilters`/`ShopProductGrid` still do client-side filtering over the full fetched catalog. Wiring this up is the next real Phase 5B task — not blocked anymore, just not built.
- [x] 🆕 **Category pages** — done 2026-07-19: `/categories/[slug]` with per-category SEO metadata, `notFound()` on bad slugs, ISR; reuses shared `get-shop-data.ts` loader + `ShopPage` (new optional heading/description props)
- [x] 🔧 **`/products` route** — done: redirects to `/shop` (was a bare stub)
- [ ] 🆕 **Search UX** — partial: navbar search icon pointed to `/shop` (was linking to a non-existent `/search` → 404!); dedicated search page with live results deferred until backend search param exists
- [x] 🔧 **Local placeholder images** — done: `public/images/product-placeholder.png` (generated, 6 KB) replaces all 3 hardcoded Unsplash fallbacks (product cards/detail, cart line items, gallery)
- [x] 🔧 `DEMO_CATALOG_ENABLED` — documented in `.env.example` (default false); demo data only activates when catalog is empty AND flag is on

**Done when:** 1,000 products would render fast, paginated, and filterable — and demo data can't leak into production.

---

## Phase 6 — Admin Completeness 🛠️
*Your friend must be able to run the store alone, without a developer.*

- [x] 🔧 **Product variants in admin** — done 2026-07-19: `hasVariants` hardcode REMOVED from payloads (was resetting variants on every product edit! backend owns the flag), full variants manager on the edit page (list/add/edit/delete via `/api/admin/products/[id]/variants*` proxy routes, `AdminVariantsManager` + api/hooks)
- [x] 🆕 **Image upload** — done 2026-08-17: real `POST /admin/uploads/image` (Cloudinary) live, `AdminProductForm.tsx` has an Upload button next to the Image URL field. URL-paste still works as a fallback for an already-hosted image.
- [x] 🔧 **ARCHIVED status round-trip** — done: mapper keeps real status, form select offers Active/Draft/Archived (restore now possible)
- [x] 🔧 Duplicate "Add product" nav fixed in Phase 4; `admin-produc-form-mappers.ts` renamed → `admin-product-form-mappers.ts` (2026-07-19)
- [x] 🆕 **Enforce granular RBAC in UI** — done 2026-08-16: `useAdminPermission()` (`features/admin/auth/hooks/use-admin-auth.ts`) gates every mutating action (product create/edit/archive, variants, categories/brands, order updates) per role; new `categories:manage`/`brands:manage` permission keys
- [x] 🆕 **Category & brand management** — done 2026-08-16: `/admin/catalog` page, `AdminCategoriesManager` + `AdminBrandsManager` (full CRUD with forms/validation), proxy routes `/api/admin/categories*` + `/api/admin/brands*`, feature code in `features/admin/catalog/`

**Done when:** the store owner can manage products (with variants + images), categories, and brands entirely from the admin panel.

---

## Phase 7 — Content, Legal & Trust 📄
*Mandatory for a German-market store — legal exposure otherwise.*

- [ ] 🔧 **Real Impressum** — actual name/address/contact (TMG requirement, currently `legal@zemlo.example`)
- [ ] 🔧 **Real Datenschutzerklärung (privacy)** — DSGVO-compliant, covers Stripe, cookies, guest-id storage
- [ ] 🔧 **Real Terms (AGB), shipping & returns/Widerruf policies** — Widerrufsrecht is mandatory for DE e-commerce
- [ ] 🆕 **Cookie/consent banner** — required under DSGVO/TTDSG before any non-essential storage/analytics
- [ ] 🔧 **Contact page** — replace placeholder with a working contact form or mailto + business details
- [ ] 🔧 **Story/Blog pages** — real content, or remove from navigation until ready

**Done when:** a German lawyer wouldn't wince. (Recommend: have legal texts checked by a generator like eRecht24 or an actual lawyer — I can draft structure, not legal advice.)

---

## Phase 8 — Quality Engineering 🧪
*What makes it "sustainable" — safe to change without breaking.*

- [x] 🆕 **Vitest unit tests** — started 2026-07-19: 31 tests across 5 files (formatters/EUR, safe-redirect security, shop filters/sort, auth password schemas, order-status fallback). Component tests (RTL/jsdom) + cart hooks with msw: still to add
- [ ] 🆕 **Playwright E2E** — the money path: shop → product → cart → checkout with Stripe test card; run against preview deploys
- [x] 🆕 **GitHub Actions CI** — done: `.github/workflows/ci.yml` — npm ci → lint → typecheck → 31 tests → build on every push/PR
- [x] 🔒 **Security audit** — done 2026-07-19: swiper critical (prototype pollution) fixed, Next.js 15.5.9→15.5.20 (DoS/request-smuggling patches); 2 moderate remain in Next's bundled postcss (build-time transitive, no sane fix — resolves with next Next release)
- [x] 🧹 **Dedupe admin CRUD managers** — done 2026-08-16: categories/brands/variants managers were near-duplicate; extracted shared form-state hook + list/error/save-cancel components + input styles + a catalog-hooks factory. **Standard for future admin list+form screens** — see "Admin CRUD Manager Pattern" in IMPLEMENTATION.md, don't rewrite from scratch
- [ ] 🧹 **Dedupe API layers** — one server fetch helper, one error class (`ApiClientError` vs `ApiError`), one proxy style (H6 in AUDIT.md). Checked 2026-08-16: each error class has exactly one consumer today (`ApiClientError` in the Orval axios mutator, `ApiError` in the raw-fetch `lib/api/api-client.ts`) — genuinely different transports, so unifying needs a deliberate pass, not a quick rename
- [ ] 🧹 **Delete legacy `src/components/`** — migrate remaining home sections into `features`/`widgets` per ARCHITECTURE.md, remove `LogoLoop.tsx` `as any` mess or isolate it
- [ ] 🔧 **Tighten tsconfig** — add `noUncheckedIndexedAccess`, `noUnusedLocals`; drop `allowJs`
- [ ] 🔧 **Update ARCHITECTURE.md** — finish the doc, remove Zustand claim (not installed), match reality
- [x] 🆕 Root `not-found.tsx` + `global-error.tsx`; `(admin)` error boundary — done 2026-07-20 (triggered by a real crash, see below). `loading.tsx` for `/shop` and `/products/[slug]` still open
- [x] 🔒 **Image-host crash fix** — done 2026-07-20: an admin-entered product image from an unlisted host (`placehold.co`) crashed `<Image>` and took down the ENTIRE shop/home/cart page for every visitor (not just that product) — the exact blast-radius risk this document warns about. Root cause: Phase 1 tightened `next.config.ts` image hosts to an allowlist (correct security fix) but nothing validated URLs against it before render. Fixed with `shared/lib/safe-image-url.ts` (falls back to the local placeholder instead of crashing) applied at every image-mapping site; consolidated a literal-duplicate "pick best product image" chain that existed in BOTH `entities/product` and `components/home` mappers into one shared `resolveBestProductImage()`. 5 new tests lock this in (36 total).

**Done when:** CI is green on every PR and the money path has an automated test.

---

## Phase 9 — Launch & Operations 🚀
*Handing it over as a gift means it must run itself.*

- [ ] 🆕 **Production deployment** — Vercel (frontend) with env vars set; custom domain + HTTPS
- [ ] 🆕 **Error monitoring** — Sentry (frontend + backend) so problems surface before the owner notices
- [ ] 🆕 **Analytics** — privacy-friendly (Plausible/Umami — no cookie banner burden) or GA4 behind consent
- [ ] 🆕 **Uptime monitoring** — free tier (UptimeRobot/BetterStack) on storefront + backend health endpoint
- [ ] 🔧 **Stripe live mode checklist** — live keys, webhook endpoint verified, payout account, receipt emails
- [ ] 🆕 **Transactional emails** — order confirmation to customer + notification to owner (likely backend work — Resend/Postmark)
- [ ] 🔧 **Performance pass** — Lighthouse ≥ 90 on home/shop/product; image `sizes` props; font loading (currently commented out)
- [ ] 🔧 **Accessibility pass** — keyboard nav through checkout, form labels, contrast, focus states
- [ ] 🆕 **Owner's manual** — short doc for your friend: how to add products, view orders, refund via Stripe, who to call when something breaks
- [ ] 🔧 **Backend audit** — same treatment for `zemlo-store` repo (webhook security, DB backups, rate limiting) — separate exercise

**Done when:** your friend can run the store day-to-day without touching code, and you get alerted if anything breaks.

---

## Suggested pace

| Phase | Size | Notes |
|---|---|---|
| 1. Security base | Small (1–2 sessions) | Highest value per hour |
| 2. Customer auth | Medium | Depends on backend endpoints |
| 3. Money correctness | Small–medium | Mostly frontend |
| 4. Orders | Medium–large | Customer + admin sides |
| 5. Catalog scale | Medium | Depends on backend query params |
| 6. Admin completeness | Medium–large | Variants + uploads are the big ones |
| 7. Legal/content | Small (dev) + external | Legal text needs owner input |
| 8. Quality engineering | Medium, parallelizable | Can run alongside 4–6 |
| 9. Launch & ops | Small–medium | Mostly configuration |
