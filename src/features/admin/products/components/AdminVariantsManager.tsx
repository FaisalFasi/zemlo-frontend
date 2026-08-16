/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: Product edit page ka variants section — list + add/edit
 * form + delete (confirm ke sath). Fields wohi jo backend ka
 * CreateProductVariantDto maangta hai (name*, sku*, price*, stock).
 * REASON: Ab tak admin variants bana hi nahi sakta tha — storefront
 * unhe dikhata tha lekin banane ka UI nahi tha (Phase 6 flagship).
 * hasVariants backend khud set karega (variant add → true). Loading/
 * error/form-state/save-cancel pieces shared components se aate hain
 * (`features/admin/components`, `features/admin/lib`) — same pattern
 * jo AdminCategoriesManager/AdminBrandsManager use karte hain.
 * RISK: Zero — delete se pehle confirm.
 * ═════════════════════════════════════════════════════════════════
 */
"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";

import { formatDefaultMoney } from "@/shared/lib/formatters";
import { Button } from "@/shared/ui/button";
import AdminEntityListSkeleton from "@/features/admin/components/AdminEntityListSkeleton";
import AdminEntityLoadError from "@/features/admin/components/AdminEntityLoadError";
import AdminFormActions from "@/features/admin/components/AdminFormActions";
import { useAdminEntityForm } from "@/features/admin/lib/use-admin-entity-form";
import { adminInputClassName } from "@/features/admin/lib/admin-form-styles";
import { useAdminPermission } from "@/features/admin/auth/hooks/use-admin-auth";

import {
  useAdminVariantsQuery,
  useCreateVariantMutation,
  useDeleteVariantMutation,
  useUpdateVariantMutation,
} from "../hooks/use-admin-variants";
import type { AdminVariant } from "../types/admin-variant.types";

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
  const canManage = useAdminPermission("products.update");

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
  } = useAdminEntityForm<VariantFormValues>(emptyForm);

  const isSaving = createMutation.isPending || updateMutation.isPending;
  // While ANY mutation for this manager is in flight, don't let the shared
  // add/edit form get repointed at a different row — the in-flight save's
  // eventual onSuccess/onError (closeForm/setFormError) would otherwise
  // land on whatever the form has been switched to by then.
  const isBusy = isSaving || deleteMutation.isPending;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const stock = form.stock.trim() === "" ? 0 : Number(form.stock);

    if (!form.name.trim() || !form.sku.trim()) {
      setFormError("Name and SKU are required.");
      return;
    }

    if (!Number.isFinite(stock) || !Number.isInteger(stock) || stock < 0) {
      setFormError("Stock must be a whole number, 0 or more.");
      return;
    }

    // On create the backend requires an explicit price. On edit, leaving
    // this field blank means "keep inheriting the base product's price" —
    // a variant can genuinely have no price override (`variant.price ===
    // null`), so blank must NOT be forced into an invalid "0" or an
    // artificial minimum; it just omits `price` from the payload entirely.
    let price: number | undefined;

    if (isNew || form.price.trim() !== "") {
      price = Number(form.price);

      if (!Number.isFinite(price) || price <= 0) {
        setFormError("Enter a valid price greater than 0.");
        return;
      }
    }

    try {
      if (isNew) {
        // The `isNew` branch above guarantees `price` is a valid number.
        await createMutation.mutateAsync({
          name: form.name.trim(),
          sku: form.sku.trim(),
          stock,
          price: price as number,
        });
      } else if (editingId) {
        await updateMutation.mutateAsync({
          variantId: editingId,
          input: {
            name: form.name.trim(),
            sku: form.sku.trim(),
            stock,
            ...(price !== undefined ? { price } : {}),
          },
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
  const deleteErrorMessage =
    deleteMutation.error instanceof Error
      ? deleteMutation.error.message
      : deleteMutation.isError
        ? "Could not delete variant."
        : "";

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

        {!isOpen && canManage ? (
          <Button
            type="button"
            onClick={openAddForm}
            disabled={isBusy}
            className="rounded-full"
          >
            <Plus className="size-4" />
            Add variant
          </Button>
        ) : null}
      </div>

      {variantsQuery.isLoading ? <AdminEntityListSkeleton rows={2} /> : null}

      {variantsQuery.isError ? (
        <AdminEntityLoadError
          message="Could not load variants."
          onRetry={() => variantsQuery.refetch()}
        />
      ) : null}

      {deleteErrorMessage ? (
        <p className="mt-3 text-sm text-danger">{deleteErrorMessage}</p>
      ) : null}

      {!variantsQuery.isLoading && !variantsQuery.isError ? (
        variants.length === 0 && !isOpen ? (
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

                {canManage ? (
                  <div className="flex shrink-0 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        openEditForm(variant.id, variantToForm(variant))
                      }
                      disabled={isBusy}
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
                      disabled={isBusy}
                      className="rounded-full text-danger"
                    >
                      <Trash2 className="size-3.5" />
                      Delete
                    </Button>
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
            {isNew ? "New variant" : "Edit variant"}
          </p>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="text-muted-foreground">Name *</span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Small / Red"
                className={`mt-1 ${adminInputClassName}`}
              />
            </label>

            <label className="block text-sm">
              <span className="text-muted-foreground">SKU *</span>
              <input
                type="text"
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                placeholder="e.g. MUG-RED-S"
                className={`mt-1 ${adminInputClassName}`}
              />
            </label>

            <label className="block text-sm">
              <span className="text-muted-foreground">
                {isNew
                  ? "Price (EUR) *"
                  : "Price (EUR) — blank inherits the base product price"}
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder={isNew ? undefined : "Inherit base price"}
                className={`mt-1 ${adminInputClassName}`}
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
                className={`mt-1 ${adminInputClassName}`}
              />
            </label>
          </div>

          {formError ? (
            <p className="mt-3 text-sm text-danger">{formError}</p>
          ) : null}

          <AdminFormActions
            isSaving={isSaving}
            savingLabel="Saving..."
            idleLabel={isNew ? "Add variant" : "Save changes"}
            onCancel={closeForm}
          />
        </form>
      ) : null}
    </section>
  );
}
