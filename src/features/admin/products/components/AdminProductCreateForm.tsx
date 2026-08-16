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
import { useAdminPermission } from "@/features/admin/auth/hooks/use-admin-auth";

type AdminProductCreateFormProps = {
  categories: CatalogCategory[];
  brands: CatalogBrand[];
};

export default function AdminProductCreateForm({
  categories,
  brands,
}: AdminProductCreateFormProps) {
  const createProductMutation = useCreateAdminProductMutation();
  const canCreate = useAdminPermission("products.create");

  if (!canCreate) {
    return (
      <div className="rounded-[2rem] border border-border bg-card p-8 text-center text-muted-foreground">
        Your role does not have permission to create products.
      </div>
    );
  }

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
      description="Add a real product to the catalog. Upload an image or paste a URL from a supported host."
      submitLabel="Create product"
      submittingLabel="Creating..."
      cancelHref="/admin/products"
      onSubmit={handleSubmit}
    />
  );
}
