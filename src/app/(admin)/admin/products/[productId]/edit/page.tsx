import AdminShell from "@/features/admin/components/AdminShell";
import AdminSectionErrorBoundary from "@/features/admin/components/AdminSectionErrorBoundary";
import {
  getCatalogBrands,
  getCatalogCategories,
} from "@/features/catalog/api/catalog-api";
import AdminProductEditForm from "@/features/admin/products/components/AdminProductEditForm";
import AdminVariantsManager from "@/features/admin/products/components/AdminVariantsManager";

type AdminEditProductRoutePageProps = {
  params: Promise<{
    productId: string;
  }>;
};

async function getProductFormData() {
  const [categoriesResult, brandsResult] = await Promise.allSettled([
    getCatalogCategories(),
    getCatalogBrands(),
  ]);

  return {
    categories:
      categoriesResult.status === "fulfilled" ? categoriesResult.value : [],
    brands: brandsResult.status === "fulfilled" ? brandsResult.value : [],
  };
}

export default async function AdminEditProductRoutePage({
  params,
}: AdminEditProductRoutePageProps) {
  const { productId } = await params;
  const formData = await getProductFormData();

  return (
    <AdminShell>
      <AdminSectionErrorBoundary sectionLabel="The product form">
        <AdminProductEditForm
          productId={productId}
          categories={formData.categories}
          brands={formData.brands}
        />
      </AdminSectionErrorBoundary>

      {/* EXPLANATION: variants sirf edit page par — create par productId
          abhi hota hi nahi (pehle save, phir variants). */}
      <AdminSectionErrorBoundary sectionLabel="The variants section">
        <AdminVariantsManager productId={productId} />
      </AdminSectionErrorBoundary>
    </AdminShell>
  );
}
