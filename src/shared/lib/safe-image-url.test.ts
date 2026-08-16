/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: getSafeImageUrl + isAllowedImageUrl ke tests — original
 * bug (placehold.co jaisi ghair-allowed host se poori /shop page crash)
 * dobara kabhi na ho, ye us guarantee ko lock karta hai. placehold.co
 * khud ab (2026-08-16) allowlist mein hai (common test/placeholder
 * host), isliye "not allowed" test ek doosri arbitrary host use karta
 * hai.
 * RISK: Zero — test file.
 * ═════════════════════════════════════════════════════════════════
 */
import { describe, expect, it } from "vitest";

import { getSafeImageUrl, isAllowedImageUrl } from "./safe-image-url";

const FALLBACK = "/images/product-placeholder.png";
const UNTRUSTED_URL = "https://random-untrusted-host.example.com/photo.jpg";

describe("getSafeImageUrl", () => {
  it("allows URLs from the trusted allowlist", () => {
    const url = "https://images.unsplash.com/photo-123?w=600";

    expect(getSafeImageUrl(url, FALLBACK)).toBe(url);
  });

  it("falls back for hosts NOT on the allowlist", () => {
    expect(getSafeImageUrl(UNTRUSTED_URL, FALLBACK)).toBe(FALLBACK);
  });

  it("allows local/same-origin paths without checking a hostname", () => {
    expect(getSafeImageUrl("/images/something.png", FALLBACK)).toBe(
      "/images/something.png",
    );
  });

  it("falls back for missing or empty input", () => {
    expect(getSafeImageUrl(null, FALLBACK)).toBe(FALLBACK);
    expect(getSafeImageUrl(undefined, FALLBACK)).toBe(FALLBACK);
    expect(getSafeImageUrl("", FALLBACK)).toBe(FALLBACK);
  });

  it("falls back for garbage that isn't a valid URL", () => {
    expect(getSafeImageUrl("not a url at all", FALLBACK)).toBe(FALLBACK);
  });
});

describe("isAllowedImageUrl", () => {
  it("accepts URLs from the trusted allowlist", () => {
    expect(isAllowedImageUrl("https://images.unsplash.com/photo-123")).toBe(
      true,
    );
  });

  it("accepts local/same-origin paths", () => {
    expect(isAllowedImageUrl("/images/something.png")).toBe(true);
  });

  it("rejects hosts NOT on the allowlist", () => {
    expect(isAllowedImageUrl(UNTRUSTED_URL)).toBe(false);
  });

  it("rejects missing, empty, or invalid input", () => {
    expect(isAllowedImageUrl(null)).toBe(false);
    expect(isAllowedImageUrl(undefined)).toBe(false);
    expect(isAllowedImageUrl("")).toBe(false);
    expect(isAllowedImageUrl("not a url at all")).toBe(false);
  });
});
