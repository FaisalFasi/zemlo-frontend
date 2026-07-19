/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: getSafeRedirectPath ke security tests — login ke baad
 * ?from= redirect ki hifazat.
 * REASON: Ye function toota to "open redirect" banta hai — attacker
 * ka link (?from=//evil.com) customer ko asli login ke baad nakli
 * site par le jata (phishing). Ye tests wo darwaza band rakhte hain.
 * RISK: Zero — test file.
 * ═════════════════════════════════════════════════════════════════
 */
import { describe, expect, it } from "vitest";

import { getSafeRedirectPath } from "./safe-redirect";

const FALLBACK = "/";

describe("getSafeRedirectPath", () => {
  it("allows same-site relative paths", () => {
    expect(getSafeRedirectPath("?from=/account/orders", FALLBACK)).toBe(
      "/account/orders",
    );
  });

  it("blocks protocol-relative URLs (//evil.com)", () => {
    expect(getSafeRedirectPath("?from=//evil.com", FALLBACK)).toBe(FALLBACK);
  });

  it("blocks absolute URLs to other sites", () => {
    expect(getSafeRedirectPath("?from=https://evil.com/x", FALLBACK)).toBe(
      FALLBACK,
    );
  });

  it("falls back when the param is missing or empty", () => {
    expect(getSafeRedirectPath("", FALLBACK)).toBe(FALLBACK);
    expect(getSafeRedirectPath("?from=", FALLBACK)).toBe(FALLBACK);
    expect(getSafeRedirectPath("?other=1", FALLBACK)).toBe(FALLBACK);
  });
});
