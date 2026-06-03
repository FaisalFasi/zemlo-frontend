"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import FieldInfo from "@/components/shared/FieldInfo";
import type {
  CatalogBrand,
  CatalogCategory,
} from "@/features/catalog/types/catalog.types";

import { createAdminProduct } from "../api/admin-products-api";
import { productFieldHelp } from "../data/product-field-help";
import ProductFieldLabel from "./ProductFieldLabel";
import type {
  AdminProductStatus,
  CreatedAdminProduct,
  CreateAdminProductInput,
} from "../types/admin-product.types";

type AdminProductCreateFormProps = {
  categories: CatalogCategory[];
  brands: CatalogBrand[];
};

function getFormValue(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function getOptionalFormValue(formData: FormData, name: string) {
  const value = getFormValue(formData, name);

  return value.length > 0 ? value : undefined;
}

function getNumberValue(formData: FormData, name: string) {
  const value = getFormValue(formData, name);

  if (!value) return undefined;

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}

function getBooleanValue(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

function getKeywords(value?: string) {
  if (!value) return undefined;

  const keywords = value
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);

  return keywords.length > 0 ? keywords : undefined;
}

function buildCreateProductPayload(
  formData: FormData,
): CreateAdminProductInput {
  const imageUrl = getOptionalFormValue(formData, "imageUrl");
  const imageAlt = getOptionalFormValue(formData, "imageAlt");
  const brandId = getOptionalFormValue(formData, "brandId");

  return {
    name: getFormValue(formData, "name"),
    slug: getOptionalFormValue(formData, "slug"),
    shortDescription: getOptionalFormValue(formData, "shortDescription"),
    description: getOptionalFormValue(formData, "description"),
    sku: getOptionalFormValue(formData, "sku"),
    price: getNumberValue(formData, "price") ?? 0,
    compareAtPrice: getNumberValue(formData, "compareAtPrice"),
    costPrice: getNumberValue(formData, "costPrice"),
    stock: getNumberValue(formData, "stock") ?? 0,
    trackInventory: getBooleanValue(formData, "trackInventory"),
    allowBackorder: getBooleanValue(formData, "allowBackorder"),
    hasVariants: false,
    status: getFormValue(formData, "status") as AdminProductStatus,
    isFeatured: getBooleanValue(formData, "isFeatured"),
    categoryId: getFormValue(formData, "categoryId"),
    brandId,
    weight: getNumberValue(formData, "weight"),
    length: getNumberValue(formData, "length"),
    width: getNumberValue(formData, "width"),
    height: getNumberValue(formData, "height"),
    keywords: getKeywords(getOptionalFormValue(formData, "keywords")),
    metaTitle: getOptionalFormValue(formData, "metaTitle"),
    metaDescription: getOptionalFormValue(formData, "metaDescription"),
    images: imageUrl
      ? [
          {
            url: imageUrl,
            altText: imageAlt,
            position: 0,
            isDefault: true,
          },
        ]
      : undefined,
  };
}

export default function AdminProductCreateForm({
  categories,
  brands,
}: AdminProductCreateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdProduct, setCreatedProduct] =
    useState<CreatedAdminProduct | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setCreatedProduct(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      const payload = buildCreateProductPayload(formData);
      const result = await createAdminProduct(payload);

      setCreatedProduct(result);
      event.currentTarget.reset();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not create product.",
      );
    } finally {
      setIsSubmitting(false);
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {error ? (
        <div className="rounded-2xl bg-danger-soft px-4 py-3 text-sm text-danger">
          {error}
        </div>
      ) : null}

      {createdProduct ? (
        <div className="rounded-2xl bg-success-soft px-4 py-3 text-sm text-success">
          Product created successfully:{" "}
          <span className="font-medium">{createdProduct.name}</span>
          {createdProduct.status === "ACTIVE" ? (
            <>
              {" "}
              —{" "}
              <Link
                href={`/products/${createdProduct.slug}`}
                className="font-medium underline"
              >
                View product
              </Link>
            </>
          ) : null}
        </div>
      ) : null}

      <section className="rounded-[2rem] border border-border bg-card p-6 md:p-8">
        <p className="text-eyebrow text-muted-foreground">Basic information</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <ProductFieldLabel
              htmlFor="name"
              label="Product name"
              infoKey="name"
            />
            <input
              id="name"
              name="name"
              required
              minLength={2}
              placeholder="Wireless Headphones"
              className="mt-2 h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
            />
          </div>

          <div>
            <ProductFieldLabel htmlFor="slug" label="Slug" infoKey="slug" />
            <input
              id="slug"
              name="slug"
              placeholder="wireless-headphones"
              className="mt-2 h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Optional. Backend can generate it from name.
            </p>
          </div>

          <div>
            <ProductFieldLabel htmlFor="sku" label="SKU" infoKey="sku" />
            <input
              id="sku"
              name="sku"
              placeholder="WH-001"
              className="mt-2 h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
            />
          </div>

          <div>
            <ProductFieldLabel
              htmlFor="categoryId"
              label="Category"
              infoKey="categoryId"
            />
            <select
              id="categoryId"
              name="categoryId"
              required
              className="mt-2 h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <ProductFieldLabel
              htmlFor="brandId"
              label="Brand"
              infoKey="brandId"
            />
            <select
              id="brandId"
              name="brandId"
              className="mt-2 h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
            >
              <option value="">No brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <ProductFieldLabel
              htmlFor="shortDescription"
              label="Short description"
              infoKey="shortDescription"
            />
            <input
              id="shortDescription"
              name="shortDescription"
              placeholder="A short product summary for cards and detail pages"
              className="mt-2 h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
            />
          </div>

          <div className="md:col-span-2">
            <ProductFieldLabel
              htmlFor="description"
              label="Description"
              infoKey="description"
            />
            <textarea
              id="description"
              name="description"
              rows={5}
              placeholder="Full product description"
              className="mt-2 w-full rounded-3xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground"
            />
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-border bg-card p-6 md:p-8">
        <p className="text-eyebrow text-muted-foreground">Pricing & stock</p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div>
            <ProductFieldLabel htmlFor="price" label="Price" infoKey="price" />
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
              placeholder="49.99"
              className="mt-2 h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
            />
          </div>

          <div>
            <ProductFieldLabel
              htmlFor="compareAtPrice"
              label="Compare at price"
              infoKey="compareAtPrice"
            />
            <input
              id="compareAtPrice"
              name="compareAtPrice"
              type="number"
              min="0"
              step="0.01"
              placeholder="69.99"
              className="mt-2 h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
            />
          </div>

          <div>
            <ProductFieldLabel
              htmlFor="costPrice"
              label="Cost price"
              infoKey="costPrice"
            />
            <input
              id="costPrice"
              name="costPrice"
              type="number"
              min="0"
              step="0.01"
              placeholder="20"
              className="mt-2 h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
            />
          </div>

          <div>
            <ProductFieldLabel htmlFor="stock" label="Stock" infoKey="stock" />
            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              step="1"
              defaultValue="10"
              className="mt-2 h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
            />
          </div>

          <div>
            <ProductFieldLabel
              htmlFor="status"
              label="Status"
              infoKey="status"
            />
            <select
              id="status"
              name="status"
              defaultValue="ACTIVE"
              className="mt-2 h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
            >
              <option value="ACTIVE">Active</option>
              <option value="DRAFT">Draft</option>
            </select>
            <p className="mt-2 text-xs text-muted-foreground">
              Use Active if you want it visible in shop.
            </p>
          </div>

          <div className="flex items-end">
            <div className="flex h-11 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm">
              <input
                id="isFeatured"
                name="isFeatured"
                type="checkbox"
                className="size-4"
              />
              <label htmlFor="isFeatured">Featured</label>
              <FieldInfo
                title={productFieldHelp.isFeatured.title}
                description={productFieldHelp.isFeatured.description}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 md:col-span-3">
            <div className="flex h-11 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm">
              <input
                id="trackInventory"
                name="trackInventory"
                type="checkbox"
                defaultChecked
                className="size-4"
              />
              <label htmlFor="trackInventory">Track inventory</label>
              <FieldInfo
                title={productFieldHelp.trackInventory.title}
                description={productFieldHelp.trackInventory.description}
              />
            </div>

            <div className="flex h-11 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm">
              <input
                id="allowBackorder"
                name="allowBackorder"
                type="checkbox"
                className="size-4"
              />
              <label htmlFor="allowBackorder">Allow backorder</label>
              <FieldInfo
                title={productFieldHelp.allowBackorder.title}
                description={productFieldHelp.allowBackorder.description}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-border bg-card p-6 md:p-8">
        <p className="text-eyebrow text-muted-foreground">Media</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <ProductFieldLabel
              htmlFor="imageUrl"
              label="Image URL"
              infoKey="imageUrl"
            />
            <input
              id="imageUrl"
              name="imageUrl"
              type="url"
              required
              placeholder="https://example.com/product.jpg"
              className="mt-2 h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
            />
          </div>

          <div>
            <ProductFieldLabel
              htmlFor="imageAlt"
              label="Image alt text"
              infoKey="imageAlt"
            />
            <input
              id="imageAlt"
              name="imageAlt"
              placeholder="Wireless headphones product image"
              className="mt-2 h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
            />
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-border bg-card p-6 md:p-8">
        <p className="text-eyebrow text-muted-foreground">SEO & shipping</p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="md:col-span-3">
            <ProductFieldLabel
              htmlFor="keywords"
              label="Keywords"
              infoKey="keywords"
            />
            <input
              id="keywords"
              name="keywords"
              placeholder="audio, headphones, wireless"
              className="mt-2 h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Separate keywords with commas.
            </p>
          </div>

          <div className="md:col-span-3">
            <ProductFieldLabel
              htmlFor="metaTitle"
              label="Meta title"
              infoKey="metaTitle"
            />
            <input
              id="metaTitle"
              name="metaTitle"
              className="mt-2 h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
            />
          </div>

          <div className="md:col-span-3">
            <ProductFieldLabel
              htmlFor="metaDescription"
              label="Meta description"
              infoKey="metaDescription"
            />
            <textarea
              id="metaDescription"
              name="metaDescription"
              rows={3}
              className="mt-2 w-full rounded-3xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground"
            />
          </div>

          <div>
            <ProductFieldLabel
              htmlFor="weight"
              label="Weight"
              infoKey="weight"
            />
            <input
              id="weight"
              name="weight"
              type="number"
              min="0"
              step="0.01"
              className="mt-2 h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
            />
          </div>

          <div>
            <ProductFieldLabel
              htmlFor="length"
              label="Length"
              infoKey="length"
            />
            <input
              id="length"
              name="length"
              type="number"
              min="0"
              step="0.01"
              className="mt-2 h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
            />
          </div>

          <div>
            <ProductFieldLabel htmlFor="width" label="Width" infoKey="width" />
            <input
              id="width"
              name="width"
              type="number"
              min="0"
              step="0.01"
              className="mt-2 h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
            />
          </div>

          <div>
            <ProductFieldLabel
              htmlFor="height"
              label="Height"
              infoKey="height"
            />
            <input
              id="height"
              name="height"
              type="number"
              min="0"
              step="0.01"
              className="mt-2 h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
            />
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/admin">Cancel</Link>
        </Button>

        <Button type="submit" disabled={isSubmitting} className="rounded-full">
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create product"
          )}
        </Button>
      </div>
    </form>
  );
}
