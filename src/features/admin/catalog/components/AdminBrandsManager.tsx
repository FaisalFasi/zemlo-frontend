/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: Brands ka poora admin CRUD screen — categories manager
 * jaisa hi structure, bas fields alag (website ka extra field).
 * REASON: Categories jaisi wajah — brands bhi ab tak sirf backend/DB
 * se bante thay.
 * RISK: Zero — naya component; delete se pehle confirm + product-count
 * warning.
 * ═════════════════════════════════════════════════════════════════
 */
"use client";

import { useState } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/shared/ui/button";

import {
  useAdminBrandsQuery,
  useCreateBrandMutation,
  useDeleteBrandMutation,
  useUpdateBrandMutation,
} from "../hooks/use-admin-catalog";
import type { AdminBrand } from "../types/admin-catalog.types";

const inputClassName =
  "h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-foreground";

type BrandFormValues = {
  name: string;
  slug: string;
  description: string;
  website: string;
  isActive: boolean;
};

const emptyForm: BrandFormValues = {
  name: "",
  slug: "",
  description: "",
  website: "",
  isActive: true,
};

function brandToForm(brand: AdminBrand): BrandFormValues {
  return {
    name: brand.name,
    slug: brand.slug,
    description: brand.description ?? "",
    website: brand.website ?? "",
    isActive: brand.isActive,
  };
}

export default function AdminBrandsManager() {
  const brandsQuery = useAdminBrandsQuery();
  const createMutation = useCreateBrandMutation();
  const updateMutation = useUpdateBrandMutation();
  const deleteMutation = useDeleteBrandMutation();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BrandFormValues>(emptyForm);
  const [formError, setFormError] = useState("");

  const isSaving = createMutation.isPending || updateMutation.isPending;

  function openAddForm() {
    setEditingId("new");
    setForm(emptyForm);
    setFormError("");
  }

  function openEditForm(brand: AdminBrand) {
    setEditingId(brand.id);
    setForm(brandToForm(brand));
    setFormError("");
  }

  function closeForm() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    if (!form.name.trim()) {
      setFormError("Name is required.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || undefined,
      description: form.description.trim() || undefined,
      website: form.website.trim() || undefined,
      isActive: form.isActive,
    };

    try {
      if (editingId === "new") {
        await createMutation.mutateAsync(payload);
      } else if (editingId) {
        await updateMutation.mutateAsync({ brandId: editingId, input: payload });
      }

      closeForm();
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Could not save brand.",
      );
    }
  }

  function handleDelete(brand: AdminBrand) {
    const productCount = brand.products.length;
    const productWarning =
      productCount > 0
        ? ` ${productCount} product${productCount === 1 ? "" : "s"} currently use this brand.`
        : "";

    const confirmed = window.confirm(
      `Delete brand "${brand.name}"?${productWarning} This cannot be undone.`,
    );

    if (confirmed) {
      deleteMutation.mutate(brand.id);
    }
  }

  const brands = brandsQuery.data ?? [];

  return (
    <section className="rounded-[2rem] border border-border bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium text-foreground">Brands</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Brands customers can filter and browse by.
          </p>
        </div>

        {editingId === null ? (
          <Button type="button" onClick={openAddForm} className="rounded-full">
            <Plus className="size-4" />
            Add brand
          </Button>
        ) : null}
      </div>

      {brandsQuery.isLoading ? (
        <div className="mt-5 space-y-2">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="h-12 animate-pulse rounded-xl border border-border bg-muted"
            />
          ))}
        </div>
      ) : null}

      {brandsQuery.isError ? (
        <p className="mt-5 text-sm text-muted-foreground">
          Could not load brands.{" "}
          <button
            type="button"
            onClick={() => brandsQuery.refetch()}
            className="font-medium text-foreground underline underline-offset-4"
          >
            Try again
          </button>
        </p>
      ) : null}

      {!brandsQuery.isLoading && !brandsQuery.isError ? (
        brands.length === 0 && editingId === null ? (
          <p className="mt-5 text-sm text-muted-foreground">No brands yet.</p>
        ) : (
          <ul className="mt-5 divide-y divide-border">
            {brands.map((brand) => (
              <li
                key={brand.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="font-medium text-foreground">
                    {brand.name}
                    {!brand.isActive ? (
                      <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        Inactive
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    /{brand.slug} · {brand.products.length}{" "}
                    {brand.products.length === 1 ? "product" : "products"}
                  </p>
                </div>

                <div className="flex shrink-0 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => openEditForm(brand)}
                    className="rounded-full"
                  >
                    <Pencil className="size-3.5" />
                    Edit
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(brand)}
                    disabled={deleteMutation.isPending}
                    className="rounded-full text-danger"
                  >
                    <Trash2 className="size-3.5" />
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )
      ) : null}

      {editingId !== null ? (
        <form
          onSubmit={handleSubmit}
          className="mt-5 rounded-2xl border border-border bg-background p-4"
        >
          <p className="text-sm font-medium text-foreground">
            {editingId === "new" ? "New brand" : "Edit brand"}
          </p>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="text-muted-foreground">Name *</span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Lumo"
                className={`mt-1 ${inputClassName}`}
              />
            </label>

            <label className="block text-sm">
              <span className="text-muted-foreground">
                Slug (optional — auto-generated if left blank)
              </span>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="lumo"
                className={`mt-1 ${inputClassName}`}
              />
            </label>

            <label className="block text-sm sm:col-span-2">
              <span className="text-muted-foreground">Website</span>
              <input
                type="url"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                placeholder="https://..."
                className={`mt-1 ${inputClassName}`}
              />
            </label>

            <label className="block text-sm sm:col-span-2">
              <span className="text-muted-foreground">Description</span>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={2}
                className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
              />
            </label>

            <label className="flex items-center gap-2 text-sm sm:col-span-2">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm({ ...form, isActive: e.target.checked })
                }
                className="size-4 rounded border-border"
              />
              <span className="text-muted-foreground">
                Active (visible on the shop)
              </span>
            </label>
          </div>

          {formError ? (
            <p className="mt-3 text-sm text-danger">{formError}</p>
          ) : null}

          <div className="mt-4 flex gap-2">
            <Button type="submit" disabled={isSaving} className="rounded-full">
              {isSaving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : editingId === "new" ? (
                "Add brand"
              ) : (
                "Save changes"
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={closeForm}
              className="rounded-full"
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : null}
    </section>
  );
}
