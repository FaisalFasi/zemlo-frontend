import {
  catalogControllerFindBrands,
  catalogControllerFindCategories,
  catalogControllerFindProductBySlug,
  catalogControllerFindProducts,
} from "@/shared/api/generated/catalog/catalog";
import type { CatalogControllerFindProductsParams } from "@/shared/api/generated/schemas";

import type {
  CatalogBrand,
  CatalogCategory,
  CatalogProductDetail,
  CatalogProductListItem,
} from "../types/catalog.types";

export type CatalogProductsQuery = CatalogControllerFindProductsParams;

// GET /products is paginated server-side (page/limit/search/category/
// brand/sort) — this returns exactly what the backend sends
// ({items, total, page, limit, pageCount}). Use this for real paginated
// UI (page-number controls, server-side search/sort/filter).
export async function getCatalogProductsPage(query?: CatalogProductsQuery) {
  return catalogControllerFindProducts(query);
}

const MAX_PAGE_SIZE = 100;

// Fetches every product across as many pages as it takes. Only for
// call sites that genuinely need the WHOLE catalog at once (sitemap,
// home-page sections, the shop grid until it gets real pagination UI —
// see ROADMAP.md Phase 5B) — not a general-purpose "list products" call.
export async function getAllCatalogProducts(): Promise<
  CatalogProductListItem[]
> {
  const first = await catalogControllerFindProducts({
    page: 1,
    limit: MAX_PAGE_SIZE,
  });
  const items = [...first.items];

  for (let page = 2; page <= first.pageCount; page += 1) {
    const next = await catalogControllerFindProducts({
      page,
      limit: MAX_PAGE_SIZE,
    });

    items.push(...next.items);
  }

  return items;
}

export async function getCatalogProductBySlug(
  slug: string,
): Promise<CatalogProductDetail> {
  return catalogControllerFindProductBySlug(
    slug,
  ) as Promise<CatalogProductDetail>;
}

export async function getCatalogCategories(): Promise<CatalogCategory[]> {
  return catalogControllerFindCategories() as Promise<CatalogCategory[]>;
}

export async function getCatalogBrands(): Promise<CatalogBrand[]> {
  return catalogControllerFindBrands() as Promise<CatalogBrand[]>;
}
