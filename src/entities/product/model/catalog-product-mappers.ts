import type {
  PublicCategoryResponseDto,
  PublicProductDetailResponseDto,
  PublicProductListItemResponseDto,
} from "@/shared/api/generated/schemas";

import type {
  ProductCard,
  ProductCategoryFilter,
  ProductDetail,
  ProductImage,
  ProductSpec,
  ProductVariant,
} from "./product.types";
import {
  getDiscountBadge,
  productFallbackImages,
  toNumber,
  toOptionalNumber,
} from "./product-utils";

function getProductCardImage(product: PublicProductListItemResponseDto) {
  const defaultImage = product.images.find((image) => image.isDefault);
  const firstImage = product.images[0];
  const variantImage = product.variants.find((variant) => variant.image)?.image;

  return (
    defaultImage?.url ??
    firstImage?.url ??
    variantImage ??
    productFallbackImages.card
  );
}

function mapDetailImages(
  product: PublicProductDetailResponseDto,
): ProductImage[] {
  const images = product.images.map((image) => ({
    id: image.id,
    url: image.url,
    alt: image.altText ?? product.name,
  }));

  if (images.length > 0) {
    return images;
  }

  const variantImages = product.variants
    .filter((variant) => Boolean(variant.image))
    .map((variant) => ({
      id: variant.id,
      url: variant.image as string,
      alt: variant.name,
    }));

  if (variantImages.length > 0) {
    return variantImages;
  }

  return [
    {
      id: "fallback-image",
      url: productFallbackImages.detail,
      alt: product.name,
    },
  ];
}

function mapDetailVariants(
  product: PublicProductDetailResponseDto,
): ProductVariant[] {
  return product.variants.map((variant) => {
    const price = toNumber(variant.price ?? product.price);
    const compareAtPrice = toOptionalNumber(variant.compareAtPrice);

    return {
      id: variant.id,
      name: variant.name,
      sku: variant.sku ?? null,
      price,
      compareAtPrice,
      stock: variant.stock,
      image: variant.image ?? null,
      options: variant.options,
    };
  });
}

function mapDetailSpecs(
  product: PublicProductDetailResponseDto,
): ProductSpec[] {
  const specs: ProductSpec[] = [];

  if (product.sku) {
    specs.push({
      label: "SKU",
      value: product.sku,
    });
  }

  if (product.weight) {
    specs.push({
      label: "Weight",
      value: `${product.weight}`,
    });
  }

  const dimensions = [product.length, product.width, product.height]
    .filter((value) => value !== null && value !== undefined)
    .join(" × ");

  if (dimensions) {
    specs.push({
      label: "Dimensions",
      value: dimensions,
    });
  }

  specs.push({
    label: "Category",
    value: product.category.name,
  });

  if (product.brand?.name) {
    specs.push({
      label: "Brand",
      value: product.brand.name,
    });
  }

  return specs;
}

export function mapCatalogProductToProductCard(
  product: PublicProductListItemResponseDto,
): ProductCard {
  const price = toNumber(product.price);
  const compareAtPrice = toOptionalNumber(product.compareAtPrice);

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    brand: product.brand?.name ?? "Zemlo",
    category: product.category.name,
    categorySlug: product.category.slug,
    image: getProductCardImage(product),
    price,
    compareAtPrice,
    stock: product.stock,
    isFeatured: product.isFeatured,
    badge:
      getDiscountBadge(price, compareAtPrice) ??
      (product.isFeatured ? "Featured" : undefined),
  };
}

export function mapCatalogProductToProductDetail(
  product: PublicProductDetailResponseDto,
): ProductDetail {
  const price = toNumber(product.price);
  const compareAtPrice = toOptionalNumber(product.compareAtPrice);

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description:
      product.description ??
      product.shortDescription ??
      "Product details will be updated soon.",
    shortDescription: product.shortDescription ?? undefined,
    sku: product.sku,
    brand: product.brand
      ? {
          name: product.brand.name,
          slug: product.brand.slug,
          description: product.brand.description,
        }
      : null,
    category: {
      name: product.category.name,
      slug: product.category.slug,
    },
    price,
    compareAtPrice,
    stock: product.stock,
    hasVariants: product.hasVariants,
    images: mapDetailImages(product),
    variants: mapDetailVariants(product),
    specs: mapDetailSpecs(product),
    badge:
      getDiscountBadge(price, compareAtPrice) ??
      (product.isFeatured ? "Featured" : undefined),
  };
}

export function createProductCategoriesFromCards(
  products: ProductCard[],
): ProductCategoryFilter[] {
  const categoryMap = new Map<string, ProductCategoryFilter>();

  for (const product of products) {
    const existingCategory = categoryMap.get(product.categorySlug);

    if (existingCategory) {
      existingCategory.productCount += 1;
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

export function mapCatalogCategoriesToProductCategories(
  categories: PublicCategoryResponseDto[],
  products: ProductCard[],
): ProductCategoryFilter[] {
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
