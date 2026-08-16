<!--
═══════════════ EXPLANATION (is change ki wajah) ═══════════════
YE KYA HAI: Inventory-release scheduling ka naya item add kiya —
2026-07-20 ko backend code padh kar mila ek asal gap.
REASON: User ne poocha "reserved inventory release service better
kaise manage karein" — research se pata chala ye script hai, cron nahi.
RISK: Zero — documentation only.
═════════════════════════════════════════════════════════════════
-->

# Backend TODO — features the frontend is waiting on

> Apply these in the `zemlo-backend` repo. After deploying, run
> `npm run api:generate` in the frontend so the typed client picks up
> the new params, then finish frontend Phase 5B (see ROADMAP.md).

---

## 0. Automate expired-inventory release (found 2026-07-20 — do this one first, it's small and safety-critical)

**Investigated while answering: "reserved inventory release ko better manage kaise karein — cart se release karne ke bajaye checkout par sold-out dikhayein?"**

**What we found (good news — the reservation design itself is solid):**
- `checkout-inventory.service.ts` decrements stock with an **atomic conditional update**
  (`updateMany({ where: { stock: { gte: quantity } }, data: { decrement } })`) at the
  moment checkout starts — this is race-safe; two concurrent checkouts for the last
  unit cannot both succeed.
- Reservation TTL: `checkout.inventoryReservationMinutes` (default **20 min**) for
  card payments, **48h** for bank transfer.
- `order-inventory-lifecycle.service.ts`'s `releaseExpiredReservations()` finds
  expired `RESERVED`+`PENDING` orders and restores stock.
- **The frontend does NOT need a "sold out at checkout" feature** — since stock is
  decremented the moment checkout starts (not at payment success), `product.stock`
  already reflects live availability everywhere the frontend already reads it
  (shop grid, product detail out-of-stock state). This already works today.

**The actual gap:** `releaseExpiredReservations()` is only exposed as a manual
script — `npm run inventory:release-expired` (see `scripts/release-expired-inventory-reservations.ts`).
**Nothing in the codebase calls it automatically** (no `@Cron`, `@Interval`,
`BullModule`, or `node-cron` found anywhere). If nobody runs this script
periodically, stock from abandoned/never-completed checkouts stays locked
forever — real inventory silently "disappears" from sale over time.

**Fix — wire it to `@nestjs/schedule` inside the running app (simplest, zero
extra infrastructure, right-sized for a single Render instance):**

```bash
npm install @nestjs/schedule
```

```ts
// src/app.module.ts
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    // ...existing imports
  ],
})
export class AppModule {}
```

```ts
// src/modules/orders/services/inventory-release.cron.ts (new file)
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OrderInventoryLifecycleService } from './order-inventory-lifecycle.service';

@Injectable()
export class InventoryReleaseCron {
  private readonly logger = new Logger(InventoryReleaseCron.name);

  constructor(
    private readonly inventoryLifecycle: OrderInventoryLifecycleService,
  ) {}

  // Every 5 minutes is plenty against a 20-minute reservation window.
  @Cron(CronExpression.EVERY_5_MINUTES)
  async releaseExpired() {
    const result = await this.inventoryLifecycle.releaseExpiredReservations();

    if (result.releasedCount > 0) {
      this.logger.log(
        `Released ${result.releasedCount}/${result.checkedCount} expired reservations`,
      );
    }
  }
}
```

Register `InventoryReleaseCron` as a provider in the orders module. Keep the
manual npm script too (useful for a one-off manual run / debugging).

**Only revisit this if you ever run more than one backend instance** — in-process
`@Cron` fires per-instance, so N instances would attempt the same release
N times (harmless here since `releaseReservedInventory` only acts on rows still
`RESERVED`, so duplicate runs are no-ops — but worth a DB-level advisory lock or
a dedicated worker if you scale out later).

---

## 0b. RBAC: 3 gaps found in a security audit (2026-08-16)

**Context:** the frontend added per-role UI gating (buttons/forms hidden
based on the admin's role) — that's UX only, NOT a security boundary; anyone
with a valid session cookie could bypass it via `curl`/Postman. So we cloned
`zemlo-backend` and audited whether the real, server-side boundary actually
holds.

**Good news — the core mechanism is solid:** every mutating admin route
(categories, brands, products, variants, orders controllers) already carries
`JwtAuthGuard` + `PermissionsGuard` + an explicit `@RequirePermissions(...)`
naming a specific permission — not a blanket "is this any admin" check. The
old role-only `AdminGuard` is `@deprecated` and unused (an audit script,
`scripts/audit-rbac.ts`, already fails the build if anyone reintroduces it).
No gap of "zero guard beyond JWT" was found on any of the 5 controller
groups checked.

Three real gaps did turn up:

### 0b-i. ✅ DONE 2026-08-16 — Frontend roles don't exist on the backend (fix: stop duplicating the permission map on the frontend)

**Resolved on the frontend side, no further backend work needed for this
item.** Confirmed directly against the live `/api-json` spec that
`GET /auth/me` already returns `user.permissions: string[]` — the backend
had already shipped its half of this fix. Frontend now reads that array
directly (`features/admin/auth/hooks/use-admin-auth.ts`); the hardcoded
7-role `admin-permissions.ts` map is deleted. Left below for history/context.

Frontend `admin-permissions.ts` hardcodes a **second copy** of "which
permissions does this role have" for 7 roles (`SUPER_ADMIN, ADMIN, CTO,
MANAGER, PRODUCT_MANAGER, INVENTORY_MANAGER, CUSTOMER`). The backend's
`UserRole` enum (`prisma/schema/User.prisma`) only has 4
(`CUSTOMER, STAFF, ADMIN, SUPER_ADMIN`) — `CTO`/`MANAGER`/`PRODUCT_MANAGER`/
`INVENTORY_MANAGER` have no seeded row in
`prisma/seeds/role-permissions.seed.ts` at all. In practice a real account
meant to be "INVENTORY_MANAGER" has to be stored as `ADMIN`/`STAFF` with
manually-curated `UserPermission` overrides, and nothing guarantees that
curation actually matches the narrower persona the frontend assumes.

**Root cause: two sources of truth for the same thing.** The backend
already computes the real, resolved permission list per user
(`PermissionResolverService.getUserPermissions()`, unions role defaults +
per-user `UserPermission` grants) — that's the actual authorization data.
The frontend re-derives its own copy from a `role` string instead of
reading that resolved list, so the two can silently drift.

**Fix:**

1. Return the resolved `permissions: PermissionName[]` array (the same
   shape `PermissionResolverService` already builds for the JWT strategy)
   on whatever endpoint the admin frontend calls for "who am I" (`/auth/me`
   or an admin-specific equivalent — check `AdminMeResponse` shape on the
   frontend, `src/features/admin/auth/types/admin-auth.types.ts`).
2. Frontend follow-up (tracked in ROADMAP.md, not this repo): swap
   `useAdminPermission()` to check membership in that real `permissions`
   array instead of looking up a locally-hardcoded role→permission map.
   `admin-permissions.ts` and its 7-role enum can then be deleted — one
   source of truth (this backend), not two.

### 0b-ii. No field-level granularity between "update stock" and "update everything"

`PRODUCTS_UPDATE` is the only permission gating `PATCH /admin/products/:id`
and the variant update/delete routes — but the DTOs
(`UpdateAdminProductDto`, `UpdateProductVariantDto`) accept every field
(name, price, category, SKU, images, SEO, not just stock). An account
intended to be inventory-only (granted `PRODUCTS_UPDATE` so it can adjust
stock counts) can therefore also rewrite price/name/category via a direct
API call — the UI never shows those fields to that role, but the backend
doesn't stop it either.

**Fix — a dedicated stock-only endpoint, separately permissioned** (mirrors
how variants already have their own controller instead of overloading the
product one):

```ts
// New permission constant — src/common/constants/permissions.ts
PRODUCTS_UPDATE_STOCK: 'products.update_stock',
```

```ts
// src/modules/admin/admin-products/dto/update-product-stock.dto.ts (new)
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class UpdateProductStockDto {
  @ApiProperty({ example: 42, minimum: 0 })
  @IsInt()
  @Min(0)
  stock: number;
}
```

```ts
// admin-products.controller.ts — new route, narrower permission
@Patch(':id/stock')
@RequirePermissions(PERMISSIONS.PRODUCTS_UPDATE_STOCK)
updateStock(@Param('id') id: string, @Body() dto: UpdateProductStockDto) {
  return this.adminProductsService.updateStock(id, dto.stock);
}
```

Grant `PRODUCTS_UPDATE_STOCK` (not full `PRODUCTS_UPDATE`) to whatever role
is meant to be inventory-only, in `role-permissions.seed.ts`. Same pattern
applies to the variant stock field if variants need the same split.

### 0b-iii. `staff.*` / `customers.*` / `analytics.view` permissions are defined but unused

These are all in `permissions.ts` and seeded in `role-permissions.seed.ts`
(granted to `ADMIN`/`SUPER_ADMIN`), but no controller in the repo checks
them — `admin.controller.ts` is an empty stub. If the frontend's
`users:read`/`users:manage` UI ever calls a real endpoint, confirm that
endpoint exists and is actually permission-gated before treating that
surface as safe — right now there's nothing to protect because there's
nothing built.

### Structural note: no global guard backstop

`app.module.ts` registers only `ThrottlerGuard` via `APP_GUARD` (rate
limiting) — `JwtAuthGuard`/`PermissionsGuard` are opt-in per controller,
with no framework-level default. Every current controller opts in
correctly, but a future controller that forgets `@UseGuards(...)` would be
completely unprotected and nothing would catch it. **Recommend flipping the
default:** apply `JwtAuthGuard` (or a combined auth+permissions guard)
globally via `APP_GUARD`, and add a `@Public()` decorator (reflector-based,
same mechanism `PermissionsGuard` already uses) for the genuinely public
routes (`health`, `catalog`, `auth` login/register, guest checkout/cart).
"Secure by default, opt out for public" fails safer than the reverse.

---

## 0c. Two small schema fields needed for admin badge/discount UX (found 2026-08-16)

**Context:** the frontend already has a working discount mechanism
(`price` + `compareAtPrice` → an automatic "Save X%" badge on the shop —
see `entities/product/model/product-utils.ts`) and a generic `badge`
"slot" that's currently only ever computed (discount % or "Featured"),
never admin-set. The admin panel now has a friendly "Discount %" control
built entirely on the existing fields (no backend change needed — done).
Two follow-on asks from the user DO need new fields:

**i. "This is our own brand" flag, for a badge on that brand's products.**
Add `isOwnBrand: boolean` (default `false`) to the `Brand` model, and to
`CreateAdminBrandDto`/`UpdateAdminBrandDto`/`AdminBrandResponseDto` (and
the public brand DTOs, since the storefront needs to read it too). Once
this exists, the frontend adds a checkbox to `AdminBrandsManager.tsx`'s
form and a badge computed from `product.brand?.isOwnBrand` — no other
backend work needed, this is a single boolean column.

**ii. A free-text custom badge per product** (e.g. "New Arrival", "Summer
Sale" — literally anything the admin wants to type, not just the
auto-computed discount/featured badges). Add `badgeText: string | null`
(nullable, optional) to the `Product` model and to
`CreateAdminProductDto`/`UpdateAdminProductDto`/the public product DTOs.
Frontend adds a text input to `AdminProductForm.tsx`'s Media/Basic section
and gives it priority over the auto-computed badge in
`catalog-product-mappers.ts` (custom text → discount % → "Featured" →
nothing).

**Also relevant here — already tracked, just cross-referencing:** "New
Arrival" (a badge computed from how recently a product was created) is
blocked on the SAME gap noted in §1 below — `PublicProductListItemResponseDto`
has no `createdAt` field, so the frontend can't compute recency for the
shop grid at all today. If `createdAt` gets added to the public DTO while
implementing §1's pagination work, "New Arrival" becomes a pure frontend
add (no extra backend work) — worth doing both in the same pass.

---

## 1. Catalog: server-side pagination + search + filter + sort

**Problem:** `GET /products` returns every active product with no params
(`catalog.controller.ts` — no `@Query`). The frontend currently filters
in memory, which won't scale past ~100 products.

### 1a. New DTO — `src/modules/catalog/dto/catalog-query.dto.ts`

```ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export const CATALOG_SORT_OPTIONS = [
  'featured',
  'newest',
  'price-asc',
  'price-desc',
] as const;

export type CatalogSortOption = (typeof CATALOG_SORT_OPTIONS)[number];

export class CatalogQueryDto {
  @ApiPropertyOptional({ example: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 24, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 24;

  @ApiPropertyOptional({ example: 'candle' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'home-decor', description: 'category slug' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ enum: CATALOG_SORT_OPTIONS, example: 'newest' })
  @IsOptional()
  @IsIn(CATALOG_SORT_OPTIONS)
  sort?: CatalogSortOption = 'featured';
}
```

### 1b. Paginated response DTO — add to catalog dto/

```ts
import { ApiProperty } from '@nestjs/swagger';
import { PublicProductListItemResponseDto } from './public-product-list-item-response.dto';

export class PaginatedProductsResponseDto {
  @ApiProperty({ type: [PublicProductListItemResponseDto] })
  items: PublicProductListItemResponseDto[];

  @ApiProperty({ example: 137 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 24 })
  limit: number;

  @ApiProperty({ example: 6 })
  pageCount: number;
}
```

### 1c. Controller — replace `findProducts()`

```ts
@Get('products')
@ApiOperation({ summary: 'Public: get active products (paginated)' })
@ApiOkResponse({ type: PaginatedProductsResponseDto })
findProducts(@Query() query: CatalogQueryDto) {
  return this.catalogService.findProducts(query);
}
```

### 1d. Service — `findProducts(query)` with Prisma

```ts
async findProducts(query: CatalogQueryDto) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 24;

  const where: Prisma.ProductWhereInput = {
    ...this.getActiveProductWhere(),
    ...(query.category
      ? { category: { slug: query.category } }
      : {}),
    ...(query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' } },
            { shortDescription: { contains: query.search, mode: 'insensitive' } },
            { keywords: { has: query.search.toLowerCase() } },
          ],
        }
      : {}),
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput[] =
    query.sort === 'newest'
      ? [{ createdAt: Prisma.SortOrder.desc }]
      : query.sort === 'price-asc'
        ? [{ price: Prisma.SortOrder.asc }]
        : query.sort === 'price-desc'
          ? [{ price: Prisma.SortOrder.desc }]
          : [
              { isFeatured: Prisma.SortOrder.desc },
              { createdAt: Prisma.SortOrder.desc },
            ];

  const [total, products] = await this.prisma.$transaction([
    this.prisma.product.count({ where }),
    this.prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      select: publicProductListSelect,
    }),
  ]);

  return {
    items: products.map((p) => this.toPublicProductListItem(p)),
    total,
    page,
    limit,
    pageCount: Math.max(1, Math.ceil(total / limit)),
  };
}
```

**⚠️ Breaking change note:** the response shape changes from `Product[]`
to `{ items, total, page, limit, pageCount }`. Deploy backend + update
frontend together (frontend Phase 5B adapts `catalog-api.ts`, the shop
page, sitemap, and adds pagination UI).

**DB indexes** (Prisma schema) for scale:
`@@index([status, isFeatured, createdAt])`, `@@index([price])`, and an
index on `category.slug` if not already present.

---

## 2. Smaller items the frontend flagged

- **Admin dashboard stats endpoint** — `GET /admin/stats` (orders today,
  revenue, low-stock count). Frontend currently counts client-side from
  the full orders list; won't scale past a few hundred orders.
- **Password reset / OTP endpoints** — `/auth/forgot-password` +
  `/auth/reset-password` (needs email sending). Frontend auth pages for
  these were removed until this exists.
- **Cart merge endpoint (optional)** — `POST /cart/merge` (guest cart →
  user cart server-side). Frontend currently replays items one-by-one
  after login; a single endpoint would be atomic and faster.
- **Image upload** — Cloudinary/S3 endpoint. Admin product/variant image
  fields are currently raw URL text inputs (frontend added a host-allowlist
  safety check so a bad URL degrades to a placeholder instead of crashing,
  but a real upload flow is still the right long-term fix).
