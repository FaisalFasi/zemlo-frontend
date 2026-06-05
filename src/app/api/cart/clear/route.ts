import { proxyToBackend } from "@/src/lib/api/backend";

export async function DELETE(request: Request) {
  return proxyToBackend(request, {
    method: "DELETE",
    path: "/cart/clear",
  });
}
