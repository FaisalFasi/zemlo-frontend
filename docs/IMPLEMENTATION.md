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
> Last updated: 2026-07-14 (Phase 4 — customer orders)

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

## Customer Orders (Phase 4)

- Pages: `/account/orders` (history list) · `/account/orders/[orderNumber]` (detail: items, totals, address, tracking). Both noIndex + middleware-protected.
- Feature: `src/features/orders/` — `api/orders-api.ts` (wraps generated `ordersControllerFindMyOrders` / `...ByOrderNumber`), `queries/`, `hooks/use-orders.ts`, `lib/order-status.ts` (status code → label + badge color, exhaustive via `Record<OrderStatus,...>`), components `OrdersList` / `OrderDetailPanel` / `OrderStatusBadge`.
- Order detail renders the order **snapshot** (productName/prices saved at purchase) — editing products later never rewrites old receipts. Totals come from backend, never recalculated.
- Account page (`AccountPanel`) links to orders.

---

## Conventions (follow these when adding code)

1. **Layers:** `app/` = thin routes only → `features/<name>/{api,hooks,queries,components,lib,schemas}` → `entities` → `shared`. Components never import Orval-generated code directly — always via a feature `api/` wrapper.
2. **Data fetching:** client = TanStack Query (keys centralized in `queries/`); server pages = fetch helpers in `src/lib/api`.
3. **Every data screen has 4 states:** loading skeleton / error + retry / empty + CTA / data.
4. **Forms:** react-hook-form + Zod schema matching backend validation (`features/*/schemas/`).
5. **Status/enum display:** map raw codes to labels in one `lib/` file per feature (see `order-status.ts`).
6. **Personal pages:** `noIndex: true` + middleware protection.
7. **Env contract:** documented in `.env.example` — add every new var there.

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
- **Phase 4** (2026-07-14): customer order history + detail — *admin orders & dashboard still pending*
