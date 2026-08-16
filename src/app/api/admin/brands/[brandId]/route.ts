/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: Ek brand ko edit (PATCH) ya delete karne ka proxy —
 * backend /admin/brands/:id tak.
 * REASON: Wohi cookie-token pattern; brand edit/delete UI ise use
 * karega.
 * RISK: Zero — backend brands.update/delete permissions enforce karta hai.
 * ═════════════════════════════════════════════════════════════════
 */
import { proxyToBackend } from "@/lib/api/backend";

type RouteContext = {
  params: Promise<{
    brandId: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { brandId } = await context.params;

  return proxyToBackend(request, {
    method: "PATCH",
    path: `/admin/brands/${brandId}`,
    includeBody: true,
  });
}

export async function DELETE(request: Request, context: RouteContext) {
  const { brandId } = await context.params;

  return proxyToBackend(request, {
    method: "DELETE",
    path: `/admin/brands/${brandId}`,
  });
}
