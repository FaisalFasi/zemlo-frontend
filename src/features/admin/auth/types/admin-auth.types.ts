// Matches the backend's real `UserRole` enum (Prisma schema) — verified
// against the live `/api-json` spec on 2026-08-16. Only these 4 roles
// exist server-side.
export type AdminRole = "CUSTOMER" | "STAFF" | "ADMIN" | "SUPER_ADMIN";

// The backend's real permission catalog (`PERMISSIONS` constant,
// zemlo-backend `src/common/constants/permissions.ts`), verified against
// the live backend on 2026-08-16. `/auth/me` returns the logged-in user's
// actual resolved list of these as `permissions: string[]` — this frontend
// checks membership in THAT array (see `hasAdminPermission` in
// `hooks/use-admin-auth.ts`), it does not maintain its own role→permission
// map anymore (that was a second, drift-prone source of truth).
export type AdminPermission =
  | "products.view"
  | "products.create"
  | "products.update"
  | "products.delete"
  | "categories.view"
  | "categories.create"
  | "categories.update"
  | "categories.delete"
  | "brands.view"
  | "brands.create"
  | "brands.update"
  | "brands.delete"
  | "orders.view_own"
  | "orders.view_all"
  | "orders.update"
  | "orders.cancel"
  | "customers.view"
  | "customers.update"
  | "customers.disable"
  | "staff.view"
  | "staff.create"
  | "staff.update"
  | "staff.disable"
  | "staff.permissions"
  | "settings.view"
  | "settings.update"
  | "analytics.view";

export type AdminUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  avatar: string | null;
  role: AdminRole;
  isActive: boolean;
  isVerified: boolean;
  sessionId: string;
  permissions: AdminPermission[];
  createdAt: string;
  updatedAt: string;
};

export type AdminLoginInput = {
  email: string;
  password: string;
};

export type AdminLoginResponse = {
  message: string;
  user: AdminUser;
};

export type AdminMeResponse = {
  user: AdminUser;
};
