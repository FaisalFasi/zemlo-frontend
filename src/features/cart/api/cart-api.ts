import {
  cartControllerAddItem,
  cartControllerClearCart,
  cartControllerGetCart,
  cartControllerMergeGuestCart,
  cartControllerRemoveItem,
  cartControllerUpdateItem,
} from "@/shared/api/generated/cart/cart";

import type {
  AddCartItemInput,
  Cart,
  UpdateCartItemInput,
} from "../types/cart.types";

export async function getCart(): Promise<Cart> {
  return cartControllerGetCart() as Promise<Cart>;
}

export async function addCartItem(input: AddCartItemInput): Promise<Cart> {
  return cartControllerAddItem(input) as Promise<Cart>;
}

export async function updateCartItem(
  itemId: string,
  input: UpdateCartItemInput,
): Promise<Cart> {
  return cartControllerUpdateItem(itemId, input) as Promise<Cart>;
}

export async function removeCartItem(itemId: string): Promise<Cart> {
  return cartControllerRemoveItem(itemId) as Promise<Cart>;
}

export async function clearCart(): Promise<Cart> {
  return cartControllerClearCart() as Promise<Cart>;
}

// Merges the guest cart (keyed by the x-guest-id header, attached
// automatically — see shared/api/axios-instance.ts) into the now-logged-in
// user's cart, server-side, in one call.
export async function mergeGuestCart(): Promise<Cart> {
  return cartControllerMergeGuestCart() as Promise<Cart>;
}
