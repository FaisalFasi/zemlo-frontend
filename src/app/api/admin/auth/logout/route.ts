import { handleSessionLogout } from "@/lib/auth/session-auth-routes";
import { adminSessionCookie } from "@/lib/auth/session-cookies";

export async function POST() {
  return handleSessionLogout(adminSessionCookie);
}
