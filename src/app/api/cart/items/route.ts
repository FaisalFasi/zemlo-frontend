import { proxyToBackend } from "@/src/lib/api/backend";

export async function POST(request: Request) {
  return proxyToBackend(request, {
    method: "POST",
    path: "/cart/items",
    includeBody: true,
  });
}
