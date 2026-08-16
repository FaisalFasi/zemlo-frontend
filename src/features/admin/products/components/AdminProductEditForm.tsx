"use client";

import { useMemo } from "react";

import type {
  CatalogBrand,
  CatalogCategory,
} from "@/features/catalog/types/catalog.types";

import AdminProductForm from "./AdminProductForm";
import {
  useAdminProductDetailQuery,
  useUpdateAdminProductMutation,
} from "../hooks/use-admin-products";

import type { CreateAdminProductFormValues } from "../schemas/create-admin-product.schema";
import {
  adminProductDetailToFormInput,
  productFormValuesToUpdateInput,
} from "../lib/admin-product-form-mappers";
import { useAdminPermission } from "@/features/admin/auth/hooks/use-admin-auth";

type AdminProductEditFormProps = {
  productId: string;
  categories: CatalogCategory[];
  brands: CatalogBrand[];
};

export default function AdminProductEditForm({
  productId,
  categories,
  brands,
}: AdminProductEditFormProps) {
  const productQuery = useAdminProductDetailQuery(productId);
  const updateProductMutation = useUpdateAdminProductMutation(productId);
  const canUpdate = useAdminPermission("products.update");

  const defaultValues = useMemo(() => {
    if (!productQuery.data) return null;

    return adminProductDetailToFormInput(productQuery.data);
  }, [productQuery.data]);

  if (!canUpdate) {
    return (
      <div className="rounded-[2rem] border border-border bg-card p-8 text-center text-muted-foreground">
        Your role does not have permission to edit products.
      </div>
    );
  }

  async function handleSubmit(values: CreateAdminProductFormValues) {
    const product = await updateProductMutation.mutateAsync(
      productFormValuesToUpdateInput(values, productQuery.data),
    );

    return {
      message: `${product.name} was updated successfully.`,
      href:
        product.status === "ACTIVE" ? `/products/${product.slug}` : undefined,
      hrefLabel: "View public product page",
    };
  }

  if (productQuery.isLoading) {
    return (
      <div className="rounded-[2rem] border border-border bg-card p-10 text-center text-muted-foreground">
        Loading product...
      </div>
    );
  }

  if (productQuery.error || !defaultValues) {
    return (
      <div className="rounded-[2rem] border border-border bg-card p-8">
        <h1 className="text-2xl font-medium tracking-tight text-foreground">
          Product could not be loaded.
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {productQuery.error instanceof Error
            ? productQuery.error.message
            : "Please go back to products and try again."}
        </p>
      </div>
    );
  }

  return (
    <AdminProductForm
      categories={categories}
      brands={brands}
      defaultValues={defaultValues}
      title={`Edit ${productQuery.data?.name ?? "product"}`}
      description="Update product information, pricing, stock, media, SEO, and visibility."
      submitLabel="Save changes"
      submittingLabel="Saving..."
      cancelHref="/admin/products"
      onSubmit={handleSubmit}
    />
  );
}
