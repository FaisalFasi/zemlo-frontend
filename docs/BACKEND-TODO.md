<!--
═══════════════ EXPLANATION (is change ki wajah) ═══════════════
YE KYA HAI: zemlo-backend ke liye ready-made code/spec — catalog API
mein pagination/search/filter params. Frontend ka Phase 5B is par
depend karta hai.
REASON: Abhi GET /products SAB products bhejta hai (no params) — shop
100+ products par slow hoga. Ye backend feature hai; is repo se nahi
ho sakta, is liye spec yahan document ho rahi hai.
RISK: Zero — documentation only.
═════════════════════════════════════════════════════════════════
-->

# Backend TODO — features the frontend is waiting on

> Apply these in the `zemlo-backend` repo. After deploying, run
> `npm run api:generate` in the frontend so the typed client picks up
> the new params, then finish frontend Phase 5B (see ROADMAP.md).

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
