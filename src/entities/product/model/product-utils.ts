import { getSafeImageUrl } from "@/shared/lib/safe-image-url";

// EXPLANATION: fallback ab apne server ki local image hai (public/images/),
// Unsplash jaisi third-party par bharosa nahi — wo photo hata de ya service
// down ho to store tooti images dikhata.
export const productFallbackImages = Object.freeze({
  card: "/images/product-placeholder.png",
  detail: "/images/product-placeholder.png",
} as const);

type ProductWithImages = {
  images: { url: string; isDefault: boolean }[];
  variants: { image?: string | null }[];
};

/**
 * EXPLANATION: "product card ke liye sab se achi image chuno" wala chain
 * (default image → pehli image → kisi variant ki image → fallback) pehle
 * DO jagah copy-paste tha — entities/product ke mapper mein aur
 * components/home ke mapper mein, dono product-listing DTO se same shape
 * padhte hain. Ab ye logic sirf YAHAN hai — dono mappers isay call karte
 * hain. getSafeImageUrl aakhri kadam hai: agar chuni hui URL ghair-allowed
 * host se ho to crash ki jagah fallback.
 */
export function resolveBestProductImage(
  product: ProductWithImages,
  fallback: string,
) {
  const defaultImage = product.images.find((image) => image.isDefault);
  const firstImage = product.images[0];
  const variantImage = product.variants.find((variant) => variant.image)
    ?.image;

  return getSafeImageUrl(
    defaultImage?.url ?? firstImage?.url ?? variantImage,
    fallback,
  );
}

export function toOptionalNumber(value: string | number | null | undefined) {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }

  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : undefined;
}

export function toNumber(value: string | number | null | undefined) {
  return toOptionalNumber(value) ?? 0;
}

export function getDiscountBadge(price?: number, compareAtPrice?: number) {
  if (!price || !compareAtPrice || compareAtPrice <= price) {
    return undefined;
  }

  const discount = Math.round(
    ((compareAtPrice - price) / compareAtPrice) * 100,
  );

  return `Save ${discount}%`;
}
