/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: /admin/catalog — categories aur brands dono managers
 * ek hi page par, upar-neeche.
 * REASON: Dono chhote CRUD screens hain aur aapas mein related
 * (product form dono ke dropdowns use karta hai) — do alag pages ke
 * bajaye ek "Catalog" page sidebar ko chhota rakhta hai.
 * RISK: Zero — naya page; middleware + AdminShell protect karte hain.
 * ═════════════════════════════════════════════════════════════════
 */
import AdminShell from "@/features/admin/components/AdminShell";
import AdminSectionErrorBoundary from "@/features/admin/components/AdminSectionErrorBoundary";
import AdminBrandsManager from "@/features/admin/catalog/components/AdminBrandsManager";
import AdminCategoriesManager from "@/features/admin/catalog/components/AdminCategoriesManager";

export const metadata = {
  title: "Catalog — Zemlo Admin",
};

export default function AdminCatalogPage() {
  return (
    <AdminShell>
      <div className="mb-6">
        <p className="text-eyebrow text-muted-foreground">Catalog</p>
        <h1 className="mt-2 text-section-title">Categories & brands</h1>
      </div>

      <div className="space-y-6">
        <AdminSectionErrorBoundary sectionLabel="Categories">
          <AdminCategoriesManager />
        </AdminSectionErrorBoundary>

        <AdminSectionErrorBoundary sectionLabel="Brands">
          <AdminBrandsManager />
        </AdminSectionErrorBoundary>
      </div>
    </AdminShell>
  );
}
