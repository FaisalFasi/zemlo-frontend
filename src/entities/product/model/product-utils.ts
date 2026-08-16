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

// The ONE place price+compareAtPrice math happens — the admin "Discount %"
// input and the storefront "Save X%" badge must agree on what a discount
// means, so both read/write through these two functions rather than each
// re-deriving the formula.
export function getDiscountPercent(price?: number, compareAtPrice?: number) {
  if (!price || !compareAtPrice || compareAtPrice <= price) {
    return undefined;
  }

  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

// Inverse of getDiscountPercent: given the current selling price and a
// target discount %, what "was" price (compareAtPrice) produces it.
export function getCompareAtPriceForDiscount(
  price: number,
  discountPercent: number,
) {
  if (!price || discountPercent <= 0 || discountPercent >= 100) {
    return undefined;
  }

  return Math.round((price / (1 - discountPercent / 100)) * 100) / 100;
}

export function getDiscountBadge(price?: number, compareAtPrice?: number) {
  const discount = getDiscountPercent(price, compareAtPrice);

  return discount === undefined ? undefined : `Save ${discount}%`;
}
