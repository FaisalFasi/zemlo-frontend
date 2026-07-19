import Link from "next/link";

import AdminShell from "@/features/admin/components/AdminShell";
import AdminDashboardStats from "@/features/admin/orders/components/AdminDashboardStats";
import { Button } from "@/shared/ui/button";

export default function AdminRoutePage() {
  return (
    <AdminShell>
      {/* EXPLANATION: placeholder ki jagah asal dashboard — order stats
          (AdminDashboardStats) + orders ka shortcut. */}
      <section className="space-y-6">
        <div>
          <p className="text-eyebrow text-muted-foreground">Dashboard</p>
          <h1 className="mt-2 text-section-title">Admin workspace</h1>
        </div>

        <AdminDashboardStats />

        <div className="rounded-[2rem] border border-border bg-card p-6 md:p-8">
          <p className="max-w-2xl leading-7 text-muted-foreground">
            Manage products and orders from the sidebar. Fulfil new orders from
            the orders board.
          </p>

          <Button asChild className="mt-4 rounded-full">
            <Link href="/admin/orders">Manage orders</Link>
          </Button>
        </div>
      </section>
    </AdminShell>
  );
}
