import { apiFetch } from "@/lib/api/api-client";

import type {
  CatalogBrand,
  CatalogCategory,
  CatalogProductDetail,
  CatalogProductListItem,
} from "../types/catalog.types";

export async function getCatalogProducts() {
  return apiFetch<CatalogProductListItem[]>("/products", {
    cache: "no-store",
  });
}

export async function getCatalogProductBySlug(slug: string) {
  return apiFetch<CatalogProductDetail>(`/products/${slug}`, {
    cache: "no-store",
  });
}

export async function getCatalogCategories() {
  return apiFetch<CatalogCategory[]>("/categories", {
    cache: "no-store",
  });
}

export async function getCatalogBrands() {
  return apiFetch<CatalogBrand[]>("/brands", {
    cache: "no-store",
  });
}
