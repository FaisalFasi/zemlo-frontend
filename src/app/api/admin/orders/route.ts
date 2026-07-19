/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: /api/admin/orders ka route handler — browser yahan GET
 * request bhejta hai, ye backend ke /admin/orders tak pahuncha deta hai.
 * REASON: Admin ka token httpOnly cookie mein hai (browser JS ke paas
 * nahi — Phase 1 security). proxyToBackend cookie se token nikaal kar
 * Authorization header laga deta hai. Admin products ka bilkul yehi
 * pattern hai (/api/admin/products).
 * RISK: Zero — backend khud bhi ORDERS_VIEW_ALL permission check karta
 * hai, ye sirf raasta hai.
 * ═════════════════════════════════════════════════════════════════
 */
import { proxyToBackend } from "@/lib/api/backend";

export async function GET(request: Request) {
  return proxyToBackend(request, {
    method: "GET",
    path: "/admin/orders",
  });
}
