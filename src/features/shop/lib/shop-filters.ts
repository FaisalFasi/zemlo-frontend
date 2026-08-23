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

function resolvePage(value: string | string[] | undefined) {
  const parsed = Number(getSingleParam(value));

  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

export function resolveShopSearchParams(
  searchParams: ShopSearchParams,
): ResolvedShopSearchParams {
  const sort = getSingleParam(searchParams.sort);

  return {
    q: getSingleParam(searchParams.q).trim(),
    category: getSingleParam(searchParams.category).trim(),
    brand: getSingleParam(searchParams.brand).trim(),
    sort: isShopSortOption(sort) ? sort : "featured",
    page: resolvePage(searchParams.page),
  };
}

export function filterAndSortShopProducts(
  products: ShopProduct[],
  params: ResolvedShopSearchParams,
) {
  const query = params.q.toLowerCase();

  // Demo-catalog products only carry a brand NAME (`product.brand`), not a
  // slug — the real catalog's brand filter matches by slug via the
  // backend. Rather than guess a name<->slug match, brand filtering is
  // simply not applied in demo mode (an edge-case fallback for an empty
  // real catalog, not the primary experience).
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
  basePath = "/shop",
) {
  const nextParams = new URLSearchParams();

  // Changing a filter (category, search, sort) restarts pagination — carry
  // the page number forward ONLY when the caller explicitly sets it (that's
  // exactly what the pagination links do).
  const next = {
    ...current,
    page: 1,
    ...updates,
  };

  if (next.q) nextParams.set("q", next.q);
  if (next.category) nextParams.set("category", next.category);
  if (next.brand) nextParams.set("brand", next.brand);
  if (next.sort && next.sort !== "featured") nextParams.set("sort", next.sort);
  if (next.page > 1) nextParams.set("page", String(next.page));

  const queryString = nextParams.toString();

  return queryString ? `${basePath}?${queryString}` : basePath;
}
