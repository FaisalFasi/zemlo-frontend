const STORAGE_PREFIX = "zemlo";

export const storageKeys = Object.freeze({
  guestCartId: `${STORAGE_PREFIX}_guest_cart_id`,
} as const);

export type StorageKey = (typeof storageKeys)[keyof typeof storageKeys];
