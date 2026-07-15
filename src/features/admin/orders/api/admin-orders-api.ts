/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAIN: 4 functions jo admin-orders proxy routes ko call karte
 * hain — list lana, ek order ki detail, status update, shipping update.
 * REASON: Components mein seedha fetch() likhna mana hai — adminApiRequest
 * helper (admin products wala hi) error messages nikaalna aur session
 * expire par /admin/login redirect EK jagah handle karta hai. Naya kaam
 * yahan sirf paths aur types jodna hai.
 * RISK: Zero — nayi file; ye sirf pehle banaye routes ko bulati hai.
 * ═════════════════════════════════════════════════════════════════
 */
import { adminApiRequest } from "@/features/admin/lib/admin-api-request";

import type {
  AdminOrderDetail,
  AdminOrderSummary,
  UpdateAdminOrderShippingInput,
  UpdateAdminOrderStatusInput,
} from "../types/admin-order.types";

export async function getAdminOrders() {
  return adminApiRequest<AdminOrderSummary[]>("/api/admin/orders");
}

export async function getAdminOrderById(orderId: string) {
  return adminApiRequest<AdminOrderDetail>(
    `/api/admin/orders/${encodeURIComponent(orderId)}`,
  );
}

export async function updateAdminOrderStatus(
  orderId: string,
  input: UpdateAdminOrderStatusInput,
) {
  return adminApiRequest<AdminOrderDetail>(
    `/api/admin/orders/${encodeURIComponent(orderId)}/status`,
    { method: "PATCH", body: input },
  );
}

export async function updateAdminOrderShipping(
  orderId: string,
  input: UpdateAdminOrderShippingInput,
) {
  return adminApiRequest<AdminOrderDetail>(
    `/api/admin/orders/${encodeURIComponent(orderId)}/shipping`,
    { method: "PATCH", body: input },
  );
}
