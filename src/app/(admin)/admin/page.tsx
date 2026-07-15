import AdminShell from "@/features/admin/components/AdminShell";

export default function AdminRoutePage() {
  return (
    <AdminShell>
      <section className="rounded-[2rem] border border-border bg-card p-6 md:p-8">
        <p className="text-eyebrow text-muted-foreground">Dashboard</p>

        <h1 className="mt-3 text-section-title">Admin workspace</h1>

        <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
          Manage your catalog from the sidebar. Orders and sales metrics will
          appear here once the orders dashboard ships.
        </p>
      </section>
    </AdminShell>
  );
}
