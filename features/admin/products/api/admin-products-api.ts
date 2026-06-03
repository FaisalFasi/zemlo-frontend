"use client";

import { adminApiRequest } from "@/features/admin/lib/admin-api-request";

import type {
  CreatedAdminProduct,
  CreateAdminProductInput,
} from "../types/admin-product.types";

export function createAdminProduct(input: CreateAdminProductInput) {
  return adminApiRequest<CreatedAdminProduct>("/api/admin/products", {
    method: "POST",
    body: input,
  });
}
