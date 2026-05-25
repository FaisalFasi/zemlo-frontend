import { apiFetch } from "@/lib/api/api-client";

import type {
  CatalogBrand,
  CatalogCategory,
  CatalogProductDetail,
  CatalogProductListItem,
} from "../types/catalog.types";

const CATALOG_REVALIDATE_SECONDS = 60;

export async function getCatalogProducts() {
  return apiFetch<CatalogProductListItem[]>("/products", {
    next: {
      revalidate: CATALOG_REVALIDATE_SECONDS,
      tags: ["catalog-products"],
    },
  });
}

export async function getCatalogProductBySlug(slug: string) {
  return apiFetch<CatalogProductDetail>(`/products/${slug}`, {
    next: {
      revalidate: CATALOG_REVALIDATE_SECONDS,
      tags: ["catalog-products", `catalog-product-${slug}`],
    },
  });
}

export async function getCatalogCategories() {
  return apiFetch<CatalogCategory[]>("/categories", {
    next: {
      revalidate: CATALOG_REVALIDATE_SECONDS,
      tags: ["catalog-categories"],
    },
  });
}

export async function getCatalogBrands() {
  return apiFetch<CatalogBrand[]>("/brands", {
    next: {
      revalidate: CATALOG_REVALIDATE_SECONDS,
      tags: ["catalog-brands"],
    },
  });
}
