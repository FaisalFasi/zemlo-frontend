/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: Categories ki list (GET) + nayi category (POST) ka
 * proxy — backend /admin/categories tak, admin cookie-token ke sath.
 * REASON: Wohi pattern jo orders/variants routes ka hai; iske baghair
 * category-management UI backend se baat nahi kar sakta.
 * RISK: Zero — backend categories.view/create permissions enforce
 * karta hai.
 * ═════════════════════════════════════════════════════════════════
 */
import { proxyToBackend } from "@/lib/api/backend";

export async function GET(request: Request) {
  return proxyToBackend(request, {
    method: "GET",
    path: "/admin/categories",
  });
}

export async function POST(request: Request) {
  return proxyToBackend(request, {
    method: "POST",
    path: "/admin/categories",
    includeBody: true,
  });
}
