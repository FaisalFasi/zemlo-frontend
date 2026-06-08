import AdminShell from "@/features/admin/components/AdminShell";
import {
  getCatalogBrands,
  getCatalogCategories,
} from "@/features/catalog/api/catalog-api";
import AdminProductEditForm from "@/features/admin/products/components/AdminProductEditForm";

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
      <AdminProductEditForm
        productId={productId}
        categories={formData.categories}
        brands={formData.brands}
      />
    </AdminShell>
  );
}
