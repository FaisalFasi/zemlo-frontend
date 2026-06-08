"use client";

import {
  cartControllerAddItem,
  cartControllerClearCart,
  cartControllerGetCart,
  cartControllerRemoveItem,
  cartControllerUpdateItem,
} from "@/shared/api/generated/cart/cart";

import type {
  AddCartItemInput,
  Cart,
  UpdateCartItemInput,
} from "../types/cart.types";

export function getCart(): Promise<Cart> {
  return cartControllerGetCart();
}

export function addCartItem(input: AddCartItemInput): Promise<Cart> {
  return cartControllerAddItem(input);
}

export function updateCartItem(
  itemId: string,
  input: UpdateCartItemInput,
): Promise<Cart> {
  return cartControllerUpdateItem(itemId, input);
}

export function removeCartItem(itemId: string): Promise<Cart> {
  return cartControllerRemoveItem(itemId);
}

export function clearCart(): Promise<Cart> {
  return cartControllerClearCart();
}
