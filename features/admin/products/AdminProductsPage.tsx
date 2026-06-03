"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PackagePlus, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  archiveAdminProduct,
  getAdminProducts,
} from "./api/admin-products-api";
import AdminProductsTable from "./components/AdminProductsTable";
import type { AdminProductListItem } from "./types/admin-product.types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProductListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingProductId, setPendingProductId] = useState("");
  const [error, setError] = useState("");

  async function loadProducts() {
    try {
      setError("");
      setIsLoading(true);

      const result = await getAdminProducts();

      setProducts(result);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load products.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleArchiveProduct(productId: string) {
    const confirmed = window.confirm(
      "Archive this product? It will be hidden from the public store.",
    );

    if (!confirmed) return;

    try {
      setError("");
      setPendingProductId(productId);

      await archiveAdminProduct(productId);
      await loadProducts();
    } catch (archiveError) {
      setError(
        archiveError instanceof Error
          ? archiveError.message
          : "Could not archive product.",
      );
    } finally {
      setPendingProductId("");
    }
  }

  useEffect(() => {
    void loadProducts();
  }, []);

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
            onClick={() => void loadProducts()}
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
        <div className="mb-5 rounded-2xl bg-danger-soft px-4 py-3 text-sm text-danger">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-[2rem] border border-border bg-card p-10 text-center text-muted-foreground">
          Loading products...
        </div>
      ) : (
        <AdminProductsTable
          products={products}
          pendingProductId={pendingProductId}
          onArchiveProduct={handleArchiveProduct}
        />
      )}
    </section>
  );
}
