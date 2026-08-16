/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: Categories ka poora admin CRUD screen — list + add/edit
 * form (name, slug, description, active) + delete (product-count
 * warning ke sath).
 * REASON: Ab tak categories sirf backend/DB se banti thin — admin ke
 * paas UI hi nahi tha (audit item, ROADMAP Phase 6). Slug khali chhoro
 * to backend khud name se bana leta hai (isliye optional field hai).
 * RISK: Zero — naya component. Delete se pehle confirm, aur agar
 * category kisi product par lagi hai to warning dikhti hai (backend
 * bhi aisi category delete se rok sakta hai — ye sirf UX heads-up hai).
 * ═════════════════════════════════════════════════════════════════
 */
"use client";

import { useState } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/shared/ui/button";

import {
  useAdminCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from "../hooks/use-admin-catalog";
import type { AdminCategory } from "../types/admin-catalog.types";

const inputClassName =
  "h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-foreground";

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

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryFormValues>(emptyForm);
  const [formError, setFormError] = useState("");

  const isSaving = createMutation.isPending || updateMutation.isPending;

  function openAddForm() {
    setEditingId("new");
    setForm(emptyForm);
    setFormError("");
  }

  function openEditForm(category: AdminCategory) {
    setEditingId(category.id);
    setForm(categoryToForm(category));
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
      isActive: form.isActive,
    };

    try {
      if (editingId === "new") {
        await createMutation.mutateAsync(payload);
      } else if (editingId) {
        await updateMutation.mutateAsync({ categoryId: editingId, input: payload });
      }

      closeForm();
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Could not save category.",
      );
    }
  }

  function handleDelete(category: AdminCategory) {
    const productCount = category.products.length;
    const productWarning =
      productCount > 0
        ? ` ${productCount} product${productCount === 1 ? "" : "s"} currently use this category.`
        : "";

    const confirmed = window.confirm(
      `Delete category "${category.name}"?${productWarning} This cannot be undone.`,
    );

    if (confirmed) {
      deleteMutation.mutate(category.id);
    }
  }

  const categories = categoriesQuery.data ?? [];

  return (
    <section className="rounded-[2rem] border border-border bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium text-foreground">Categories</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Organize products into browsable categories for the shop.
          </p>
        </div>

        {editingId === null ? (
          <Button type="button" onClick={openAddForm} className="rounded-full">
            <Plus className="size-4" />
            Add category
          </Button>
        ) : null}
      </div>

      {categoriesQuery.isLoading ? (
        <div className="mt-5 space-y-2">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="h-12 animate-pulse rounded-xl border border-border bg-muted"
            />
          ))}
        </div>
      ) : null}

      {categoriesQuery.isError ? (
        <p className="mt-5 text-sm text-muted-foreground">
          Could not load categories.{" "}
          <button
            type="button"
            onClick={() => categoriesQuery.refetch()}
            className="font-medium text-foreground underline underline-offset-4"
          >
            Try again
          </button>
        </p>
      ) : null}

      {!categoriesQuery.isLoading && !categoriesQuery.isError ? (
        categories.length === 0 && editingId === null ? (
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
                    /{category.slug} · {category.products.length}{" "}
                    {category.products.length === 1 ? "product" : "products"}
                  </p>
                </div>

                <div className="flex shrink-0 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => openEditForm(category)}
                    className="rounded-full"
                  >
                    <Pencil className="size-3.5" />
                    Edit
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(category)}
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
            {editingId === "new" ? "New category" : "Edit category"}
          </p>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="text-muted-foreground">Name *</span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Home Decor"
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
                placeholder="home-decor"
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
                "Add category"
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
