import {
  BadgePercent,
  Gamepad2,
  Home as HomeIcon,
  Laptop,
  Shirt,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

import type {
  CatalogBrand,
  CatalogCategory,
  CatalogProductListItem,
} from "@/features/catalog/types/catalog.types";

import {
  featuredBrands as fallbackBrands,
  homeCategories as fallbackCategories,
  type HomeBrand,
  type HomeCategory,
  type HomeCategoryRail,
  type HomeProduct,
} from "../data/home-page-data";
import {
  demoCategoryRails,
  demoFeaturedDeals,
  demoPopularProducts,
} from "../data/demo-catalog";

type CreateHomePageDataInput = {
  products: CatalogProductListItem[];
  categories: CatalogCategory[];
  brands: CatalogBrand[];
  useDemoCatalog: boolean;
};

type HomePageCatalogData = {
  categories: HomeCategory[];
  featuredDeals: HomeProduct[];
  popularProducts: HomeProduct[];
  categoryRails: HomeCategoryRail[];
  brands: HomeBrand[];
  isDemoCatalog: boolean;
};

const MIN_PRODUCT_RAIL_ITEMS = 4;

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

function getCategoryIcon(slugOrName: string) {
  const value = slugOrName.toLowerCase();

  if (value.includes("electronic") || value.includes("tech")) return Laptop;
  if (value.includes("fashion") || value.includes("cloth")) return Shirt;
  if (value.includes("home") || value.includes("living")) return HomeIcon;
  if (value.includes("beauty") || value.includes("care")) return Sparkles;
  if (value.includes("game")) return Gamepad2;
  if (value.includes("deal") || value.includes("sale")) return BadgePercent;

  return ShoppingBag;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function toHomeProduct(product: CatalogProductListItem): HomeProduct {
  const price = toNumber(product.price) ?? 0;
  const compareAtPrice = toNumber(product.compareAtPrice);

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    brand: product.brand?.name ?? "Zemlo",
    category: product.category.name,
    image: getProductImage(product),
    price,
    compareAtPrice,
    badge:
      getDiscountBadge(price, compareAtPrice) ??
      (product.isFeatured ? "Featured" : undefined),
  };
}

function toHomeCategory(category: CatalogCategory): HomeCategory {
  return {
    id: category.id,
    name: category.name,
    description:
      category.description ??
      `Explore ${category.name.toLowerCase()} products and everyday essentials.`,
    href: `/shop?category=${category.slug}`,
    image:
      category.image ??
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200&auto=format&fit=crop",
    icon: getCategoryIcon(`${category.slug} ${category.name}`),
  };
}

function toHomeBrand(brand: CatalogBrand): HomeBrand {
  return {
    id: brand.id,
    name: brand.name,
    description:
      brand.description ??
      `Explore products from ${brand.name} on Zemlo marketplace.`,
    href: `/brands/${brand.slug}`,
    logoLabel: getInitials(brand.name) || "BR",
  };
}

function getFeaturedDeals(products: HomeProduct[], useDemoCatalog: boolean) {
  const discountedProducts = products.filter(
    (product) =>
      product.compareAtPrice !== undefined &&
      product.compareAtPrice > product.price,
  );

  if (discountedProducts.length >= MIN_PRODUCT_RAIL_ITEMS) {
    return discountedProducts.slice(0, 10);
  }

  if (products.length >= MIN_PRODUCT_RAIL_ITEMS) {
    return products.slice(0, 10);
  }

  return useDemoCatalog ? demoFeaturedDeals : [];
}

function getPopularProducts(products: HomeProduct[], useDemoCatalog: boolean) {
  if (products.length >= MIN_PRODUCT_RAIL_ITEMS) {
    return products.slice(0, 10);
  }

  return useDemoCatalog ? demoPopularProducts : [];
}

function getCategoryRails(
  products: HomeProduct[],
  categories: HomeCategory[],
  useDemoCatalog: boolean,
): HomeCategoryRail[] {
  if (products.length < MIN_PRODUCT_RAIL_ITEMS) {
    return useDemoCatalog ? demoCategoryRails : [];
  }

  const rails = categories
    .map((category) => {
      const categoryProducts = products.filter(
        (product) =>
          product.category.toLowerCase() === category.name.toLowerCase(),
      );

      if (categoryProducts.length < 2) return null;

      return {
        id: `category-rail-${category.id}`,
        eyebrow: category.name,
        title: `Explore ${category.name.toLowerCase()}.`,
        description: category.description,
        href: category.href,
        products: categoryProducts.slice(0, 10),
      } satisfies HomeCategoryRail;
    })
    .filter((rail): rail is HomeCategoryRail => rail !== null)
    .slice(0, 4);

  return rails.length > 0 ? rails : useDemoCatalog ? demoCategoryRails : [];
}

export function createHomePageData({
  products,
  categories,
  brands,
  useDemoCatalog,
}: CreateHomePageDataInput): HomePageCatalogData {
  const mappedProducts = products.map(toHomeProduct);

  const mappedCategories =
    categories.length > 0
      ? categories.slice(0, 8).map(toHomeCategory)
      : fallbackCategories;

  const mappedBrands =
    brands.length > 0 ? brands.slice(0, 8).map(toHomeBrand) : fallbackBrands;

  return {
    categories: mappedCategories,
    featuredDeals: getFeaturedDeals(mappedProducts, useDemoCatalog),
    popularProducts: getPopularProducts(mappedProducts, useDemoCatalog),
    categoryRails: getCategoryRails(
      mappedProducts,
      mappedCategories,
      useDemoCatalog,
    ),
    brands: mappedBrands,
    isDemoCatalog:
      mappedProducts.length < MIN_PRODUCT_RAIL_ITEMS && useDemoCatalog,
  };
}
