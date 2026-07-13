import "server-only";

import { cookies } from "next/headers";

import {
  ADMIN_SESSION_MAX_AGE_SECONDS,
  authCookies,
} from "@/shared/config/auth-cookies";

export async function getAdminSessionToken() {
  const cookieStore = await cookies();

  return cookieStore.get(authCookies.adminSession)?.value ?? null;
}

export async function setAdminSessionCookie(accessToken: string) {
  const cookieStore = await cookies();

  cookieStore.set(authCookies.adminSession, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();

  cookieStore.delete(authCookies.adminSession);
}
