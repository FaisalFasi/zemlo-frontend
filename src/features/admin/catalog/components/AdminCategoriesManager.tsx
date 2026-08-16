/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: Categories ka poora admin CRUD screen — list + add/edit
 * form (name, slug, description, active) + delete (product-count
 * warning ke sath).
 * REASON: Ab tak categories sirf backend/DB se banti thin — admin ke
 * paas UI hi nahi tha (audit item, ROADMAP Phase 6). Slug khali chhoro
 * to backend khud name se bana leta hai (isliye optional field hai).
 * Loading/error/form-state/save-cancel pieces ab shared components se
 * aate hain (`features/admin/components`, `features/admin/lib`) — same
 * pattern jo AdminBrandsManager aur AdminVariantsManager use karte hain.
 * RISK: Zero — delete se pehle confirm, aur agar category kisi product
 * par lagi hai to warning dikhti hai (backend bhi aisi category delete
 * se rok sakta hai — ye sirf UX heads-up hai).
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
  useAdminCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from "../hooks/use-admin-catalog";
import { buildCatalogDeleteConfirmMessage } from "../lib/catalog-confirm";
import type { AdminCategory } from "../types/admin-catalog.types";

type CategoryFormValues = {
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
};

const emptyForm: CategoryFormValues = {
  name: "",
  slug: "",
  description: "",
  isActive: true,
};

function categoryToForm(category: AdminCategory): CategoryFormValues {
  return {
    name: category.name,
    slug: category.slug,
    description: category.description ?? "",
    isActive: category.isActive,
  };
}

export default function AdminCategoriesManager() {
  const categoriesQuery = useAdminCategoriesQuery();
  const createMutation = useCreateCategoryMutation();
  const updateMutation = useUpdateCategoryMutation();
  const deleteMutation = useDeleteCategoryMutation();
  const canCreate = useAdminPermission("categories.create");
  const canUpdate = useAdminPermission("categories.update");
  const canDelete = useAdminPermission("categories.delete");

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
  } = useAdminEntityForm<CategoryFormValues>(emptyForm);

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
      // Description has no such auto-behavior — sending the trimmed value
      // AS-IS (even "") lets an admin actually clear it. Converting "" to
      // `undefined` here would drop the key from the PATCH body entirely,
      // so clearing the field on edit silently kept the old value.
      description: form.description.trim(),
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
        error instanceof Error ? error.message : "Could not save category.",
      );
    }
  }

  function handleDelete(category: AdminCategory) {
    const confirmed = window.confirm(
      buildCatalogDeleteConfirmMessage(
        "category",
        category.name,
        category.products?.length ?? 0,
      ),
    );

    if (confirmed) {
      deleteMutation.mutate(category.id);
    }
  }

  const categories = categoriesQuery.data ?? [];
  const deleteErrorMessage =
    deleteMutation.error instanceof Error
      ? deleteMutation.error.message
      : deleteMutation.isError
        ? "Could not delete category."
        : "";

  return (
    <section className="rounded-[2rem] border border-border bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium text-foreground">Categories</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Organize products into browsable categories for the shop.
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
            Add category
          </Button>
        ) : null}
      </div>

      {categoriesQuery.isLoading ? <AdminEntityListSkeleton /> : null}

      {categoriesQuery.isError ? (
        <AdminEntityLoadError
          message="Could not load categories."
          onRetry={() => categoriesQuery.refetch()}
        />
      ) : null}

      {deleteErrorMessage ? (
        <p className="mt-3 text-sm text-danger">{deleteErrorMessage}</p>
      ) : null}

      {!categoriesQuery.isLoading && !categoriesQuery.isError ? (
        categories.length === 0 && !isOpen ? (
          <p className="mt-5 text-sm text-muted-foreground">
            No categories yet.
          </p>
        ) : (
          <ul className="mt-5 divide-y divide-border">
            {categories.map((category) => (
              <li
                key={category.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="font-medium text-foreground">
                    {category.name}
                    {!category.isActive ? (
                      <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        Inactive
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    /{category.slug} · {category.products?.length ?? 0}{" "}
                    {(category.products?.length ?? 0) === 1
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
                        onClick={() =>
                          openEditForm(category.id, categoryToForm(category))
                        }
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
                        onClick={() => handleDelete(category)}
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
            {isNew ? "New category" : "Edit category"}
          </p>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="text-muted-foreground">Name *</span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Home Decor"
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
                placeholder="home-decor"
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
            idleLabel={isNew ? "Add category" : "Save changes"}
            onCancel={closeForm}
          />
        </form>
      ) : null}
    </section>
  );
}
