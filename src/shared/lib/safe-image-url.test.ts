/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: getSafeImageUrl ke tests — aaj ka masla (placehold.co
 * jaisi ghair-allowed host se poori /shop page crash) dobara kabhi na
 * ho, ye us guarantee ko lock karta hai.
 * RISK: Zero — test file.
 * ═════════════════════════════════════════════════════════════════
 */
import { describe, expect, it } from "vitest";

import { getSafeImageUrl } from "./safe-image-url";

const FALLBACK = "/images/product-placeholder.png";

describe("getSafeImageUrl", () => {
  it("allows URLs from the trusted allowlist", () => {
    const url = "https://images.unsplash.com/photo-123?w=600";

    expect(getSafeImageUrl(url, FALLBACK)).toBe(url);
  });

  it("falls back for hosts NOT on the allowlist (today's real bug)", () => {
    expect(
      getSafeImageUrl("https://placehold.co/600x600?text=Test", FALLBACK),
    ).toBe(FALLBACK);
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
