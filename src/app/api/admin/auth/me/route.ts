import { proxyToBackend } from "@/lib/api/backend";

export async function GET(request: Request) {
  return proxyToBackend(request, {
    method: "GET",
    path: "/auth/me",
  });
}
