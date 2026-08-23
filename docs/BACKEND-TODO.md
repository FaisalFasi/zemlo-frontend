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

> Apply these in the `zemlo-backend` repo. After deploying anything that
> changes the API surface, run `npm run api:generate` in the frontend so
> the typed client picks up the new shapes.
>
> **Status as of 2026-08-17:** §0, §0's guard-backstop note, §1, and §2 are
> all ✅ DONE — confirmed live and already wired into the frontend. What's
> still actually open for the backend repo: **§0b-ii** (stock-only
> permission split), **§0b-iii** (`staff.*`/`customers.*` permissions have
> no controller yet — informational, not urgent), and **§0c** (two schema
> fields — `Brand.isOwnBrand`, `Product.badgeText`).

---

## 0. ✅ DONE — Automate expired-inventory release (found 2026-07-20, resolved by 2026-08-17)

**Resolved — confirmed live in the actual repo, not just assumed:**
`InventoryReleaseCron` exists at
`src/modules/payments/services/inventory-release.cron.ts`, registered as a
provider in `payments.module.ts`, firing `@Cron(CronExpression.EVERY_5_MINUTES)`
against `ExpiredReservationReleaseService.release()`. It shipped even more
robust than the original ask below: config-driven
`inventory.expiredReservationRelease.enabled` flag and `batchLimit`, plus a
`skippedCount` in its log line. `ScheduleModule.forRoot()` is registered in
`app.module.ts`. Nothing further needed here — original spec kept below for
history only.

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

**Verified against the actual current repo** (not guessed) — here's every
file that needs a change, in order, matching the exact style already used
in each file.

**Note on who'd actually get this permission:** today `STAFF`'s role
defaults are `[PRODUCTS_VIEW, CATEGORIES_VIEW, BRANDS_VIEW,
ORDERS_VIEW_ALL, CUSTOMERS_VIEW]` — no product-mutating permission at all
— and `ADMIN` already gets full `PRODUCTS_UPDATE`. So there's no existing
role that's "inventory-only" today. Either (a) add
`PRODUCTS_UPDATE_STOCK` to `STAFF`'s array below to make every staff
account inventory-capable by default, or (b) leave `STAFF`'s defaults
alone and grant it per-account via a `UserPermission` row for just the
specific staff member meant to be inventory-only. (b) is the narrower,
safer choice if only some staff should have it.

**1. New permission constant — `src/common/constants/permissions.ts`**
(add inside the existing `PRODUCTS` group):

```ts
export const PERMISSIONS = {
  PRODUCTS_VIEW: 'products.view',
  PRODUCTS_CREATE: 'products.create',
  PRODUCTS_UPDATE: 'products.update',
  PRODUCTS_UPDATE_STOCK: 'products.update_stock', // ← new
  PRODUCTS_DELETE: 'products.delete',
  // ...rest unchanged
} as const;
```

**2. Register it as a real `Permission` row — `prisma/seeds/permissions.seed.ts`**
(a constant alone isn't enough — `PermissionsGuard` ultimately checks a
user's resolved permissions against DB-backed `RolePermission`/
`UserPermission` rows, which requires a matching `Permission` row to exist
first). Add to the `// PRODUCTS` block in `permissionsData`:

```ts
  {
    name: PERMISSIONS.PRODUCTS_UPDATE_STOCK,
    displayName: 'Update Product Stock',
    description: 'Can update product stock counts only, not other fields',
    category: PermissionCategory.PRODUCTS,
  },
```

**3. Grant it to a role — `prisma/seeds/role-permissions.seed.ts`**
(only if going with option (a) above; skip this step for option (b) and
grant via `UserPermission` instead):

```ts
  [UserRole.STAFF]: [
    PERMISSIONS.PRODUCTS_VIEW,
    PERMISSIONS.PRODUCTS_UPDATE_STOCK, // ← new
    PERMISSIONS.CATEGORIES_VIEW,
    PERMISSIONS.BRANDS_VIEW,
    PERMISSIONS.ORDERS_VIEW_ALL,
    PERMISSIONS.CUSTOMERS_VIEW,
  ],
```

Then re-run the permission/role-permission seed so the new `Permission` row
and grant actually exist in the DB (a raw `git push` of seed *code* changes
nothing by itself).

**4. New DTO — `src/modules/admin/admin-products/dto/update-product-stock.dto.ts`**
(matching the exact `stock` field style already used in
`create-admin-product.dto.ts`):

```ts
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class UpdateProductStockDto {
  @ApiProperty({ example: 42, minimum: 0 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock: number;
}
```

Export it from the module's `dto/index.ts` barrel alongside the existing
`AdminProductResponseDto`/`CreateAdminProductDto`/`UpdateAdminProductDto`.

**5. New route — `src/modules/admin/admin-products/admin-products.controller.ts`**
(add next to the existing `update()` method; no `@UseGuards(...)` needed —
the global `JwtAuthGuard`+`PermissionsGuard` already cover this controller,
same as every route already in this file):

```ts
  @Patch(':id/stock')
  @RequirePermissions(PERMISSIONS.PRODUCTS_UPDATE_STOCK)
  @ApiOperation({ summary: 'Admin: update product stock only' })
  @ApiOkResponse({ type: AdminProductResponseDto })
  updateStock(@Param('id') id: string, @Body() dto: UpdateProductStockDto) {
    return this.adminProductsService.updateStock(id, dto.stock);
  }
```

**6. New service method — `src/modules/admin/admin-products/admin-products.service.ts`**
(mirrors the existing `update()` method's not-found/archived guard and
response shape exactly):

```ts
  async updateStock(id: string, stock: number) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct || existingProduct.status === ProductStatus.ARCHIVED) {
      throw new NotFoundException('Product not found');
    }

    const product = await this.prisma.product.update({
      where: { id },
      data: { stock },
      include: this.getProductInclude(),
    });

    return this.toProductResponse(product);
  }
```

Same pattern applies to the variant stock field in
`ProductVariant`/`UpdateProductVariantDto` if variants need the same split
— not written out here since it wasn't confirmed whether that's actually
needed yet.

### 0b-iii. Partially resolved — `analytics.view` is now checked, `staff.*`/`customers.*` are still defined but unused

**Re-checked 2026-08-17 against the current repo:** `admin.controller.ts`
is no longer an empty stub — it now has a real `GET /admin/stats` route
gated on `@RequirePermissions(PERMISSIONS.ANALYTICS_VIEW)`. That's exactly
the endpoint the frontend's `AdminDashboardStats.tsx` calls, and it's
genuinely permission-gated. **`analytics.view` is resolved — no longer a
gap.**

`staff.*` (`STAFF_VIEW/CREATE/UPDATE/DISABLE/PERMISSIONS`) and `customers.*`
(`CUSTOMERS_VIEW/UPDATE/DISABLE`) are still in `permissions.ts` and seeded
in `role-permissions.seed.ts` (granted to `ADMIN`/`SUPER_ADMIN` — see the
full role map in §0b-ii above), but a repo-wide search for
`PERMISSIONS.STAFF_` / `PERMISSIONS.CUSTOMERS_` outside `permissions.ts`
and the seed files turns up **zero controllers checking them** — there's
no staff-management or customer-management controller in the repo yet. If
the frontend's `users:read`/`users:manage` UI ever calls a real endpoint,
confirm that endpoint exists and is actually permission-gated before
treating that surface as safe — right now there's nothing to protect
because there's nothing built.

### Structural note: no global guard backstop — ✅ DONE

**Resolved.** Confirmed directly in `src/app.module.ts`: `ThrottlerGuard`,
`JwtAuthGuard`, and `PermissionsGuard` are all now registered globally via
three `APP_GUARD` providers, in that order (`JwtAuthGuard` populates
`request.user` before `PermissionsGuard` reads it). This is exactly the
"secure by default, opt out for public" flip that was recommended below —
no controller needs `@UseGuards(...)` anymore, `@RequirePermissions(...)`
metadata is all that's needed, and a `@Public()` opt-out exists for the
genuinely public routes. Nothing further needed. Original recommendation
kept below for history.

`app.module.ts` used to register only `ThrottlerGuard` via `APP_GUARD` (rate
limiting) — `JwtAuthGuard`/`PermissionsGuard` were opt-in per controller,
with no framework-level default. A future controller that forgot
`@UseGuards(...)` would have been completely unprotected and nothing would
have caught it.

---

## 0c. Two small schema fields needed for admin badge/discount UX (found 2026-08-16)

**Context:** the frontend already has a working discount mechanism
(`price` + `compareAtPrice` → an automatic "Save X%" badge on the shop —
see `entities/product/model/product-utils.ts`) and a generic `badge`
"slot" that's currently only ever computed (discount % or "Featured"),
never admin-set. The admin panel now has a friendly "Discount %" control
built entirely on the existing fields (no backend change needed — done).
Two follow-on asks from the user DO need new fields:

**Verified against the actual current repo** — exact model/file locations
and matching decorator style confirmed, not guessed.

**i. "This is our own brand" flag, for a badge on that brand's products.**

`Brand` isn't in its own file — it lives inside `prisma/schema/Product.prisma`
alongside `Product`/`Category`. Add one line:

```prisma
model Brand {
  id          String  @id @default(uuid())
  name        String  @unique
  slug        String  @unique
  description String? @db.Text
  logo        String?
  website     String?
  isActive    Boolean @default(true)
  isOwnBrand  Boolean @default(false) // ← new

  metaTitle       String?
  metaDescription String? @db.Text

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  products Product[]

  @@index([slug])
  @@index([isActive])
  @@map("brands")
}
```

Then add the field to these 4 DTOs, matching each file's exact existing
decorator style:

```ts
// src/modules/admin/brands/dto/create-admin-brand.dto.ts
// (add after isActive — UpdateAdminBrandDto auto-inherits it via PartialType)
  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  isOwnBrand?: boolean;
```

```ts
// src/modules/admin/brands/dto/admin-brand-response.dto.ts
// (add to AdminBrandResponseDto)
  @ApiProperty({ type: Boolean })
  isOwnBrand: boolean;
```

```ts
// src/modules/catalog/dto/catalog-brand-response.dto.ts
// (add to PublicBrandResponseDto — the storefront needs to read this)
  @ApiProperty({ type: Boolean })
  isOwnBrand: boolean;
```

Once this exists, the frontend adds a checkbox to
`AdminBrandsManager.tsx`'s form and a badge computed from
`product.brand?.isOwnBrand` — no other backend work needed.

**ii. A free-text custom badge per product** (e.g. "New Arrival", "Summer
Sale" — literally anything the admin wants to type, not just the
auto-computed discount/featured badges).

```prisma
// prisma/schema/Product.prisma — add to model Product, near metaTitle/metaDescription
  badgeText String? // ← new, nullable/optional — free text, e.g. "New Arrival"
```

```ts
// src/modules/admin/admin-products/dto/create-admin-product.dto.ts
// (add near metaTitle/metaDescription — UpdateAdminProductDto auto-inherits via PartialType)
  @ApiPropertyOptional({ example: 'New Arrival' })
  @IsOptional()
  @IsString()
  @Length(2, 40)
  badgeText?: string;
```

```ts
// src/modules/catalog/dto/catalog-product-response.dto.ts
// (add to PublicProductListItemResponseDto — the shop grid needs to read this)
  @ApiProperty({ type: String, nullable: true })
  badgeText: string | null;
```

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

## 1. ✅ DONE — Catalog: server-side pagination + search + filter + sort

**Resolved — shipped 2026-08-16, verified live against `/api-json` (47
paths, up from the pre-deploy 42), and fully consumed on the frontend**
(`getCatalogProductsPage()` in `catalog-api.ts`, paginated `ShopPage` +
`ShopPagination`, see IMPLEMENTATION.md "Paginated Shop UI"). The shipped
version also added a `brand` query param (brand slug) beyond the original
ask below — the frontend's shop Brand filter consumes it directly.

**One gap still open, tracked for whenever this DTO is touched next:**
`PublicProductListItemResponseDto` still has no `createdAt` field, so the
frontend can't compute product recency for a "New Arrival" badge. Cross-
referenced in §0c below — if `createdAt` gets added here, "New Arrival"
becomes a pure frontend add with zero further backend work.

Original spec kept below for history/reference — it's what shipped, minus
the `brand` param noted above.

**Problem (as originally found):** `GET /products` returned every active
product with no params (`catalog.controller.ts` — no `@Query`). The
frontend filtered in memory, which wouldn't have scaled past ~100 products.

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

## 2. ✅ DONE — Smaller items the frontend flagged

**Resolved — all four shipped 2026-08-16 alongside §1, verified live, and
wired end-to-end on the frontend:**

- **Admin dashboard stats endpoint** — `GET /admin/stats` is live. Frontend
  reads it via `useAdminStatsQuery()`, gated on the `analytics.view`
  permission (`AdminDashboardStats.tsx`) — no more client-side counting
  from the full orders list.
- **Password reset / OTP endpoints** — `/auth/forgot-password` +
  `/auth/reset-password` are live. Frontend auth pages
  (`app/(auth)/forgot-password`, `app/(auth)/reset-password`) restored.
- **Cart merge endpoint** — `POST /cart/merge` is live. Frontend
  `mergeGuestCartIntoUser()` calls it directly instead of replaying items
  one-by-one after login.
- **Image upload** — live via the admin upload route. Frontend added a
  multipart proxy (`app/api/admin/uploads/image/route.ts`) plus an Upload
  button next to the Image URL field in `AdminProductForm.tsx`. The
  host-allowlist safety check (`shared/lib/safe-image-url.ts`) stays in
  place regardless, as defense against any bad/foreign URL.
