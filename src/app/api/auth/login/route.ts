import { handleSessionCreate } from "@/lib/auth/session-auth-routes";
import { customerSessionCookie } from "@/lib/auth/session-cookies";

export async function POST(request: Request) {
  return handleSessionCreate(request, "/auth/login", customerSessionCookie);
}
