import { handleSessionLogout } from "@/lib/auth/session-auth-routes";
import { customerSessionCookie } from "@/lib/auth/session-cookies";

export async function POST() {
  return handleSessionLogout(customerSessionCookie);
}
