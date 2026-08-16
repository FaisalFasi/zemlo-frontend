/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: /api/admin/stats ka route handler — dashboard stats
 * (orders today, revenue today, low-stock count) backend se lata hai.
 * REASON: Wohi cookie-token pattern jo baaki admin proxy routes ka hai.
 * Isse pehle dashboard poori orders list fetch kar ke client-side count
 * karta tha — scale nahi karta tha. Ab backend khud count karta hai.
 * RISK: Zero — backend khud analytics.view permission enforce karta hai.
 * ═════════════════════════════════════════════════════════════════
 */
import { proxyToBackend } from "@/lib/api/backend";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lowStockThreshold = searchParams.get("lowStockThreshold");

  return proxyToBackend(request, {
    method: "GET",
    path: `/admin/stats${lowStockThreshold ? `?lowStockThreshold=${encodeURIComponent(lowStockThreshold)}` : ""}`,
  });
}
