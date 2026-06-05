"use client";

import { getOrCreateGuestCartId } from "@/features/cart/lib/guest-cart-id";

import type {
  CheckoutFromCartInput,
  CheckoutFromCartResponse,
} from "../types/checkout.types";

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

export async function checkoutFromCart(input: CheckoutFromCartInput) {
  const guestId = getOrCreateGuestCartId();

  const response = await fetch("/api/checkout/from-cart", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-guest-id": guestId,
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorBody = await readResponseBody(response);

    throw new Error(
      getErrorMessage(errorBody, "Could not create checkout from cart."),
    );
  }

  return response.json() as Promise<CheckoutFromCartResponse>;
}
