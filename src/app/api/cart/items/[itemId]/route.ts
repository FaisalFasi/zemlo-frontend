import { proxyToBackend } from "@/src/lib/api/backend";

type CartItemRouteContext = {
  params: Promise<{
    itemId: string;
  }>;
};

export async function PATCH(request: Request, context: CartItemRouteContext) {
  const { itemId } = await context.params;

  return proxyToBackend(request, {
    method: "PATCH",
    path: `/cart/items/${itemId}`,
    includeBody: true,
  });
}

export async function DELETE(request: Request, context: CartItemRouteContext) {
  const { itemId } = await context.params;

  return proxyToBackend(request, {
    method: "DELETE",
    path: `/cart/items/${itemId}`,
  });
}
