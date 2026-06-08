const STORAGE_PREFIX = "zemlo";

export const storageKeys = Object.freeze({
  adminAccessToken: `${STORAGE_PREFIX}_admin_access_token`,
  adminUser: `${STORAGE_PREFIX}_admin_user`,
  guestCartId: `${STORAGE_PREFIX}_guest_cart_id`,
} as const);

export type StorageKey = (typeof storageKeys)[keyof typeof storageKeys];
