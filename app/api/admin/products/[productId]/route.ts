import { proxyToBackend } from "@/lib/api/backend";

type AdminProductRouteContext = {
  params: Promise<{
    productId: string;
  }>;
};

export async function GET(request: Request, context: AdminProductRouteContext) {
  const { productId } = await context.params;

  return proxyToBackend(request, {
    method: "GET",
    path: `/admin/products/${productId}`,
  });
}

export async function PATCH(
  request: Request,
  context: AdminProductRouteContext,
) {
  const { productId } = await context.params;

  return proxyToBackend(request, {
    method: "PATCH",
    path: `/admin/products/${productId}`,
    includeBody: true,
  });
}

export async function DELETE(
  request: Request,
  context: AdminProductRouteContext,
) {
  const { productId } = await context.params;

  return proxyToBackend(request, {
    method: "DELETE",
    path: `/admin/products/${productId}`,
  });
}
