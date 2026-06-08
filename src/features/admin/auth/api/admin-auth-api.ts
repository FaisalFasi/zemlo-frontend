"use client";

import {
  clearAdminSession,
  getAdminAccessToken,
  setAdminSession,
} from "../lib/admin-session";
import type {
  AdminLoginInput,
  AdminLoginResponse,
  AdminMeResponse,
} from "../types/admin-auth.types";

async function readResponseBody(response: Response) {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  try {
    return await response.text();
  } catch {
    return null;
  }
}

function getErrorMessage(errorBody: unknown, fallback: string) {
  if (errorBody && typeof errorBody === "object" && "message" in errorBody) {
    const message = errorBody.message;

    if (typeof message === "string") return message;
    if (Array.isArray(message)) return message.join(", ");
  }

  if (typeof errorBody === "string" && errorBody.trim().length > 0) {
    return errorBody;
  }

  return fallback;
}

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

  const result = (await response.json()) as AdminLoginResponse;

  setAdminSession(result.accessToken, result.user);

  return result;
}

export async function getCurrentAdminUser() {
  const token = getAdminAccessToken();

  if (!token) return null;

  const response = await fetch("/api/admin/auth/me", {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    clearAdminSession();
    return null;
  }

  const result = (await response.json()) as AdminMeResponse;

  return result.user;
}

export function logoutAdmin() {
  clearAdminSession();
}
