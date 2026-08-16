"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  Box,
  LayoutDashboard,
  LogOut,
  PackagePlus,
  ShoppingCart,
  Tags,
} from "lucide-react";

import { Button } from "@/shared/ui/button";
import { logoutAdmin } from "@/features/admin/auth/api/admin-auth-api";
import {
  adminAuthQueryKeys,
  canAccessAdmin,
  useAdminPermission,
  useCurrentAdminQuery,
} from "@/features/admin/auth/hooks/use-admin-auth";
import AdminMobileNav from "./AdminMobileNav";
import AdminNavLinks, { type AdminNavItem } from "./AdminNavLinks";

type AdminShellProps = {
  children: React.ReactNode;
};

export default function AdminShell({ children }: AdminShellProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const adminQuery = useCurrentAdminQuery();
  const canCreateProduct = useAdminPermission("products.create");

  const user = adminQuery.data ?? null;

  // A resolved fetch with no (admin) user is a CONFIRMED unauthorized state
  // — bounce to login. A query that's still loading, or one that errored
  // (a transient network/backend hiccup — see getCurrentAdminUser's 401
  // check), is NOT the same thing: treating it as "unauthorized" would tear
  // the whole admin panel out from under an in-progress action every time
  // the network hiccups, and could even loop (see the effect below).
  const isInitialLoad = adminQuery.isLoading;
  const isConfirmedUnauthorized = adminQuery.isSuccess && !canAccessAdmin(user);
  const isUnverifiable = adminQuery.isError && !canAccessAdmin(user);

  useEffect(() => {
    if (isInitialLoad || !isConfirmedUnauthorized) return;

    async function bounce() {
      // Always clear the cookie (even for a plain "not logged in" 401,
      // where there's no `user`) — otherwise a stale cookie survives,
      // middleware sees it on the login page, and redirects straight back
      // to /admin, looping forever.
      await logoutAdmin();
      queryClient.removeQueries({ queryKey: adminAuthQueryKeys.all });
      router.replace("/admin/login");
    }

    void bounce();
  }, [isInitialLoad, isConfirmedUnauthorized, queryClient, router]);

  async function handleLogout() {
    await logoutAdmin();
    queryClient.removeQueries({ queryKey: adminAuthQueryKeys.all });
    router.replace("/admin/login");
  }

  if (isInitialLoad || isConfirmedUnauthorized) {
    return (
      <main className="bg-background text-foreground">
        <section className="container-page py-10">
          <div className="rounded-[2rem] border border-border bg-card p-10 text-center text-muted-foreground">
            Checking admin access...
          </div>
        </section>
      </main>
    );
  }

  if (isUnverifiable) {
    return (
      <main className="bg-background text-foreground">
        <section className="container-page py-10">
          <div className="rounded-[2rem] border border-border bg-card p-10 text-center">
            <p className="text-muted-foreground">
              Could not verify your admin session. This is usually a
              temporary connection issue — your session has not been ended.
            </p>
            <Button
              type="button"
              className="mt-6 rounded-full"
              onClick={() => adminQuery.refetch()}
            >
              Try again
            </Button>
          </div>
        </section>
      </main>
    );
  }

  const navItems: AdminNavItem[] = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { href: "/admin/products", label: "Products", icon: PackagePlus },
    { href: "/admin/catalog", label: "Categories & brands", icon: Tags },
    ...(canCreateProduct
      ? [{ href: "/admin/products/new", label: "Add product", icon: PackagePlus }]
      : []),
    { href: "/shop", label: "View shop", icon: Box, muted: true },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border bg-card">
        <div className="container-page flex min-h-16 flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-1">
            <AdminMobileNav items={navItems} />

            <Link
              href="/admin"
              className="flex items-center gap-2 no-underline"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                Z
              </span>
              <span className="font-medium tracking-tight">Zemlo Admin</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="hidden text-right text-sm sm:block">
                <p className="font-medium text-foreground">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-muted-foreground">{user.role}</p>
              </div>
            ) : null}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="rounded-full"
            >
              <LogOut className="size-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container-page grid gap-8 py-8 lg:grid-cols-[16rem_1fr]">
        <aside className="hidden h-fit rounded-[2rem] border border-border bg-card p-4 lg:sticky lg:top-8 lg:block">
          <AdminNavLinks items={navItems} />
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </main>
  );
}
