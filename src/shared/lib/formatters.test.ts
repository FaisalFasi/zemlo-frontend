/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: Money/date formatters ke unit tests — poori site ke
 * paisay isi logic se dikhte hain, is liye ye lock ho rahi hai.
 * REASON: Phase 3 ka USD/EUR bug dobara kabhi na aa sake — koi
 * formatter chhere to `npm test` foran fail ho.
 * NOTE: Intl de-DE mein number aur € ke beech non-breaking space
 * ( ) hota hai — normalize() usay aam space banata hai taake
 * assertions parhne layak rahen.
 * RISK: Zero — test file, production bundle mein nahi jati.
 * ═════════════════════════════════════════════════════════════════
 */
import { describe, expect, it } from "vitest";

import {
  formatDefaultDate,
  formatDefaultMoney,
  formatMoney,
} from "./formatters";

function normalize(value: string) {
  return value.replace(/ | /g, " ");
}

describe("formatDefaultMoney", () => {
  it("formats EUR in German style (symbol after the number)", () => {
    expect(normalize(formatDefaultMoney(49.99))).toBe("49,99 €");
  });

  it("accepts numeric strings (backend sometimes sends strings)", () => {
    expect(normalize(formatDefaultMoney("49.99"))).toBe("49,99 €");
  });

  it("never crashes on missing/invalid input — falls back to zero", () => {
    expect(normalize(formatDefaultMoney(null))).toBe("0,00 €");
    expect(normalize(formatDefaultMoney(undefined))).toBe("0,00 €");
    expect(normalize(formatDefaultMoney("not-a-number"))).toBe("0,00 €");
  });
});

describe("formatMoney", () => {
  it("supports whole-number display for product cards", () => {
    expect(
      normalize(formatMoney({ amount: 49.99, maximumFractionDigits: 0 })),
    ).toBe("50 €");
  });

  it("can format other currencies when explicitly asked", () => {
    const result = normalize(formatMoney({ amount: 10, currency: "USD" }));

    expect(result).toContain("10,00");
    expect(result).toContain("$");
  });
});

describe("formatDefaultDate", () => {
  it("formats ISO strings in the German locale", () => {
    expect(formatDefaultDate("2026-07-12T18:03:00.000Z")).toBe("12.07.2026");
  });

  it("returns an empty string for missing/invalid input", () => {
    expect(formatDefaultDate(null)).toBe("");
    expect(formatDefaultDate(undefined)).toBe("");
    expect(formatDefaultDate("garbage")).toBe("");
  });
});
