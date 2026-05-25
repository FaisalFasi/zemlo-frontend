import type {
  CatalogCategory,
  CatalogProductListItem,
} from "@/features/catalog/types/catalog.types";

import type { ShopCategoryFilter, ShopProduct } from "../types/shop.types";

function toNumber(value: string | number | null | undefined) {
  if (value === null || value === undefined) return undefined;

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}

function getProductImage(product: CatalogProductListItem) {
  const defaultImage = product.images.find((image) => image.isDefault);
  const firstImage = product.images[0];
  const variantImage = product.variants.find((variant) => variant.image)?.image;

  return (
    defaultImage?.url ??
    firstImage?.url ??
    variantImage ??
    "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1000&auto=format&fit=crop"
  );
}

function getDiscountBadge(price?: number, compareAtPrice?: number) {
  if (!price || !compareAtPrice || compareAtPrice <= price) return undefined;

  const discount = Math.round(
    ((compareAtPrice - price) / compareAtPrice) * 100,
  );

  return `Save ${discount}%`;
}

export function mapCatalogProductToShopProduct(
  product: CatalogProductListItem,
): ShopProduct {
  const price = toNumber(product.price) ?? 0;
  const compareAtPrice = toNumber(product.compareAtPrice);

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    brand: product.brand?.name ?? "Zemlo",
    category: product.category.name,
    categorySlug: product.category.slug,
    image: getProductImage(product),
    price,
    compareAtPrice,
    stock: product.stock,
    isFeatured: product.isFeatured,
    badge:
      getDiscountBadge(price, compareAtPrice) ??
      (product.isFeatured ? "Featured" : undefined),
  };
}

export function createShopCategoriesFromProducts(
  products: ShopProduct[],
): ShopCategoryFilter[] {
  const categoryMap = new Map<string, ShopCategoryFilter>();

  for (const product of products) {
    const existing = categoryMap.get(product.categorySlug);

    if (existing) {
      existing.productCount += 1;
      continue;
    }

    categoryMap.set(product.categorySlug, {
      id: product.categorySlug,
      name: product.category,
      slug: product.categorySlug,
      productCount: 1,
    });
  }

  return Array.from(categoryMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}

export function mapCatalogCategoriesToShopCategories(
  categories: CatalogCategory[],
  products: ShopProduct[],
): ShopCategoryFilter[] {
  const countBySlug = new Map<string, number>();

  for (const product of products) {
    countBySlug.set(
      product.categorySlug,
      (countBySlug.get(product.categorySlug) ?? 0) + 1,
    );
  }

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    productCount: countBySlug.get(category.slug) ?? 0,
  }));
}
