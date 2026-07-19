/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: Product edit page ka variants section — list + add/edit
 * form + delete (confirm ke sath). Fields wohi jo backend ka
 * CreateProductVariantDto maangta hai (name*, sku*, price*, stock).
 * REASON: Ab tak admin variants bana hi nahi sakta tha — storefront
 * unhe dikhata tha lekin banane ka UI nahi tha (Phase 6 flagship).
 * hasVariants backend khud set karega (variant add → true).
 * RISK: Zero — naya component; delete se pehle confirm.
 * ═════════════════════════════════════════════════════════════════
 */
"use client";

import { useState } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";

import { formatDefaultMoney } from "@/shared/lib/formatters";
import { Button } from "@/shared/ui/button";

import {
  useAdminVariantsQuery,
  useCreateVariantMutation,
  useDeleteVariantMutation,
  useUpdateVariantMutation,
} from "../hooks/use-admin-variants";
import type { AdminVariant } from "../types/admin-variant.types";

const inputClassName =
  "h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-foreground";

type VariantFormValues = {
  name: string;
  sku: string;
  price: string;
  stock: string;
};

const emptyForm: VariantFormValues = { name: "", sku: "", price: "", stock: "" };

function variantToForm(variant: AdminVariant): VariantFormValues {
  return {
    name: variant.name,
    sku: variant.sku ?? "",
    price: variant.price !== null ? String(variant.price) : "",
    stock: String(variant.stock),
  };
}

type AdminVariantsManagerProps = {
  productId: string;
};

export default function AdminVariantsManager({
  productId,
}: AdminVariantsManagerProps) {
  const variantsQuery = useAdminVariantsQuery(productId);
  const createMutation = useCreateVariantMutation(productId);
  const updateMutation = useUpdateVariantMutation(productId);
  const deleteMutation = useDeleteVariantMutation(productId);

  // null = form band; "new" = add mode; variant id = edit mode
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<VariantFormValues>(emptyForm);
  const [formError, setFormError] = useState("");

  const isSaving = createMutation.isPending || updateMutation.isPending;

  function openAddForm() {
    setEditingId("new");
    setForm(emptyForm);
    setFormError("");
  }

  function openEditForm(variant: AdminVariant) {
    setEditingId(variant.id);
    setForm(variantToForm(variant));
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

    const price = Number(form.price);
    const stock = form.stock.trim() === "" ? 0 : Number(form.stock);

    if (!form.name.trim() || !form.sku.trim()) {
      setFormError("Name and SKU are required.");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      setFormError("Enter a valid price greater than 0.");
      return;
    }

    if (!Number.isFinite(stock) || stock < 0) {
      setFormError("Stock must be 0 or more.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      price,
      stock,
    };

    try {
      if (editingId === "new") {
        await createMutation.mutateAsync(payload);
      } else if (editingId) {
        await updateMutation.mutateAsync({
          variantId: editingId,
          input: payload,
        });
      }

      closeForm();
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Could not save variant.",
      );
    }
  }

  function handleDelete(variant: AdminVariant) {
    const confirmed = window.confirm(
      `Delete variant "${variant.name}"? This cannot be undone.`,
    );

    if (confirmed) {
      deleteMutation.mutate(variant.id);
    }
  }

  const variants = variantsQuery.data ?? [];

  return (
    <section className="mt-8 rounded-[2rem] border border-border bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium text-foreground">Variants</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Sizes, colors, or other options. The shop shows a variant picker
            once at least one exists.
          </p>
        </div>

        {editingId === null ? (
          <Button
            type="button"
            onClick={openAddForm}
            className="rounded-full"
          >
            <Plus className="size-4" />
            Add variant
          </Button>
        ) : null}
      </div>

      {variantsQuery.isLoading ? (
        <div className="mt-5 space-y-2">
          {Array.from({ length: 2 }, (_, index) => (
            <div
              key={index}
              className="h-12 animate-pulse rounded-xl border border-border bg-muted"
            />
          ))}
        </div>
      ) : null}

      {variantsQuery.isError ? (
        <p className="mt-5 text-sm text-muted-foreground">
          Could not load variants.{" "}
          <button
            type="button"
            onClick={() => variantsQuery.refetch()}
            className="font-medium text-foreground underline underline-offset-4"
          >
            Try again
          </button>
        </p>
      ) : null}

      {!variantsQuery.isLoading && !variantsQuery.isError ? (
        variants.length === 0 && editingId === null ? (
          <p className="mt-5 text-sm text-muted-foreground">
            No variants yet — this product is sold as a single item.
          </p>
        ) : (
          <ul className="mt-5 divide-y divide-border">
            {variants.map((variant) => (
              <li
                key={variant.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="font-medium text-foreground">
                    {variant.name}
                    {!variant.isActive ? (
                      <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        Inactive
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {variant.sku ?? "No SKU"} ·{" "}
                    {variant.price !== null
                      ? formatDefaultMoney(variant.price)
                      : "Base price"}{" "}
                    · Stock {variant.stock}
                  </p>
                </div>

                <div className="flex shrink-0 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => openEditForm(variant)}
                    className="rounded-full"
                  >
                    <Pencil className="size-3.5" />
                    Edit
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(variant)}
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
            {editingId === "new" ? "New variant" : "Edit variant"}
          </p>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="text-muted-foreground">Name *</span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Small / Red"
                className={`mt-1 ${inputClassName}`}
              />
            </label>

            <label className="block text-sm">
              <span className="text-muted-foreground">SKU *</span>
              <input
                type="text"
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                placeholder="e.g. MUG-RED-S"
                className={`mt-1 ${inputClassName}`}
              />
            </label>

            <label className="block text-sm">
              <span className="text-muted-foreground">Price (EUR) *</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className={`mt-1 ${inputClassName}`}
              />
            </label>

            <label className="block text-sm">
              <span className="text-muted-foreground">Stock</span>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="0"
                className={`mt-1 ${inputClassName}`}
              />
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
                "Add variant"
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
