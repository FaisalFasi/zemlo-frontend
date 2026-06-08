import { storageKeys } from "@/shared/config/storage-keys";

function createGuestId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `guest_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function getStoredGuestId() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(storageKeys.guestCartId) ?? "";
}

export function getOrCreateGuestId() {
  if (typeof window === "undefined") {
    return "";
  }

  const existingGuestId = getStoredGuestId();

  if (existingGuestId) {
    return existingGuestId;
  }

  const guestId = createGuestId();

  window.localStorage.setItem(storageKeys.guestCartId, guestId);

  return guestId;
}
