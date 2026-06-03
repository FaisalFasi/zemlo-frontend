"use client";

import { adminApiRequest } from "@/features/admin/lib/admin-api-request";

import type {
  AdminProductListItem,
  ArchiveAdminProductResponse,
  CreatedAdminProduct,
  CreateAdminProductInput,
} from "../types/admin-product.types";

export function getAdminProducts() {
  return adminApiRequest<AdminProductListItem[]>("/api/admin/products");
}

export function createAdminProduct(input: CreateAdminProductInput) {
  return adminApiRequest<CreatedAdminProduct>("/api/admin/products", {
    method: "POST",
    body: input,
  });
}

export function archiveAdminProduct(productId: string) {
  return adminApiRequest<ArchiveAdminProductResponse>(
    `/api/admin/products/${productId}`,
    {
      method: "DELETE",
    },
  );
}
