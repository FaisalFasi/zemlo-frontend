import { proxyToBackend } from "@/lib/api/backend";

export async function POST(request: Request) {
  return proxyToBackend(request, {
    method: "POST",
    path: "/admin/products",
    includeBody: true,
  });
}
