export type AdminRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "CTO"
  | "MANAGER"
  | "PRODUCT_MANAGER"
  | "INVENTORY_MANAGER"
  | "CUSTOMER";

export type AdminPermission =
  | "admin:access"
  | "products:read"
  | "products:create"
  | "products:update"
  | "products:archive"
  | "inventory:read"
  | "inventory:update"
  | "orders:read"
  | "orders:update"
  | "users:read"
  | "users:manage"
  | "settings:manage";

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
