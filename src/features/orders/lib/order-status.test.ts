/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: Order-status → label/badge mapping ke tests.
 * REASON: Sab se ahem fallback hai — backend kal naya status bheje
 * to UI crash na ho, grey "Unknown" badge dikhe. Ye test us guarantee
 * ko lock karta hai.
 * RISK: Zero — test file.
 * ═════════════════════════════════════════════════════════════════
 */
import { describe, expect, it } from "vitest";

import type { OrderPaymentStatus, OrderStatus } from "../types/order.types";
import {
  getOrderStatusPresentation,
  getPaymentStatusPresentation,
} from "./order-status";

describe("getOrderStatusPresentation", () => {
  it("maps known statuses to human labels", () => {
    expect(getOrderStatusPresentation("SHIPPED").label).toBe("Shipped");
    expect(getOrderStatusPresentation("DELIVERED").label).toBe("Delivered");
  });

  it("falls back to Unknown for statuses we have never seen", () => {
    const presentation = getOrderStatusPresentation(
      "SOMETHING_NEW" as OrderStatus,
    );

    expect(presentation.label).toBe("Unknown");
    expect(presentation.className).toContain("bg-muted");
  });
});

describe("getPaymentStatusPresentation", () => {
  it("maps known payment statuses", () => {
    expect(getPaymentStatusPresentation("PAID").label).toBe("Paid");
    expect(getPaymentStatusPresentation("REFUNDED").label).toBe("Refunded");
  });

  it("falls back to Unknown for unexpected values", () => {
    expect(
      getPaymentStatusPresentation("MYSTERY" as OrderPaymentStatus).label,
    ).toBe("Unknown");
  });
});
