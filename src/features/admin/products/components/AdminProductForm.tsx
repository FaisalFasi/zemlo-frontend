"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import FormField from "@/shared/forms/FormField";
import FormStatusMessage from "@/shared/forms/FormStatusMessage";
import FieldInfo from "@/shared/FieldInfo";
import type {
  CatalogBrand,
  CatalogCategory,
} from "@/features/catalog/types/catalog.types";

import { productFieldHelp } from "../data/product-field-help";
import {
  createAdminProductSchema,
  type CreateAdminProductFormInput,
  type CreateAdminProductFormValues,
} from "../schemas/create-admin-product.schema";
import { Button } from "@/shared/ui/button";

type AdminProductFormSubmitResult = {
  message: string;
  href?: string;
  hrefLabel?: string;
};

type AdminProductFormProps = {
  categories: CatalogCategory[];
  brands: CatalogBrand[];
  defaultValues: CreateAdminProductFormInput;
  title: string;
  description: string;
  submitLabel: string;
  submittingLabel: string;
  cancelHref: string;
  onSubmit: (
    values: CreateAdminProductFormValues,
  ) => Promise<AdminProductFormSubmitResult>;
};

export default function AdminProductForm({
  categories,
  brands,
  defaultValues,
  title,
  description,
  submitLabel,
  submittingLabel,
  cancelHref,
  onSubmit,
}: AdminProductFormProps) {
  const [serverError, setServerError] = useState("");
  const [successResult, setSuccessResult] =
    useState<AdminProductFormSubmitResult | null>(null);

  const stableDefaultValues = useMemo(() => defaultValues, [defaultValues]);

  const form = useForm<
    CreateAdminProductFormInput,
    undefined,
    CreateAdminProductFormValues
  >({
    resolver: zodResolver(createAdminProductSchema),
    defaultValues: stableDefaultValues,
    mode: "onBlur",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  useEffect(() => {
    reset(stableDefaultValues);
  }, [reset, stableDefaultValues]);

  async function handleFormSubmit(values: CreateAdminProductFormValues) {
    setServerError("");
    setSuccessResult(null);

    try {
      const result = await onSubmit(values);
      setSuccessResult(result);
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please check the form and try again.",
      );
    }
  }

  if (categories.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-border bg-card p-8">
        <h1 className="text-2xl font-medium tracking-tight text-foreground">
          No categories found.
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Please create or activate categories in the backend before creating a
          product.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6"
      noValidate
    >
      <div className="mb-8">
        <p className="text-eyebrow text-muted-foreground">Products</p>

        <h1 className="mt-3 text-section-title">{title}</h1>

        <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
          {description}
        </p>
      </div>

      {serverError ? (
        <FormStatusMessage
          type="error"
          title="Product was not saved"
          message={serverError}
        />
      ) : null}

      {successResult ? (
        <FormStatusMessage
          type="success"
          title="Product saved"
          message={successResult.message}
        />
      ) : null}

      {successResult?.href ? (
        <div className="rounded-2xl border border-border bg-card px-4 py-3 text-sm">
          <Link
            href={successResult.href}
            className="font-medium text-foreground underline underline-offset-4"
          >
            {successResult.hrefLabel ?? "View product"}
          </Link>
        </div>
      ) : null}

      <section className="rounded-[2rem] border border-border bg-card p-6 md:p-8">
        <p className="text-eyebrow text-muted-foreground">Basic information</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <FormField
            htmlFor="name"
            label="Product name"
            info={productFieldHelp.name}
            error={errors.name?.message}
            className="md:col-span-2"
          >
            <input
              id="name"
              {...register("name")}
              placeholder="Wireless Headphones"
              className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
            />
          </FormField>

          <FormField
            htmlFor="slug"
            label="Slug"
            info={productFieldHelp.slug}
            error={errors.slug?.message}
          >
            <input
              id="slug"
              {...register("slug")}
              placeholder="wireless-headphones"
              className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
            />
          </FormField>

          <FormField
            htmlFor="sku"
            label="SKU"
            info={productFieldHelp.sku}
            error={errors.sku?.message}
          >
            <input
              id="sku"
              {...register("sku")}
              placeholder="WH-001"
              className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
            />
          </FormField>

          <FormField
            htmlFor="categoryId"
            label="Category"
            info={productFieldHelp.categoryId}
            error={errors.categoryId?.message}
          >
            <select
              id="categoryId"
              {...register("categoryId")}
              className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            htmlFor="brandId"
            label="Brand"
            info={productFieldHelp.brandId}
            error={errors.brandId?.message}
          >
            <select
              id="brandId"
              {...register("brandId")}
              className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
            >
              <option value="">No brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            htmlFor="shortDescription"
            label="Short description"
            info={productFieldHelp.shortDescription}
            error={errors.shortDescription?.message}
            className="md:col-span-2"
          >
            <input
              id="shortDescription"
              {...register("shortDescription")}
              placeholder="A short product summary for cards and product pages"
              className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
            />
          </FormField>

          <FormField
            htmlFor="description"
            label="Description"
            info={productFieldHelp.description}
            error={errors.description?.message}
            className="md:col-span-2"
          >
            <textarea
              id="description"
              {...register("description")}
              rows={5}
              placeholder="Full product description"
              className="w-full rounded-3xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground"
            />
          </FormField>
        </div>
      </section>

      <section className="rounded-[2rem] border border-border bg-card p-6 md:p-8">
        <p className="text-eyebrow text-muted-foreground">Pricing & stock</p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <FormField
            htmlFor="price"
            label="Price"
            info={productFieldHelp.price}
            error={errors.price?.message}
          >
            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              {...register("price")}
              className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
            />
          </FormField>

          <FormField
            htmlFor="compareAtPrice"
            label="Compare at price"
            info={productFieldHelp.compareAtPrice}
            error={errors.compareAtPrice?.message}
          >
            <input
              id="compareAtPrice"
              type="number"
              min="0"
              step="0.01"
              {...register("compareAtPrice")}
              className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
            />
          </FormField>

          <FormField
            htmlFor="costPrice"
            label="Cost price"
            info={productFieldHelp.costPrice}
            error={errors.costPrice?.message}
          >
            <input
              id="costPrice"
              type="number"
              min="0"
              step="0.01"
              {...register("costPrice")}
              className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
            />
          </FormField>

          <FormField
            htmlFor="stock"
            label="Stock"
            info={productFieldHelp.stock}
            error={errors.stock?.message}
          >
            <input
              id="stock"
              type="number"
              min="0"
              step="1"
              {...register("stock")}
              className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
            />
          </FormField>

          <FormField
            htmlFor="status"
            label="Status"
            info={productFieldHelp.status}
            error={errors.status?.message}
          >
            <select
              id="status"
              {...register("status")}
              className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
            >
              <option value="ACTIVE">Active</option>
              <option value="DRAFT">Draft</option>
            </select>
          </FormField>

          <div className="flex items-end">
            <label className="flex h-11 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm">
              <input
                type="checkbox"
                className="size-4"
                {...register("isFeatured")}
              />

              <span className="inline-flex items-center gap-1.5">
                Featured
                <FieldInfo
                  title={productFieldHelp.isFeatured.title}
                  description={productFieldHelp.isFeatured.description}
                />
              </span>
            </label>
          </div>

          <div className="flex flex-wrap gap-3 md:col-span-3">
            <label className="flex h-11 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm">
              <input
                type="checkbox"
                className="size-4"
                {...register("trackInventory")}
              />

              <span className="inline-flex items-center gap-1.5">
                Track inventory
                <FieldInfo
                  title={productFieldHelp.trackInventory.title}
                  description={productFieldHelp.trackInventory.description}
                />
              </span>
            </label>

            <label className="flex h-11 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm">
              <input
                type="checkbox"
                className="size-4"
                {...register("allowBackorder")}
              />

              <span className="inline-flex items-center gap-1.5">
                Allow backorder
                <FieldInfo
                  title={productFieldHelp.allowBackorder.title}
                  description={productFieldHelp.allowBackorder.description}
                />
              </span>
            </label>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-border bg-card p-6 md:p-8">
        <p className="text-eyebrow text-muted-foreground">Media</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <FormField
            htmlFor="imageUrl"
            label="Image URL"
            info={productFieldHelp.imageUrl}
            error={errors.imageUrl?.message}
          >
            <input
              id="imageUrl"
              type="url"
              {...register("imageUrl")}
              placeholder="https://example.com/product.jpg"
              className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
            />
          </FormField>

          <FormField
            htmlFor="imageAlt"
            label="Image alt text"
            info={productFieldHelp.imageAlt}
            error={errors.imageAlt?.message}
          >
            <input
              id="imageAlt"
              {...register("imageAlt")}
              placeholder="Black wireless headphones on white background"
              className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
            />
          </FormField>
        </div>
      </section>

      <section className="rounded-[2rem] border border-border bg-card p-6 md:p-8">
        <p className="text-eyebrow text-muted-foreground">SEO & shipping</p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <FormField
            htmlFor="keywordsText"
            label="Keywords"
            info={productFieldHelp.keywords}
            error={errors.keywordsText?.message}
            className="md:col-span-3"
          >
            <input
              id="keywordsText"
              {...register("keywordsText")}
              placeholder="audio, headphones, wireless"
              className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
            />
          </FormField>

          <FormField
            htmlFor="metaTitle"
            label="Meta title"
            info={productFieldHelp.metaTitle}
            error={errors.metaTitle?.message}
            className="md:col-span-3"
          >
            <input
              id="metaTitle"
              {...register("metaTitle")}
              className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
            />
          </FormField>

          <FormField
            htmlFor="metaDescription"
            label="Meta description"
            info={productFieldHelp.metaDescription}
            error={errors.metaDescription?.message}
            className="md:col-span-3"
          >
            <textarea
              id="metaDescription"
              {...register("metaDescription")}
              rows={3}
              className="w-full rounded-3xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground"
            />
          </FormField>

          <FormField
            htmlFor="weight"
            label="Weight"
            info={productFieldHelp.weight}
            error={errors.weight?.message}
          >
            <input
              id="weight"
              type="number"
              min="0"
              step="0.01"
              {...register("weight")}
              className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
            />
          </FormField>

          <FormField
            htmlFor="length"
            label="Length"
            info={productFieldHelp.length}
            error={errors.length?.message}
          >
            <input
              id="length"
              type="number"
              min="0"
              step="0.01"
              {...register("length")}
              className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
            />
          </FormField>

          <FormField
            htmlFor="width"
            label="Width"
            info={productFieldHelp.width}
            error={errors.width?.message}
          >
            <input
              id="width"
              type="number"
              min="0"
              step="0.01"
              {...register("width")}
              className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
            />
          </FormField>

          <FormField
            htmlFor="height"
            label="Height"
            info={productFieldHelp.height}
            error={errors.height?.message}
          >
            <input
              id="height"
              type="number"
              min="0"
              step="0.01"
              {...register("height")}
              className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
            />
          </FormField>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button asChild variant="outline" className="rounded-full">
          <Link href={cancelHref}>Cancel</Link>
        </Button>

        <Button type="submit" disabled={isSubmitting} className="rounded-full">
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {submittingLabel}
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
}
