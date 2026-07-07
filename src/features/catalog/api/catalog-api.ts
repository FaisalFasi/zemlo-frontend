import {
  catalogControllerFindBrands,
  catalogControllerFindCategories,
  catalogControllerFindProductBySlug,
  catalogControllerFindProducts,
} from "@/shared/api/generated/catalog/catalog";

import type {
  CatalogBrand,
  CatalogCategory,
  CatalogProductDetail,
  CatalogProductListItem,
} from "../types/catalog.types";

export async function getCatalogProducts(): Promise<CatalogProductListItem[]> {
  return catalogControllerFindProducts() as Promise<CatalogProductListItem[]>;
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
