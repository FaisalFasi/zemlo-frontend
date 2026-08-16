"use client";

import { mergeGuestCart } from "@/features/cart/api/cart-api";
import { clearStoredGuestId } from "@/shared/lib/guest-id";

// The backend merges guest→user carts itself now (POST /cart/merge, keyed
// off the x-guest-id header the guest cart was already using) — replaces
// the old client-side "snapshot the guest cart, then replay every item
// one-by-one after login" workaround. Safe to call unconditionally right
// after login/register: if there's no guest cart to merge it's a no-op
// that just returns the current user cart.
export async function mergeGuestCartIntoUser() {
  try {
    await mergeGuestCart();
  } catch {
    // Best-effort — a failed merge must never block login/registration.
  } finally {
    // The guest cart has served its purpose; a fresh id is created if the
    // user ever browses logged-out again (prevents re-merging old items).
    clearStoredGuestId();
  }
}
