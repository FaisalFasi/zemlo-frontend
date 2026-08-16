# Zemlo — E-Commerce Storefront (Frontend)

A production-grade e-commerce storefront + admin panel, built with **Next.js 15 (App Router)** and backed by a separate NestJS API (`zemlo-backend`). Being built as a real gift store for a friend — the goal is genuine production quality, not a demo.

> **New to this repo (human or AI agent)? Read [docs/IMPLEMENTATION.md](docs/IMPLEMENTATION.md) first** — it explains what's built, how auth/cart/checkout/orders work, and where every piece lives. Then check [docs/ROADMAP.md](docs/ROADMAP.md) for what's done ✅ and what's next, starting with its **"Next Session — Start Here"** section at the top.

## Docs map

| File | What it's for |
|---|---|
| [docs/IMPLEMENTATION.md](docs/IMPLEMENTATION.md) | **Start here.** Living architecture reference — how auth, cart, checkout, orders, and image handling actually work today, plus a key-files cheat-sheet and coding conventions. |
| [docs/ROADMAP.md](docs/ROADMAP.md) | The master checklist — phases, what's done, what's left, in priority order. Has a "Next Session — Start Here" section pinned at the top. |
| [docs/AUDIT.md](docs/AUDIT.md) | The original day-1 codebase audit (2026-07-13). Historical context for *why* a fix was made — check ROADMAP for current status, this file isn't kept in sync. |
| [docs/BACKEND-TODO.md](docs/BACKEND-TODO.md) | Action items for the `zemlo-backend` repo (pagination, cron scheduling, upload endpoint) with ready-to-paste NestJS code. |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Original FSD layering rules (pre-existing doc). |
| `Zemlo Style Guide & Design System.md` | Visual design system. |

## Tech stack

Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 + shadcn/ui · TanStack Query v5 · Orval (typed API client from the backend's OpenAPI spec) · React Hook Form + Zod · Stripe Payment Element · Vitest.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in values — see table below
npm run dev
```

Requires a running `zemlo-backend` instance (locally or the hosted one — set `API_BASE_URL` in `.env.local`).

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Run the unit test suite (Vitest) |
| `npm run test:watch` | Vitest in watch mode |
| `npm run api:generate` | Regenerate the typed API client from the backend's OpenAPI spec (Orval) |

CI (`.github/workflows/ci.yml`) runs lint → typecheck → test → build on every push/PR — check that it's green before merging.

## Environment variables

See [.env.example](.env.example) for the full, documented list (backend URL, Stripe key, market/locale defaults, demo-catalog toggle).
