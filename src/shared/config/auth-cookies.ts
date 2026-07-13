// Edge-safe (imported by middleware): no server-only APIs here.
const COOKIE_PREFIX = "zemlo";

export const authCookies = Object.freeze({
  adminSession: `${COOKIE_PREFIX}_admin_session`,
  customerSession: `${COOKIE_PREFIX}_customer_session`,
} as const);

// Must not outlive the backend JWT (JWT_EXPIRES_IN / SESSION_EXPIRES_DAYS = 7d).
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;
