import AdminShell from "@/features/admin/components/AdminShell";
import AdminProductsPage from "@/features/admin/products/AdminProductsPage";

export default function AdminProductsRoutePage() {
  return (
    <AdminShell>
      <AdminProductsPage />
    </AdminShell>
  );
}
