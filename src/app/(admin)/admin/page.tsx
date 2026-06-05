import AdminShell from "@/features/admin/components/AdminShell";

export default function AdminRoutePage() {
  return (
    <AdminShell>
      <section className="rounded-[2rem] border border-border bg-card p-6 md:p-8">
        <p className="text-eyebrow text-muted-foreground">Dashboard</p>

        <h1 className="mt-3 text-section-title">Admin workspace</h1>

        <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
          Admin access is connected. Next we will add the product creation form
          using your backend admin product API.
        </p>
      </section>
    </AdminShell>
  );
}
