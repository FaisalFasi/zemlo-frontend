"use client";

import Link from "next/link";
import { PackagePlus, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

import AdminProductsTable from "./components/AdminProductsTable";
import {
  useAdminProductsQuery,
  useArchiveAdminProductMutation,
} from "./hooks/use-admin-products";

export default function AdminProductsPage() {
  const productsQuery = useAdminProductsQuery();
  const archiveProductMutation = useArchiveAdminProductMutation();

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

    await archiveProductMutation.mutateAsync(productId);
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

          <Button asChild className="rounded-full">
            <Link href="/admin/products/new">
              <PackagePlus className="size-4" />
              Add product
            </Link>
          </Button>
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
