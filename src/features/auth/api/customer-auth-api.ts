"use client";

import type { AuthUserResponseDto } from "@/shared/api/generated/schemas";
import { getErrorMessage, readResponseBody } from "@/shared/lib/http";

export type CustomerUser = AuthUserResponseDto;

export type CustomerAuthResponse = {
  message: string;
  user: CustomerUser;
};

type LoginInput = {
  email: string;
  password: string;
};

type RegisterInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

// The session token lives in an httpOnly cookie set by the route handlers —
// client JS never sees or stores it.
async function postAuth(path: string, body: unknown, fallbackError: string) {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      Accept: "application/json",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const responseBody = await readResponseBody(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(responseBody, fallbackError));
  }

  return responseBody;
}

export async function loginCustomer(input: LoginInput) {
  return (await postAuth(
    "/api/auth/login",
    input,
    "Could not sign in.",
  )) as CustomerAuthResponse;
}

export async function registerCustomer(input: RegisterInput) {
  return (await postAuth(
    "/api/auth/register",
    input,
    "Could not create your account.",
  )) as CustomerAuthResponse;
}

export async function logoutCustomer() {
  await postAuth("/api/auth/logout", undefined, "Could not sign out.");
}

export async function getCurrentCustomer(): Promise<CustomerUser | null> {
  const response = await fetch("/api/auth/me", {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    return null;
  }

  const result = (await readResponseBody(response)) as {
    user: CustomerUser;
  } | null;

  return result?.user ?? null;
}
