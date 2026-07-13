import { NextResponse } from "next/server";

import { createBackendUrl } from "@/lib/api/backend";
import {
  clearAdminSessionCookie,
  getAdminSessionToken,
} from "@/lib/auth/admin-session-cookie";

export async function POST() {
  const token = await getAdminSessionToken();

  if (token) {
    // Best effort: revoke the backend session; the cookie is cleared regardless.
    try {
      await fetch(createBackendUrl("/auth/logout"), {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });
    } catch {
      // Backend unreachable — still clear the local session.
    }
  }

  await clearAdminSessionCookie();

  return NextResponse.json({ message: "Logout successful" });
}
