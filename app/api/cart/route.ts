import { proxyCartRequest } from "@/features/cart/server/cart-backend-proxy";

export async function GET(request: Request) {
  return proxyCartRequest(request, {
    method: "GET",
    backendPath: "/cart",
  });
}
