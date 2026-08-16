import {
  getCatalogBrands,
  getCatalogCategories,
} from "@/features/catalog/api/catalog-api";
import AdminShell from "@/features/admin/components/AdminShell";
import AdminProductCreateForm from "@/features/admin/products/components/AdminProductCreateForm";

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

export default async function AdminCreateProductRoutePage() {
  const formData = await getProductFormData();

  return (
    <AdminShell>
      {/* AdminProductForm (rendered inside AdminProductCreateForm) already
          renders its own "Products / Create product" heading + description
          from props — this page used to duplicate the same heading above
          it. */}
      <AdminProductCreateForm
        categories={formData.categories}
        brands={formData.brands}
      />
    </AdminShell>
  );
}
