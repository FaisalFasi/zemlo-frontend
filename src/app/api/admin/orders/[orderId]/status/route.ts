/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: PATCH /api/admin/orders/<id>/status — order ka status /
 * payment status / fulfillment status update karta hai (optional note
 * ke sath jo status history mein save hota hai).
 * REASON: Store owner ko order ki zindagi manage karni hai (PENDING →
 * CONFIRMED → SHIPPED → DELIVERED). Token httpOnly cookie mein hai,
 * is liye ye server-side proxy hi backend tak request le ja sakta hai.
 * RISK: Kam — backend ORDERS_UPDATE permission enforce karta hai;
 * includeBody: true request ka JSON body backend tak forward karta hai.
 * ═════════════════════════════════════════════════════════════════
 */
import { proxyToBackend } from "@/lib/api/backend";

type RouteContext = {
  params: Promise<{
    orderId: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { orderId } = await context.params;

  return proxyToBackend(request, {
    method: "PATCH",
    path: `/admin/orders/${orderId}/status`,
    includeBody: true,
  });
}
