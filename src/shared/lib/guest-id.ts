import { storageKeys } from "@/shared/config/storage-keys";

function canUseBrowserStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function createGuestId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `guest_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function getStoredGuestId() {
  if (!canUseBrowserStorage()) {
    return "";
  }

  try {
    return window.localStorage.getItem(storageKeys.guestCartId) ?? "";
  } catch {
    return "";
  }
}

export function setStoredGuestId(guestId: string) {
  if (!canUseBrowserStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(storageKeys.guestCartId, guestId);
  } catch {
    // Ignore storage failures. Cart requests can still continue without a guest id.
  }
}

export function clearStoredGuestId() {
  if (!canUseBrowserStorage()) {
    return;
  }

  try {
    window.localStorage.removeItem(storageKeys.guestCartId);
  } catch {
    // Ignore storage failures.
  }
}

export function getOrCreateGuestId() {
  const existingGuestId = getStoredGuestId();

  if (existingGuestId) {
    return existingGuestId;
  }

  const guestId = createGuestId();
  setStoredGuestId(guestId);

  return guestId;
}
