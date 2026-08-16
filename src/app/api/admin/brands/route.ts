/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: Brands ki list (GET) + naya brand (POST) ka proxy —
 * backend /admin/brands tak, admin cookie-token ke sath.
 * REASON: Categories routes jaisa hi — brand-management UI ka rasta.
 * RISK: Zero — backend brands.view/create permissions enforce karta hai.
 * ═════════════════════════════════════════════════════════════════
 */
import { proxyToBackend } from "@/lib/api/backend";

export async function GET(request: Request) {
  return proxyToBackend(request, {
    method: "GET",
    path: "/admin/brands",
  });
}

export async function POST(request: Request) {
  return proxyToBackend(request, {
    method: "POST",
    path: "/admin/brands",
    includeBody: true,
  });
}
