"use client";

import { adminApiRequest } from "@/features/admin/lib/admin-api-request";

import type {
  AdminProductDetail,
  AdminProductListItem,
  ArchiveAdminProductResponse,
  CreatedAdminProduct,
  CreateAdminProductInput,
  UpdateAdminProductInput,
} from "../types/admin-product.types";

export function getAdminProducts() {
  return adminApiRequest<AdminProductListItem[]>("/api/admin/products");
}

export function getAdminProductById(productId: string) {
  return adminApiRequest<AdminProductDetail>(
    `/api/admin/products/${productId}`,
  );
}

export function createAdminProduct(input: CreateAdminProductInput) {
  return adminApiRequest<CreatedAdminProduct>("/api/admin/products", {
    method: "POST",
    body: input,
  });
}

export function updateAdminProduct(
  productId: string,
  input: UpdateAdminProductInput,
) {
  return adminApiRequest<AdminProductDetail>(
    `/api/admin/products/${productId}`,
    {
      method: "PATCH",
      body: input,
    },
  );
}

export function archiveAdminProduct(productId: string) {
  return adminApiRequest<ArchiveAdminProductResponse>(
    `/api/admin/products/${productId}`,
    {
      method: "DELETE",
    },
  );
}
