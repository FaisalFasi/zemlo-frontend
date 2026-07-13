import { handleSessionCreate } from "@/lib/auth/session-auth-routes";
import { adminSessionCookie } from "@/lib/auth/session-cookies";

export async function POST(request: Request) {
  return handleSessionCreate(request, "/auth/login", adminSessionCookie);
}
