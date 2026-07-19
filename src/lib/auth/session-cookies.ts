import "server-only";

import { cookies } from "next/headers";

import {
  SESSION_MAX_AGE_SECONDS,
  authCookies,
} from "@/shared/config/auth-cookies";

function createSessionCookie(name: string) {
  return {
    async get() {
      const cookieStore = await cookies();

      return cookieStore.get(name)?.value ?? null;
    },

    async set(accessToken: string) {
      const cookieStore = await cookies();

      cookieStore.set(name, accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_MAX_AGE_SECONDS,
      });
    },

    async clear() {
      const cookieStore = await cookies();

      cookieStore.delete(name);
    },
  };
}

export const adminSessionCookie = createSessionCookie(authCookies.adminSession);

export const customerSessionCookie = createSessionCookie(
  authCookies.customerSession,
);
