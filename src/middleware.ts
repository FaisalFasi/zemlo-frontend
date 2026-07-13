import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { authCookies } from "@/shared/config/auth-cookies";

// First line of defense: presence checks on httpOnly session cookies.
// Real authorization stays with the backend (JWT + revocable DB sessions);
// AdminShell/AccountPanel additionally verify the session via /auth/me.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasAdminSession = Boolean(
    request.cookies.get(authCookies.adminSession)?.value,
  );
  const hasCustomerSession = Boolean(
    request.cookies.get(authCookies.customerSession)?.value,
  );

  // --- Admin area ---
  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";

    if (!hasAdminSession && !isLoginPage) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);

      return NextResponse.redirect(loginUrl);
    }

    if (hasAdminSession && isLoginPage) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
  }

  // --- Customer account ---
  if (pathname.startsWith("/account")) {
    if (!hasCustomerSession) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);

      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // --- Auth pages: already signed in? Skip the form. ---
  if ((pathname === "/login" || pathname === "/signup") && hasCustomerSession) {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/login", "/signup"],
};
