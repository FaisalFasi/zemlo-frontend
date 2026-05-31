import { proxyCartRequest } from "@/features/cart/server/cart-backend-proxy";

type CartItemRouteContext = {
  params: Promise<{
    itemId: string;
  }>;
};

export async function PATCH(request: Request, context: CartItemRouteContext) {
  const { itemId } = await context.params;

  return proxyCartRequest(request, {
    method: "PATCH",
    backendPath: `/cart/items/${itemId}`,
    includeBody: true,
  });
}

export async function DELETE(request: Request, context: CartItemRouteContext) {
  const { itemId } = await context.params;

  return proxyCartRequest(request, {
    method: "DELETE",
    backendPath: `/cart/items/${itemId}`,
  });
}
