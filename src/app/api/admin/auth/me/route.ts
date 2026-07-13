import { handleSessionMe } from "@/lib/auth/session-auth-routes";
import { adminSessionCookie } from "@/lib/auth/session-cookies";

export async function GET() {
  return handleSessionMe(adminSessionCookie);
}
