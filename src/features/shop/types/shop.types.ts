import type { ProductCard, ProductCategoryFilter } from "@/entities/product";

export type ShopProduct = ProductCard;
export type ShopCategoryFilter = ProductCategoryFilter;

export type ShopSortOption = "featured" | "newest" | "price-asc" | "price-desc";

export type ShopSearchParams = {
  q?: string | string[];
  category?: string | string[];
  sort?: string | string[];
  page?: string | string[];
};

export type ResolvedShopSearchParams = {
  q: string;
  category: string;
  sort: ShopSortOption;
  page: number;
};
