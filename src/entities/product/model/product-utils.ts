// EXPLANATION: fallback ab apne server ki local image hai (public/images/),
// Unsplash jaisi third-party par bharosa nahi — wo photo hata de ya service
// down ho to store tooti images dikhata.
export const productFallbackImages = Object.freeze({
  card: "/images/product-placeholder.png",
  detail: "/images/product-placeholder.png",
} as const);

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
