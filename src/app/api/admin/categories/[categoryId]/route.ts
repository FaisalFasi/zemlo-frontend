/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: Ek category ko edit (PATCH) ya delete karne ka proxy —
 * backend /admin/categories/:id tak.
 * REASON: Wohi cookie-token pattern; category ka edit/delete UI ise
 * use karega.
 * RISK: Zero — backend categories.update/delete permissions enforce
 * karta hai (products wali category delete karne se backend khud
 * rokta hai).
 * ═════════════════════════════════════════════════════════════════
 */
import { proxyToBackend } from "@/lib/api/backend";

type RouteContext = {
  params: Promise<{
    categoryId: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { categoryId } = await context.params;

  return proxyToBackend(request, {
    method: "PATCH",
    path: `/admin/categories/${categoryId}`,
    includeBody: true,
  });
}

export async function DELETE(request: Request, context: RouteContext) {
  const { categoryId } = await context.params;

  return proxyToBackend(request, {
    method: "DELETE",
    path: `/admin/categories/${categoryId}`,
  });
}
