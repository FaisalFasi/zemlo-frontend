import { handleSessionCreate } from "@/lib/auth/session-auth-routes";
import { customerSessionCookie } from "@/lib/auth/session-cookies";

// Backend register returns a session token too — the user is signed in
// immediately after creating an account.
export async function POST(request: Request) {
  return handleSessionCreate(request, "/auth/register", customerSessionCookie);
}
