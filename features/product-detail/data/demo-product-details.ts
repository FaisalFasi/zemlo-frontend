import type { CatalogProductDetail } from "@/features/catalog/types/catalog.types";

import type {
  ProductDetail,
  ProductDetailImage,
  ProductDetailSpec,
  ProductDetailVariant,
} from "../types/product-detail.types";

const FALLBACK_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200&auto=format&fit=crop";

function toNumber(value: string | number | null | undefined) {
  if (value === null || value === undefined) return undefined;

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}

function getDiscountBadge(price?: number, compareAtPrice?: number) {
  if (!price || !compareAtPrice || compareAtPrice <= price) return undefined;

  const discount = Math.round(
    ((compareAtPrice - price) / compareAtPrice) * 100,
  );

  return `Save ${discount}%`;
}

function mapImages(product: CatalogProductDetail): ProductDetailImage[] {
  const images = product.images.map((image) => ({
    id: image.id,
    url: image.url,
    alt: image.altText ?? product.name,
  }));

  if (images.length > 0) return images;

  const variantImages = product.variants
    .filter((variant) => Boolean(variant.image))
    .map((variant) => ({
      id: variant.id,
      url: variant.image as string,
      alt: variant.name,
    }));

  if (variantImages.length > 0) return variantImages;

  return [
    {
      id: "fallback-image",
      url: FALLBACK_PRODUCT_IMAGE,
      alt: product.name,
    },
  ];
}

function mapVariants(product: CatalogProductDetail): ProductDetailVariant[] {
  return product.variants.map((variant) => {
    const price = toNumber(variant.price) ?? toNumber(product.price) ?? 0;
    const compareAtPrice = toNumber(variant.compareAtPrice);

    return {
      id: variant.id,
      name: variant.name,
      sku: variant.sku,
      price,
      compareAtPrice,
      stock: variant.stock,
      image: variant.image,
      options: variant.options,
    };
  });
}

function mapSpecs(product: CatalogProductDetail): ProductDetailSpec[] {
  const specs: ProductDetailSpec[] = [];

  if (product.sku) specs.push({ label: "SKU", value: product.sku });

  if (product.weight) {
    specs.push({ label: "Weight", value: `${product.weight}` });
  }

  const dimensions = [product.length, product.width, product.height]
    .filter((value) => value !== null && value !== undefined)
    .join(" × ");

  if (dimensions) {
    specs.push({ label: "Dimensions", value: dimensions });
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

export function mapCatalogProductToProductDetail(
  product: CatalogProductDetail,
): ProductDetail {
  const price = toNumber(product.price) ?? 0;
  const compareAtPrice = toNumber(product.compareAtPrice);

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
    images: mapImages(product),
    variants: mapVariants(product),
    specs: mapSpecs(product),
    badge:
      getDiscountBadge(price, compareAtPrice) ??
      (product.isFeatured ? "Featured" : undefined),
  };
}
