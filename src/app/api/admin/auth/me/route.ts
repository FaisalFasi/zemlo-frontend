import { NextResponse } from "next/server";

import { createBackendUrl, readBackendResponse } from "@/lib/api/backend";
import {
  clearAdminSessionCookie,
  getAdminSessionToken,
} from "@/lib/auth/admin-session-cookie";

export async function GET() {
  const token = await getAdminSessionToken();

  if (!token) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }

  const response = await fetch(createBackendUrl("/auth/me"), {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const responseBody = await readBackendResponse(response);

  if (response.status === 401 || response.status === 403) {
    // Token expired or session revoked — drop the stale cookie.
    await clearAdminSessionCookie();
  }

  if (!response.ok) {
    return NextResponse.json(
      responseBody ?? { message: "Could not load session." },
      { status: response.status },
    );
  }

  return NextResponse.json(responseBody);
}
