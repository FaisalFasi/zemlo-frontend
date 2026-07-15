/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: PATCH /api/admin/orders/<id>/shipping — shipping info
 * update karta hai: carrier (DHL...), tracking number, tracking URL,
 * estimated/actual delivery, fulfillment status.
 * REASON: Order bhejne ke baad owner tracking number daalta hai jo
 * customer ko uske order-detail page par dikhta hai. Wohi proxy
 * pattern — cookie se admin token server-side lagta hai.
 * RISK: Kam — backend ORDERS_UPDATE permission enforce karta hai.
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
    path: `/admin/orders/${orderId}/shipping`,
    includeBody: true,
  });
}
