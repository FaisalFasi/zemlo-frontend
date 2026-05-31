import type {
  AdminPermission,
  AdminRole,
  AdminUser,
} from "../types/admin-auth.types";

const rolePermissions: Record<AdminRole, AdminPermission[]> = {
  SUPER_ADMIN: [
    "admin:access",
    "products:read",
    "products:create",
    "products:update",
    "products:archive",
    "inventory:read",
    "inventory:update",
    "orders:read",
    "orders:update",
    "users:read",
    "users:manage",
    "settings:manage",
  ],
  ADMIN: [
    "admin:access",
    "products:read",
    "products:create",
    "products:update",
    "products:archive",
    "inventory:read",
    "inventory:update",
    "orders:read",
    "orders:update",
    "users:read",
  ],
  CTO: [
    "admin:access",
    "products:read",
    "inventory:read",
    "orders:read",
    "users:read",
    "settings:manage",
  ],
  MANAGER: [
    "admin:access",
    "products:read",
    "products:update",
    "inventory:read",
    "orders:read",
    "orders:update",
  ],
  PRODUCT_MANAGER: [
    "admin:access",
    "products:read",
    "products:create",
    "products:update",
    "products:archive",
    "inventory:read",
  ],
  INVENTORY_MANAGER: [
    "admin:access",
    "products:read",
    "inventory:read",
    "inventory:update",
  ],
  CUSTOMER: [],
};

export function getPermissionsForRole(role: AdminRole) {
  return rolePermissions[role] ?? [];
}

export function hasAdminPermission(
  user: AdminUser | null,
  permission: AdminPermission,
) {
  if (!user) return false;

  return getPermissionsForRole(user.role).includes(permission);
}

export function canAccessAdmin(user: AdminUser | null) {
  return hasAdminPermission(user, "admin:access");
}
