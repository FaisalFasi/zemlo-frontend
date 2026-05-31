import { proxyCartRequest } from "@/features/cart/server/cart-backend-proxy";

export async function POST(request: Request) {
  return proxyCartRequest(request, {
    method: "POST",
    backendPath: "/cart/items",
    includeBody: true,
  });
}
