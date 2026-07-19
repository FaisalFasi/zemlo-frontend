"use client";

import Link from "next/link";
import { Archive, ExternalLink, PackagePlus, Pencil } from "lucide-react";
import { Button } from "@/shared/ui/button";

import AdminProductStatusBadge from "./AdminProductStatusBadge";
import type { AdminProductListItem } from "../types/admin-product.types";
import { formatDefaultMoney } from "@/shared/lib/formatters";

type AdminProductsTableProps = {
  products: AdminProductListItem[];
  pendingProductId: string;
  onArchiveProduct: (productId: string) => void;
};

// formatDefaultMoney already coerces invalid values to 0 (→ €0.00).
const formatPrice = formatDefaultMoney;

export default function AdminProductsTable({
  products,
  pendingProductId,
  onArchiveProduct,
}: AdminProductsTableProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-border bg-card p-10 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <PackagePlus className="size-6" />
        </div>

        <h2 className="mt-5 text-2xl font-medium tracking-tight text-foreground">
          No products yet.
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
          Create your first active product, then it will appear on shop, product
          detail, and cart flow.
        </p>

        <Button asChild className="mt-6 rounded-full">
          <Link href="/admin/products/new">Create product</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[2rem] border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-border bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-5 py-4 font-medium">Product</th>
              <th className="px-5 py-4 font-medium">Category</th>
              <th className="px-5 py-4 font-medium">Price</th>
              <th className="px-5 py-4 font-medium">Stock</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {products.map((product) => (
              <tr key={product.id} className="align-middle">
                <td className="px-5 py-4">
                  <div>
                    <p className="font-medium text-foreground">
                      {product.name}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {product.brand?.name ?? "No brand"} ·{" "}
                      {product.sku ?? "No SKU"}
                    </p>
                  </div>
                </td>

                <td className="px-5 py-4 text-muted-foreground">
                  {product.category.name}
                </td>

                <td className="px-5 py-4 font-medium text-foreground">
                  {formatPrice(product.price)}
                </td>

                <td className="px-5 py-4 text-muted-foreground">
                  {product.stock}
                </td>

                <td className="px-5 py-4">
                  <AdminProductStatusBadge status={product.status} />
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                    >
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Pencil className="size-4" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                    >
                      <Link href={`/products/${product.slug}`}>
                        <ExternalLink className="size-4" />
                        View
                      </Link>
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={pendingProductId === product.id}
                      onClick={() => onArchiveProduct(product.id)}
                      className="rounded-full"
                    >
                      <Archive className="size-4" />
                      {pendingProductId === product.id
                        ? "Archiving..."
                        : "Archive"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
