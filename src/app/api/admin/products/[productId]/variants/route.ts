/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: Variants ki list (GET) aur naya variant banane (POST)
 * ka proxy route — backend /admin/products/:id/variants tak.
 * REASON: Admin token httpOnly cookie mein hai; proxyToBackend usay
 * server-side Authorization header mein lagata hai (orders/products
 * routes jaisa hi pattern).
 * RISK: Zero — backend PRODUCTS permissions khud enforce karta hai.
 * ═════════════════════════════════════════════════════════════════
 */
import { proxyToBackend } from "@/lib/api/backend";

type RouteContext = {
  params: Promise<{
    productId: string;
  }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { productId } = await context.params;

  return proxyToBackend(request, {
    method: "GET",
    path: `/admin/products/${productId}/variants`,
  });
}

export async function POST(request: Request, context: RouteContext) {
  const { productId } = await context.params;

  return proxyToBackend(request, {
    method: "POST",
    path: `/admin/products/${productId}/variants`,
    includeBody: true,
  });
}
