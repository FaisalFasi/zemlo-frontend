import { storageKeys } from "@/shared/config/storage-keys";

import type { AdminUser } from "../types/admin-auth.types";

export function getAdminAccessToken() {
  if (typeof window === "undefined") return null;

  return window.localStorage.getItem(storageKeys.adminAccessToken);
}

export function setAdminSession(accessToken: string, user: AdminUser) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(storageKeys.adminAccessToken, accessToken);
  window.localStorage.setItem(storageKeys.adminUser, JSON.stringify(user));
}

export function getStoredAdminUser() {
  if (typeof window === "undefined") return null;

  const value = window.localStorage.getItem(storageKeys.adminUser);

  if (!value) return null;

  try {
    return JSON.parse(value) as AdminUser;
  } catch {
    return null;
  }
}

export function clearAdminSession() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(storageKeys.adminAccessToken);
  window.localStorage.removeItem(storageKeys.adminUser);
}
