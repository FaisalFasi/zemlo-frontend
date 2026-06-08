export const storageKeys = Object.freeze({
  adminAccessToken: "zemlo_admin_access_token",
  adminUser: "zemlo_admin_user",
  guestCartId: "zemlo_guest_cart_id",
} as const);

export type StorageKey = (typeof storageKeys)[keyof typeof storageKeys];
