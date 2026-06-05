"use client";

import { getOrCreateGuestCartId } from "../lib/guest-cart-id";
import type {
  AddCartItemInput,
  Cart,
  UpdateCartItemInput,
} from "../types/cart.types";

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

async function cartRequest<TResponse>(
  path: string,
  options: RequestInit = {},
): Promise<TResponse> {
  const guestId = getOrCreateGuestCartId();

  const response = await fetch(path, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-guest-id": guestId,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await readResponseBody(response);

    throw new Error(
      getErrorMessage(errorBody, "Something went wrong with the cart."),
    );
  }

  return response.json() as Promise<TResponse>;
}

export function getCart() {
  return cartRequest<Cart>("/api/cart", {
    method: "GET",
  });
}

export function addCartItem(input: AddCartItemInput) {
  return cartRequest<Cart>("/api/cart/items", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateCartItem(itemId: string, input: UpdateCartItemInput) {
  return cartRequest<Cart>(`/api/cart/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function removeCartItem(itemId: string) {
  return cartRequest<Cart>(`/api/cart/items/${itemId}`, {
    method: "DELETE",
  });
}

export function clearCart() {
  return cartRequest<Cart>("/api/cart/clear", {
    method: "DELETE",
  });
}
