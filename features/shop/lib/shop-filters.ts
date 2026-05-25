import type {
  ResolvedShopSearchParams,
  ShopProduct,
  ShopSearchParams,
  ShopSortOption,
} from "../types/shop.types";

const sortOptions = ["featured", "newest", "price-asc", "price-desc"] as const;

function getSingleParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function isShopSortOption(value: string): value is ShopSortOption {
  return sortOptions.includes(value as ShopSortOption);
}

export function resolveShopSearchParams(
  searchParams: ShopSearchParams,
): ResolvedShopSearchParams {
  const sort = getSingleParam(searchParams.sort);

  return {
    q: getSingleParam(searchParams.q).trim(),
    category: getSingleParam(searchParams.category).trim(),
    sort: isShopSortOption(sort) ? sort : "featured",
  };
}

export function filterAndSortShopProducts(
  products: ShopProduct[],
  params: ResolvedShopSearchParams,
) {
  const query = params.q.toLowerCase();

  const filtered = products.filter((product) => {
    const matchesQuery =
      query.length === 0 ||
      product.name.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query);

    const matchesCategory =
      params.category.length === 0 || product.categorySlug === params.category;

    return matchesQuery && matchesCategory;
  });

  return filtered.sort((a, b) => {
    if (params.sort === "price-asc") return a.price - b.price;
    if (params.sort === "price-desc") return b.price - a.price;

    if (params.sort === "newest") {
      return b.id.localeCompare(a.id);
    }

    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;

    return a.name.localeCompare(b.name);
  });
}

export function createShopHref(
  current: ResolvedShopSearchParams,
  updates: Partial<ResolvedShopSearchParams>,
) {
  const nextParams = new URLSearchParams();

  const next = {
    ...current,
    ...updates,
  };

  if (next.q) nextParams.set("q", next.q);
  if (next.category) nextParams.set("category", next.category);
  if (next.sort && next.sort !== "featured") nextParams.set("sort", next.sort);

  const queryString = nextParams.toString();

  return queryString ? `/shop?${queryString}` : "/shop";
}
