import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { authCookies } from "@/shared/config/auth-cookies";

// First line of defense for /admin: no session cookie → straight to login.
// Real authorization stays with the backend (JWT + revocable DB sessions);
// AdminShell additionally verifies the session and role via /auth/me.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(
    request.cookies.get(authCookies.adminSession)?.value,
  );
  const isLoginPage = pathname === "/admin/login";

  if (!hasSession && !isLoginPage) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);

    return NextResponse.redirect(loginUrl);
  }

  if (hasSession && isLoginPage) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
