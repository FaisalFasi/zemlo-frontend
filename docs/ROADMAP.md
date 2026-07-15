# Zemlo — Production Roadmap (Master Checklist)

> Goal: take Zemlo from ~50% learning project to a **sustainable, production-grade store** that can be handed over to a real owner with zero known issues.
> Work through phases **in order** — each phase builds on the previous one. Tick boxes as we complete them.
> Detailed reasoning for each item: [AUDIT.md](AUDIT.md) · Feature status: [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)
> Created: 2026-07-13 · Baseline: `main` @ 366bc5b

Legend: 🆕 = new feature (doesn't exist) · 🔧 = update/fix (exists but wrong/incomplete) · 🧹 = cleanup

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
- [ ] 🔧 **Forgot password + OTP** — **DEFERRED: backend has no endpoints** (`/auth` module only has register/login/me/logout). Stub pages deleted; re-add when backend ships password-reset (needs email sending, see Phase 9)
- [x] 🆕 **Customer session** — done: `zemlo_customer_session` httpOnly cookie, `/api/auth/*` route handlers share `session-auth-routes.ts` with admin; `useCurrentCustomerQuery()` hook; navbar/sidebar show account state; `/account` page with sign-out; middleware guards `/account` and skips auth pages when signed in
- [x] 🆕 **Guest→user cart merge** — done client-side (backend has no merge endpoint — cart owner resolution prefers userId): guest cart snapshotted before login, items replayed into user cart, guest id cleared. Verified via proxy: authenticated `/cart` resolves to user cart
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
- [ ] 🔧 **Real order confirmation** — success page shows actual order summary (items, total, delivery estimate), not just an ID
- [ ] 🆕 **Admin orders list** — table with status, customer, total, date; status update actions
- [ ] 🆕 **Admin order detail** — full order view for fulfilment
- [ ] 🆕 **Admin dashboard metrics** — replace placeholder card with real numbers (orders today, revenue, low stock)

**Done when:** customer sees their orders; the store owner (your friend) can see and fulfil every order from `/admin`.

---

## Phase 5 — Catalog at Scale 🗂️
*Current shop breaks down past a few dozen products.*

- [ ] 🔧 **Server-side pagination** on `/shop` — API query params + paginated UI (check generated `catalogControllerFindProducts` params)
- [ ] 🔧 **Server-side filtering/search/sort** — move out of `shop-filters.ts` in-memory logic; fix "newest" sort (currently compares IDs, not dates)
- [ ] 🆕 **Category pages** — implement `/categories/[slug]` (route config already points there)
- [ ] 🔧 **Decide `/products` route** — currently a bare `<div>Products</div>` stub; redirect to `/shop` or delete
- [ ] 🆕 **Search UX** — dedicated search input in navbar with results (can reuse shop grid)
- [ ] 🔧 **Local placeholder images** — replace hardcoded Unsplash fallbacks with a `/public` asset
- [ ] 🔧 Ensure `DEMO_CATALOG_ENABLED` is documented and OFF in production

**Done when:** 1,000 products would render fast, paginated, and filterable — and demo data can't leak into production.

---

## Phase 6 — Admin Completeness 🛠️
*Your friend must be able to run the store alone, without a developer.*

- [ ] 🔧 **Product variants in admin** — remove hardcoded `hasVariants: false` (`admin-produc-form-mappers.ts:51`); variant create/edit UI (storefront already displays variants)
- [ ] 🆕 **Image upload** — Cloudinary (or S3) upload in the product form instead of URL-paste
- [ ] 🔧 **Fix ARCHIVED status round-trip** — edit form currently downgrades ARCHIVED → DRAFT; allow restore
- [ ] 🔧 Fix duplicate "Add product" nav item (`AdminShell.tsx:104-110` + `119-125`) and rename `admin-produc-form-mappers.ts` → `admin-product-form-mappers.ts`
- [ ] 🆕 **Enforce granular RBAC in UI** — permission map exists (`admin-permissions.ts`) but only `admin:access` is checked; gate actions (create/edit/archive) per role
- [ ] 🆕 **Category & brand management** — CRUD screens (APIs generated, no UI)

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

- [ ] 🆕 **Vitest + React Testing Library** — start with pure logic: `catalog-product-mappers`, `shop-filters`, `checkout.schema`, cart hooks (with `msw`)
- [ ] 🆕 **Playwright E2E** — the money path: shop → product → cart → checkout with Stripe test card; run against preview deploys
- [ ] 🆕 **GitHub Actions CI** — `npm ci` → lint → `tsc --noEmit` → test → build on every PR; block merge on red
- [ ] 🧹 **Dedupe API layers** — one server fetch helper, one error class (`ApiClientError` vs `ApiError`), one proxy style (H6 in AUDIT.md)
- [ ] 🧹 **Delete legacy `src/components/`** — migrate remaining home sections into `features`/`widgets` per ARCHITECTURE.md, remove `LogoLoop.tsx` `as any` mess or isolate it
- [ ] 🔧 **Tighten tsconfig** — add `noUncheckedIndexedAccess`, `noUnusedLocals`; drop `allowJs`
- [ ] 🔧 **Update ARCHITECTURE.md** — finish the doc, remove Zustand claim (not installed), match reality
- [ ] 🆕 Root `not-found.tsx` + `global-error.tsx`; loading/error boundaries for `(admin)`; `loading.tsx` for `/shop` and `/products/[slug]`

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
