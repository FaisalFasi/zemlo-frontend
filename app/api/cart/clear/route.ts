import { proxyCartRequest } from "@/features/cart/server/cart-backend-proxy";

export async function DELETE(request: Request) {
  return proxyCartRequest(request, {
    method: "DELETE",
    backendPath: "/cart/clear",
  });
}
