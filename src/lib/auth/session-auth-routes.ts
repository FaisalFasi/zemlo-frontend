import "server-only";

import { NextResponse } from "next/server";

import { createBackendUrl, readBackendResponse } from "@/lib/api/backend";

type SessionCookie = {
  get(): Promise<string | null>;
  set(accessToken: string): Promise<void>;
  clear(): Promise<void>;
};

type BackendSessionResponse = {
  message: string;
  user: Record<string, unknown>;
  accessToken: string;
};

// Shared handlers for cookie-based auth routes (admin + customer): the
// backend token never reaches client JS — it lives in an httpOnly cookie.

export async function handleSessionCreate(
  request: Request,
  backendPath: string,
  sessionCookie: SessionCookie,
) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400 },
    );
  }

  const response = await fetch(createBackendUrl(backendPath), {
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
      responseBody ?? { message: "Authentication failed." },
      { status: response.status },
    );
  }

  const { message, user, accessToken } = responseBody as BackendSessionResponse;

  if (!accessToken) {
    return NextResponse.json(
      { message: "Auth response was missing a session token." },
      { status: 502 },
    );
  }

  await sessionCookie.set(accessToken);

  return NextResponse.json({ message, user });
}

export async function handleSessionMe(sessionCookie: SessionCookie) {
  const token = await sessionCookie.get();

  if (!token) {
    return NextResponse.json(
      { message: "Not authenticated." },
      { status: 401 },
    );
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
    await sessionCookie.clear();
  }

  if (!response.ok) {
    return NextResponse.json(
      responseBody ?? { message: "Could not load session." },
      { status: response.status },
    );
  }

  return NextResponse.json(responseBody);
}

export async function handleSessionLogout(sessionCookie: SessionCookie) {
  const token = await sessionCookie.get();

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

  await sessionCookie.clear();

  return NextResponse.json({ message: "Logout successful" });
}
