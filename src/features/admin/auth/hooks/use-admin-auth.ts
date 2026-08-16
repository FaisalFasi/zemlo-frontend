"use client";

import { useQuery } from "@tanstack/react-query";

import { queryDurations } from "@/shared/config";

import { getCurrentAdminUser } from "../api/admin-auth-api";
import type { AdminPermission, AdminUser } from "../types/admin-auth.types";

export const adminAuthQueryKeys = {
  all: ["admin-auth"] as const,
  currentUser: () => [...adminAuthQueryKeys.all, "current-user"] as const,
};

// Single source of truth for "who is the current admin" — every component
// that needs it (AdminShell, per-action permission checks) shares this one
// cached query instead of each calling /auth/me independently.
//
// `getCurrentAdminUser` throws for anything except a real 401 (see its
// comment), so a transient network/backend hiccup surfaces as a query
// ERROR, not a "successful" null — TanStack Query then leaves the
// previously-cached user in `data` untouched instead of overwriting it.
// A couple of retries here absorbs a single-request blip before that
// error state is ever shown to `AdminShell`.
export function useCurrentAdminQuery() {
  return useQuery({
    queryKey: adminAuthQueryKeys.currentUser(),
    queryFn: getCurrentAdminUser,
    staleTime: queryDurations.medium,
    gcTime: queryDurations.long,
    retry: 2,
  });
}

// `/auth/me` returns the backend's own resolved permission list (role
// defaults ∪ per-user grants) — this is the ONE place that checks it.
// There is deliberately no local role→permission map: that used to be a
// second, hand-maintained copy of authorization data that could (and did)
// drift from what the backend actually enforces.
export function hasAdminPermission(
  user: AdminUser | null | undefined,
  permission: AdminPermission,
) {
  return Boolean(user?.permissions.includes(permission));
}

// Any authenticated role except CUSTOMER may open the admin panel — what
// they can actually DO inside it is then gated per-action by
// hasAdminPermission/useAdminPermission.
export function canAccessAdmin(user: AdminUser | null | undefined) {
  return Boolean(user && user.role !== "CUSTOMER");
}

export function useAdminPermission(permission: AdminPermission) {
  const { data: user } = useCurrentAdminQuery();

  return hasAdminPermission(user, permission);
}
