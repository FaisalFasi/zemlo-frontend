export const productFallbackImages = Object.freeze({
  card: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1000&auto=format&fit=crop",
  detail:
    "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200&auto=format&fit=crop",
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
