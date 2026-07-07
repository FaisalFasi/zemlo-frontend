# Zemlo Frontend Architecture

Zemlo is a production e-commerce marketplace frontend built with Next.js App Router, React, TypeScript, Tailwind CSS, Orval, Axios, and TanStack Query.

This document is the source of truth for frontend structure and implementation rules.

## Goals

- Keep the app fast, maintainable, and scalable.
- Avoid repeated refactors caused by mixed patterns.
- Keep public storefront pages SEO-friendly.
- Keep API access typed and centralized.
- Keep components reusable and human-written, not one-off AI-style code.

## Folder contract

```txt
src/app
src/shared
src/entities
src/features
src/widgets
```

src/app

Use only for:

routes
layouts
loading/error/not-found files
route handlers
server page composition

Do not put business logic, API clients, random helpers, or reusable UI directly in app.

src/shared

Use for generic reusable infrastructure:

api
config
ui
forms
hooks
lib
query
styles
providers

Shared code must not depend on business features.

src/entities

Use for domain-level models and mapping helpers:

product
cart
user
order
category
brand

Entities should contain types, mappers, display helpers, and domain utilities.

src/features

Use for business actions and workflows:

cart
checkout
auth
admin products
product filters
add to cart

Feature code can use entities and shared code.

src/widgets

Use for composed UI sections:

public navbar
product grid
cart summary
checkout summary
admin shell
homepage sections

Widgets can compose features, entities, and shared UI.
API rules

Application code must not call raw fetch or raw Axios directly.

Allowed flow:

Component
-> feature hook
-> feature api wrapper
-> Orval generated function
-> axios mutator
-> /api/backend proxy
-> NestJS backend

Generated files live in:

src/shared/api/generated

Do not manually edit generated files.
Browser API calls

Browser-side API calls must use:

/api/backend/...

The Next.js route handler proxies the request to the backend.

Server-side API calls

Public SEO pages may use server-safe API wrappers where needed.

Product/category pages should be server-first when SEO matters.

TanStack Query rules

Use TanStack Query for:

cart queries/mutations
checkout mutations
admin dashboard data
authenticated client-side data
mutation loading/error states

Do not use TanStack Query just to make SEO public pages client-only.

Zustand rules

Use Zustand only for local UI state:

drawer open/close
modal state
temporary UI preferences

Do not use Zustand for backend/server data.

Config rules

Do not repeat static values across files.

Use config files for:

routes
storage keys
query defaults
API base paths
app metadata
constants reused across the project
UI rules
Keep UI premium, minimal, spacious, and product-focused.
Use semantic design tokens.
Avoid random raw colors and repeated arbitrary values.
Prefer reusable components over copy-pasted sections.
Avoid browser alerts in final UX; use proper UI feedback.
Migration order
Foundation config and architecture lock
Cart API migration
Catalog API migration
Product detail and shop stabilization
Checkout API migration
Stripe Elements
Admin API migration
SEO and performance pass
Testing and monitoring

---

# 2. Create `src/shared/config/app.ts`

```ts
export const appConfig = Object.freeze({
  name: "Zemlo",
  description: "A modern multi-category e-commerce marketplace.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en",
} as const);

export type AppConfig = typeof appConfig;
```
