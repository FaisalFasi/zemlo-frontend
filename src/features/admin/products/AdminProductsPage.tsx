"use client";

import Link from "next/link";
import { PackagePlus, RefreshCw } from "lucide-react";

import AdminProductsTable from "./components/AdminProductsTable";
import {
  useAdminProductsQuery,
  useArchiveAdminProductMutation,
} from "./hooks/use-admin-products";
import { useAdminPermission } from "@/features/admin/auth/hooks/use-admin-auth";
import AdminEntityLoadError from "@/features/admin/components/AdminEntityLoadError";
import { Button } from "@/shared/ui/button";

export default function AdminProductsPage() {
  const productsQuery = useAdminProductsQuery();
  const archiveProductMutation = useArchiveAdminProductMutation();
  const canCreate = useAdminPermission("products.create");

  const products = productsQuery.data ?? [];
  const error =
    productsQuery.error instanceof Error
      ? productsQuery.error.message
      : archiveProductMutation.error instanceof Error
        ? archiveProductMutation.error.message
        : "";

  async function handleArchiveProduct(productId: string) {
    const confirmed = window.confirm(
      "Archive this product? It will be hidden from the public store.",
    );

    if (!confirmed) return;

    try {
      await archiveProductMutation.mutateAsync(productId);
    } catch {
      // Swallow — the error is already tracked on `archiveProductMutation`
      // and rendered below. Without this catch, an archive failure is an
      // unhandled promise rejection (Next.js dev overlay treats that as a
      // full-page crash, even though the UI itself is fine).
    }
  }

  return (
    <section>
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-eyebrow text-muted-foreground">Products</p>

          <h1 className="mt-3 text-section-title">Manage products</h1>

          <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
            View catalog products, open public product pages, and archive items
            that should no longer appear in the store.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => void productsQuery.refetch()}
            className="rounded-full"
          >
            <RefreshCw className="size-4" />
            Refresh
          </Button>

          {canCreate ? (
            <Button asChild className="rounded-full">
              <Link href="/admin/products/new">
                <PackagePlus className="size-4" />
                Add product
              </Link>
            </Button>
          ) : null}
        </div>
      </div>

      {error ? (
        <div className="mb-5 rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {productsQuery.isLoading ? (
        <div className="rounded-[2rem] border border-border bg-card p-10 text-center text-muted-foreground">
          Loading products...
        </div>
      ) : productsQuery.isError ? (
        <div className="rounded-[2rem] border border-border bg-card p-10 text-center">
          <AdminEntityLoadError
            message="Could not load products."
            onRetry={() => productsQuery.refetch()}
          />
        </div>
      ) : (
        <AdminProductsTable
          products={products}
          pendingProductId={
            archiveProductMutation.isPending
              ? String(archiveProductMutation.variables ?? "")
              : ""
          }
          onArchiveProduct={(productId) => {
            void handleArchiveProduct(productId);
          }}
        />
      )}
    </section>
  );
}
