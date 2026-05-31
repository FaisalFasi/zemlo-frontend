import { AdminUser } from "../types/admin-auth.types";

const ADMIN_ACCESS_TOKEN_KEY = "zemlo_admin_access_token";
const ADMIN_USER_KEY = "zemlo_admin_user";

export function getAdminAccessToken() {
  if (typeof window === "undefined") return null;

  return window.localStorage.getItem(ADMIN_ACCESS_TOKEN_KEY);
}

export function setAdminSession(accessToken: string, user: AdminUser) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(ADMIN_ACCESS_TOKEN_KEY, accessToken);
  window.localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
}

export function getStoredAdminUser() {
  if (typeof window === "undefined") return null;

  const value = window.localStorage.getItem(ADMIN_USER_KEY);

  if (!value) return null;

  try {
    return JSON.parse(value) as AdminUser;
  } catch {
    return null;
  }
}

export function clearAdminSession() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(ADMIN_ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(ADMIN_USER_KEY);
}
