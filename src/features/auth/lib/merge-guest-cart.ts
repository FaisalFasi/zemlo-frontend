"use client";

import { addCartItem, getCart } from "@/features/cart/api/cart-api";
import type { Cart } from "@/features/cart/types/cart.types";
import { clearStoredGuestId, getStoredGuestId } from "@/shared/lib/guest-id";

// The backend has no merge endpoint (cart owner resolution prefers userId
// over x-guest-id), so we snapshot the guest cart BEFORE login and replay
// its items into the user cart AFTER the session cookie exists.

export async function snapshotGuestCart(): Promise<Cart | null> {
  if (!getStoredGuestId()) {
    return null;
  }

  try {
    return await getCart();
  } catch {
    return null;
  }
}

export async function mergeGuestCartItems(guestCart: Cart | null) {
  const items = guestCart?.items ?? [];

  for (const item of items) {
    // Best effort per item: one out-of-stock product must not block the rest.
    try {
      await addCartItem({
        productId: item.productId,
        quantity: item.quantity,
        ...(item.variantId ? { variantId: item.variantId } : {}),
      });
    } catch {
      // Skip items the backend rejects (archived, out of stock, ...).
    }
  }

  // The guest cart has served its purpose; a fresh id is created if the
  // user ever browses logged-out again (prevents re-merging old items).
  clearStoredGuestId();
}
