"use client";

import { getErrorMessage, readResponseBody } from "@/shared/lib/http";

import type {
  AdminLoginInput,
  AdminLoginResponse,
  AdminMeResponse,
} from "../types/admin-auth.types";

// The session token lives in an httpOnly cookie set by the login route
// handler — client JS never sees or stores it.
export async function loginAdmin(input: AdminLoginInput) {
  const response = await fetch("/api/admin/auth/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorBody = await readResponseBody(response);

    throw new Error(getErrorMessage(errorBody, "Could not login."));
  }

  return (await response.json()) as AdminLoginResponse;
}

export async function getCurrentAdminUser() {
  const response = await fetch("/api/admin/auth/me", {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  // 401 is the ONLY response that means "definitely not signed in" — return
  // null so callers can treat it as a clean logged-out state. Any other
  // non-2xx (a transient 5xx, a proxy hiccup) must THROW instead, so
  // TanStack Query marks the query as an error rather than "successfully"
  // resolving to null — a thrown error leaves the previous cached user
  // (and therefore admin panel access) untouched; resolving to null would
  // overwrite it and look exactly like a real logout.
  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Could not verify admin session (${response.status}).`);
  }

  const result = (await response.json()) as AdminMeResponse;

  return result.user;
}

export async function logoutAdmin() {
  await fetch("/api/admin/auth/logout", {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });
}
