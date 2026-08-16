/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: Brands ka poora admin CRUD screen — categories manager
 * jaisa hi structure (shared components/hooks se), bas fields alag
 * (website ka extra field).
 * REASON: Categories jaisi wajah — brands bhi ab tak sirf backend/DB
 * se bante thay.
 * RISK: Zero — delete se pehle confirm + product-count warning.
 * ═════════════════════════════════════════════════════════════════
 */
"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/shared/ui/button";
import AdminEntityListSkeleton from "@/features/admin/components/AdminEntityListSkeleton";
import AdminEntityLoadError from "@/features/admin/components/AdminEntityLoadError";
import AdminFormActions from "@/features/admin/components/AdminFormActions";
import { useAdminEntityForm } from "@/features/admin/lib/use-admin-entity-form";
import {
  adminInputClassName,
  adminTextareaClassName,
} from "@/features/admin/lib/admin-form-styles";
import { useAdminPermission } from "@/features/admin/auth/hooks/use-admin-auth";

import {
  useAdminBrandsQuery,
  useCreateBrandMutation,
  useDeleteBrandMutation,
  useUpdateBrandMutation,
} from "../hooks/use-admin-catalog";
import { buildCatalogDeleteConfirmMessage } from "../lib/catalog-confirm";
import type { AdminBrand } from "../types/admin-catalog.types";

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
  const canCreate = useAdminPermission("brands.create");
  const canUpdate = useAdminPermission("brands.update");
  const canDelete = useAdminPermission("brands.delete");

  const {
    editingId,
    isNew,
    isOpen,
    form,
    setForm,
    formError,
    setFormError,
    openAddForm,
    openEditForm,
    closeForm,
  } = useAdminEntityForm<BrandFormValues>(emptyForm);

  const isSaving = createMutation.isPending || updateMutation.isPending;
  // While ANY mutation for this manager is in flight, don't let the shared
  // add/edit form get repointed at a different row — the in-flight save's
  // eventual onSuccess/onError (closeForm/setFormError) would otherwise
  // land on whatever the form has been switched to by then.
  const isBusy = isSaving || deleteMutation.isPending;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    if (!form.name.trim()) {
      setFormError("Name is required.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      // Blank slug means "auto-generate from name" on both create and
      // edit, so this one stays `undefined` (omit the key) on purpose.
      slug: form.slug.trim() || undefined,
      // Description/website have no such auto-behavior — send the trimmed
      // value AS-IS (even "") so an admin can actually clear them.
      // Converting "" to `undefined` would drop the key from the PATCH
      // body entirely, silently keeping the old value on edit.
      description: form.description.trim(),
      website: form.website.trim(),
      isActive: form.isActive,
    };

    try {
      if (isNew) {
        await createMutation.mutateAsync(payload);
      } else if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, input: payload });
      }

      closeForm();
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Could not save brand.",
      );
    }
  }

  function handleDelete(brand: AdminBrand) {
    const confirmed = window.confirm(
      buildCatalogDeleteConfirmMessage(
        "brand",
        brand.name,
        brand.products?.length ?? 0,
      ),
    );

    if (confirmed) {
      deleteMutation.mutate(brand.id);
    }
  }

  const brands = brandsQuery.data ?? [];
  const deleteErrorMessage =
    deleteMutation.error instanceof Error
      ? deleteMutation.error.message
      : deleteMutation.isError
        ? "Could not delete brand."
        : "";

  return (
    <section className="rounded-[2rem] border border-border bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium text-foreground">Brands</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Brands customers can filter and browse by.
          </p>
        </div>

        {!isOpen && canCreate ? (
          <Button
            type="button"
            onClick={openAddForm}
            disabled={isBusy}
            className="rounded-full"
          >
            <Plus className="size-4" />
            Add brand
          </Button>
        ) : null}
      </div>

      {brandsQuery.isLoading ? <AdminEntityListSkeleton /> : null}

      {brandsQuery.isError ? (
        <AdminEntityLoadError
          message="Could not load brands."
          onRetry={() => brandsQuery.refetch()}
        />
      ) : null}

      {deleteErrorMessage ? (
        <p className="mt-3 text-sm text-danger">{deleteErrorMessage}</p>
      ) : null}

      {!brandsQuery.isLoading && !brandsQuery.isError ? (
        brands.length === 0 && !isOpen ? (
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
                    /{brand.slug} · {brand.products?.length ?? 0}{" "}
                    {(brand.products?.length ?? 0) === 1
                      ? "product"
                      : "products"}
                  </p>
                </div>

                {canUpdate || canDelete ? (
                  <div className="flex shrink-0 gap-2">
                    {canUpdate ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openEditForm(brand.id, brandToForm(brand))}
                        disabled={isBusy}
                        className="rounded-full"
                      >
                        <Pencil className="size-3.5" />
                        Edit
                      </Button>
                    ) : null}

                    {canDelete ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(brand)}
                        disabled={isBusy}
                        className="rounded-full text-danger"
                      >
                        <Trash2 className="size-3.5" />
                        Delete
                      </Button>
                    ) : null}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )
      ) : null}

      {isOpen ? (
        <form
          onSubmit={handleSubmit}
          className="mt-5 rounded-2xl border border-border bg-background p-4"
        >
          <p className="text-sm font-medium text-foreground">
            {isNew ? "New brand" : "Edit brand"}
          </p>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="text-muted-foreground">Name *</span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Lumo"
                className={`mt-1 ${adminInputClassName}`}
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
                className={`mt-1 ${adminInputClassName}`}
              />
            </label>

            <label className="block text-sm sm:col-span-2">
              <span className="text-muted-foreground">Website</span>
              <input
                type="url"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                placeholder="https://..."
                className={`mt-1 ${adminInputClassName}`}
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
                className={adminTextareaClassName}
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

          <AdminFormActions
            isSaving={isSaving}
            savingLabel="Saving..."
            idleLabel={isNew ? "Add brand" : "Save changes"}
            onCancel={closeForm}
          />
        </form>
      ) : null}
    </section>
  );
}
