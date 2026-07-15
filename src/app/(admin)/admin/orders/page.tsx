/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: /admin/orders ka page — AdminShell (sidebar + login
 * check) ke andar orders ki table.
 * REASON: Table ka component ban chuka hai; ye uska URL-darwaza hai.
 * Admin products page ka bilkul yehi pattern.
 * RISK: Zero — middleware + AdminShell pehle se protect karte hain.
 * ═════════════════════════════════════════════════════════════════
 */
import AdminShell from "@/features/admin/components/AdminShell";
import AdminOrdersTable from "@/features/admin/orders/components/AdminOrdersTable";

export const metadata = {
  title: "Orders — Zemlo Admin",
};

export default function AdminOrdersPage() {
  return (
    <AdminShell>
      <section>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-eyebrow text-muted-foreground">Orders</p>
            <h1 className="mt-2 text-section-title">Manage orders</h1>
          </div>
        </div>

        <div className="mt-6">
          <AdminOrdersTable />
        </div>
      </section>
    </AdminShell>
  );
}
