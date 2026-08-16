import type { ProductCard, ProductCategoryFilter } from "@/entities/product";
import type { CatalogBrand } from "@/features/catalog/types/catalog.types";

export type ShopProduct = ProductCard;
export type ShopCategoryFilter = ProductCategoryFilter;
export type ShopBrandFilter = CatalogBrand;

export type ShopSortOption = "featured" | "newest" | "price-asc" | "price-desc";

export type ShopSearchParams = {
  q?: string | string[];
  category?: string | string[];
  brand?: string | string[];
  sort?: string | string[];
  page?: string | string[];
};

export type ResolvedShopSearchParams = {
  q: string;
  category: string;
  brand: string;
  sort: ShopSortOption;
  page: number;
};
