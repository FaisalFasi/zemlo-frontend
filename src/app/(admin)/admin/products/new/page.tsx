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
      <div className="mb-8">
        <p className="text-eyebrow text-muted-foreground">Products</p>

        <h1 className="mt-3 text-section-title">Create product</h1>

        <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
          Add a real product to the catalog. Use image URLs for now; Cloudinary
          upload can be added later.
        </p>
      </div>

      <AdminProductCreateForm
        categories={formData.categories}
        brands={formData.brands}
      />
    </AdminShell>
  );
}
