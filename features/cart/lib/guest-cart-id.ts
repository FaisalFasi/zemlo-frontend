const GUEST_CART_ID_STORAGE_KEY = "zemlo_guest_cart_id";

function createGuestCartId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `guest_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function getOrCreateGuestCartId() {
  if (typeof window === "undefined") {
    return "";
  }

  const existingGuestId = window.localStorage.getItem(
    GUEST_CART_ID_STORAGE_KEY,
  );

  if (existingGuestId) {
    return existingGuestId;
  }

  const guestId = createGuestCartId();

  window.localStorage.setItem(GUEST_CART_ID_STORAGE_KEY, guestId);

  return guestId;
}
