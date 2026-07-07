import type { Metadata } from "next";

import { defaultMarket } from "@/shared/config/markets";
import { routes } from "@/shared/config/routes";
import {
  createMetaDescription,
  createPageMetadata,
  getAbsoluteUrl,
} from "@/shared/lib/seo";

import type { ProductDetail } from "../types/product-detail.types";

function getProductImages(product: ProductDetail) {
  return product.images.map((image) => image.url).filter(Boolean);
}

function getProductCanonicalPath(product: ProductDetail) {
  return routes.productDetail(product.slug);
}

function getProductAvailability(product: ProductDetail) {
  return product.stock > 0
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock";
}

export function createProductMetadata(product: ProductDetail): Metadata {
  return createPageMetadata({
    title: product.name,
    description: product.shortDescription ?? product.description,
    path: getProductCanonicalPath(product),
    images: getProductImages(product),
    type: "website",
    noIndex: Boolean(product.isDemo),
  });
}

export function createProductJsonLd(product: ProductDetail) {
  const canonicalUrl = getAbsoluteUrl(getProductCanonicalPath(product));
  const images = getProductImages(product);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: createMetaDescription(
      product.shortDescription ?? product.description,
    ),
    sku: product.sku ?? undefined,
    image: images.length > 0 ? images : undefined,
    brand: product.brand
      ? {
          "@type": "Brand",
          name: product.brand.name,
        }
      : undefined,
    category: product.category.name,
    offers: {
      "@type": "Offer",
      url: canonicalUrl,
      priceCurrency: defaultMarket.currency,
      price: product.price,
      availability: getProductAvailability(product),
      itemCondition: "https://schema.org/NewCondition",
    },
  };
}
