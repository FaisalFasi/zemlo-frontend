"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  LayoutDashboard,
  LogOut,
  PackagePlus,
  ShoppingCart,
} from "lucide-react";

import { Button } from "@/shared/ui/button";
import {
  getCurrentAdminUser,
  logoutAdmin,
} from "@/features/admin/auth/api/admin-auth-api";
import { canAccessAdmin } from "@/features/admin/auth/lib/admin-permissions";
import type { AdminUser } from "@/features/admin/auth/types/admin-auth.types";

type AdminShellProps = {
  children: React.ReactNode;
};

export default function AdminShell({ children }: AdminShellProps) {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const currentUser = await getCurrentAdminUser();

      if (!canAccessAdmin(currentUser)) {
        // Clear the session for authenticated-but-not-admin users so
        // middleware doesn't bounce them back here in a loop.
        if (currentUser) {
          await logoutAdmin();
        }

        router.replace("/admin/login");
        return;
      }

      setUser(currentUser);
      setIsChecking(false);
    }

    void checkUser();
  }, [router]);

  async function handleLogout() {
    await logoutAdmin();
    router.replace("/admin/login");
  }

  if (isChecking) {
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

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border bg-card">
        <div className="container-page flex min-h-16 flex-wrap items-center justify-between gap-4 py-4">
          <Link href="/admin" className="flex items-center gap-2 no-underline">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              Z
            </span>
            <span className="font-medium tracking-tight">Zemlo Admin</span>
          </Link>

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
        <aside className="h-fit rounded-[2rem] border border-border bg-card p-4 lg:sticky lg:top-8">
          <nav className="space-y-1">
            <Link
              href="/admin"
              className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-foreground no-underline hover:bg-muted"
            >
              <LayoutDashboard className="size-4" />
              Dashboard
            </Link>

            {/* EXPLANATION: pehle yahan "Add product" ka link 2 dafa tha
                (copy-paste bug) — ek hata kar Orders ka link lagaya jo
                naye /admin/orders pages par le jata hai. */}
            <Link
              href="/admin/orders"
              className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-foreground no-underline hover:bg-muted"
            >
              <ShoppingCart className="size-4" />
              Orders
            </Link>

            <Link
              href="/admin/products"
              className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-foreground no-underline hover:bg-muted"
            >
              <PackagePlus className="size-4" />
              Products
            </Link>

            <Link
              href="/admin/products/new"
              className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-foreground no-underline hover:bg-muted"
            >
              <PackagePlus className="size-4" />
              Add product
            </Link>

            <Link
              href="/shop"
              className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-muted-foreground no-underline hover:bg-muted hover:text-foreground"
            >
              <Box className="size-4" />
              View shop
            </Link>
          </nav>
        </aside>

        <div>{children}</div>
      </div>
    </main>
  );
}
