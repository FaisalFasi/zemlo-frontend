/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: Ek single variant ko edit (PATCH) ya delete karne ka
 * proxy route — backend /admin/products/:id/variants/:variantId tak.
 * REASON: Wohi cookie-token proxy pattern; iske baghair variant ka
 * edit/delete UI backend tak nahi pahunch sakta.
 * RISK: Zero — backend permissions enforce karta hai; DELETE sirf
 * us variant ko hatata hai, product ko nahi.
 * ═════════════════════════════════════════════════════════════════
 */
import { proxyToBackend } from "@/lib/api/backend";

type RouteContext = {
  params: Promise<{
    productId: string;
    variantId: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { productId, variantId } = await context.params;

  return proxyToBackend(request, {
    method: "PATCH",
    path: `/admin/products/${productId}/variants/${variantId}`,
    includeBody: true,
  });
}

export async function DELETE(request: Request, context: RouteContext) {
  const { productId, variantId } = await context.params;

  return proxyToBackend(request, {
    method: "DELETE",
    path: `/admin/products/${productId}/variants/${variantId}`,
  });
}
