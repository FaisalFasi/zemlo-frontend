/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: /api/admin/orders/<id> ka route handler — ek single order
 * ki poori detail backend ke /admin/orders/:id se laata hai.
 * REASON: Admin order kholne par items/address/status history chahiye;
 * token cookie mein hai is liye ye server-side proxy zaroori hai
 * (admin products ke [productId] route jaisa hi pattern).
 * RISK: Zero — read-only GET, backend permission bhi check karta hai.
 * ═════════════════════════════════════════════════════════════════
 */
import { proxyToBackend } from "@/lib/api/backend";

type RouteContext = {
  params: Promise<{
    orderId: string;
  }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { orderId } = await context.params;

  return proxyToBackend(request, {
    method: "GET",
    path: `/admin/orders/${orderId}`,
  });
}
