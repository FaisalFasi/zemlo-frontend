"use client";

import type {
  CatalogBrand,
  CatalogCategory,
} from "@/features/catalog/types/catalog.types";

import AdminProductForm from "./AdminProductForm";
import { useCreateAdminProductMutation } from "../hooks/use-admin-products";
import {
  createAdminProductDefaultValues,
  type CreateAdminProductFormValues,
} from "../schemas/create-admin-product.schema";
import { productFormValuesToCreateInput } from "../lib/admin-product-form-mappers";

type AdminProductCreateFormProps = {
  categories: CatalogCategory[];
  brands: CatalogBrand[];
};

export default function AdminProductCreateForm({
  categories,
  brands,
}: AdminProductCreateFormProps) {
  const createProductMutation = useCreateAdminProductMutation();

  async function handleSubmit(values: CreateAdminProductFormValues) {
    const product = await createProductMutation.mutateAsync(
      productFormValuesToCreateInput(values),
    );

    return {
      message: `${product.name} was created as ${product.status}.`,
      href:
        product.status === "ACTIVE" ? `/products/${product.slug}` : undefined,
      hrefLabel: "View public product page",
    };
  }

  return (
    <AdminProductForm
      categories={categories}
      brands={brands}
      defaultValues={createAdminProductDefaultValues}
      title="Create product"
      description="Add a real product to the catalog. Use image URLs for now; Cloudinary upload can be added later."
      submitLabel="Create product"
      submittingLabel="Creating..."
      cancelHref="/admin/products"
      onSubmit={handleSubmit}
    />
  );
}
