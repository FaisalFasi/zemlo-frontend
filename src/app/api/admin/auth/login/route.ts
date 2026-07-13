import { NextResponse } from "next/server";

import { createBackendUrl, readBackendResponse } from "@/lib/api/backend";
import { setAdminSessionCookie } from "@/lib/auth/admin-session-cookie";

type BackendLoginResponse = {
  message: string;
  user: Record<string, unknown>;
  accessToken: string;
};

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400 },
    );
  }

  const response = await fetch(createBackendUrl("/auth/login"), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const responseBody = await readBackendResponse(response);

  if (!response.ok) {
    return NextResponse.json(
      responseBody ?? { message: "Could not login." },
      { status: response.status },
    );
  }

  const { message, user, accessToken } = responseBody as BackendLoginResponse;

  if (!accessToken) {
    return NextResponse.json(
      { message: "Login response was missing a session token." },
      { status: 502 },
    );
  }

  await setAdminSessionCookie(accessToken);

  // The token stays server-side (httpOnly cookie) — never expose it to client JS.
  return NextResponse.json({ message, user });
}
