"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, LogOut, Package } from "lucide-react";

import { routes } from "@/shared/config";
import { Button } from "@/shared/ui/button";

import {
  useCurrentCustomerQuery,
  useLogoutMutation,
} from "../hooks/use-customer-auth";

export default function AccountPanel() {
  const router = useRouter();
  const currentUserQuery = useCurrentCustomerQuery();
  const logoutMutation = useLogoutMutation();

  async function handleLogout() {
    await logoutMutation.mutateAsync();

    router.push(routes.home);
    router.refresh();
  }

  if (currentUserQuery.isLoading) {
    return (
      <div className="rounded-[2rem] border border-border bg-card p-10 text-center text-muted-foreground">
        Loading your account...
      </div>
    );
  }

  const user = currentUserQuery.data;

  if (!user) {
    // Middleware normally prevents this; expired sessions can still land here.
    router.replace(routes.auth.login);
    return null;
  }

  return (
    <div className="rounded-[2rem] border border-border bg-card p-6 md:p-8">
      <p className="text-eyebrow text-muted-foreground">Account</p>

      <h1 className="mt-3 text-3xl font-medium tracking-tight text-foreground">
        Hi, {user.firstName}.
      </h1>

      <dl className="mt-6 space-y-4 text-sm">
        <div>
          <dt className="text-muted-foreground">Name</dt>
          <dd className="mt-1 font-medium text-foreground">
            {user.firstName} {user.lastName}
          </dd>
        </div>

        <div>
          <dt className="text-muted-foreground">Email</dt>
          <dd className="mt-1 font-medium text-foreground">{user.email}</dd>
        </div>
      </dl>

      {/* EXPLANATION: "coming soon" ki jagah asal order-history ka link —
          Phase 4 mein /account/orders ban gaya hai, ab customer ko wahan
          pahunchne ka button chahiye. */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild className="rounded-full">
          <Link href={`${routes.account}/orders`}>
            <Package className="size-4" />
            View your orders
          </Link>
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="rounded-full"
        >
          {logoutMutation.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <LogOut className="size-4" />
          )}
          Sign out
        </Button>
      </div>
    </div>
  );
}
