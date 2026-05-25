export type ShopSortOption = "featured" | "newest" | "price-asc" | "price-desc";

export type ShopProduct = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  categorySlug: string;
  image: string;
  price: number;
  compareAtPrice?: number;
  badge?: string;
  stock?: number;
  isFeatured?: boolean;
};

export type ShopCategoryFilter = {
  id: string;
  name: string;
  slug: string;
  productCount: number;
};

export type ShopSearchParams = {
  q?: string | string[];
  category?: string | string[];
  sort?: string | string[];
};

export type ResolvedShopSearchParams = {
  q: string;
  category: string;
  sort: ShopSortOption;
};
