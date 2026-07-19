/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: Variants ke 4 API functions — list, create, update,
 * delete — jo /api/admin/products/:id/variants proxy routes ko
 * adminApiRequest (error handling + 401 redirect) se call karte hain.
 * REASON: Components seedha fetch nahi likhte — wohi layered pattern
 * jo admin products/orders mein hai.
 * RISK: Zero — nayi file.
 * ═════════════════════════════════════════════════════════════════
 */
import { adminApiRequest } from "@/features/admin/lib/admin-api-request";

import type {
  AdminVariant,
  CreateVariantInput,
  UpdateVariantInput,
} from "../types/admin-variant.types";

function variantsBasePath(productId: string) {
  return `/api/admin/products/${encodeURIComponent(productId)}/variants`;
}

export async function getAdminVariants(productId: string) {
  return adminApiRequest<AdminVariant[]>(variantsBasePath(productId));
}

export async function createAdminVariant(
  productId: string,
  input: CreateVariantInput,
) {
  return adminApiRequest<AdminVariant>(variantsBasePath(productId), {
    method: "POST",
    body: input,
  });
}

export async function updateAdminVariant(
  productId: string,
  variantId: string,
  input: UpdateVariantInput,
) {
  return adminApiRequest<AdminVariant>(
    `${variantsBasePath(productId)}/${encodeURIComponent(variantId)}`,
    { method: "PATCH", body: input },
  );
}

export async function deleteAdminVariant(productId: string, variantId: string) {
  return adminApiRequest<void>(
    `${variantsBasePath(productId)}/${encodeURIComponent(variantId)}`,
    { method: "DELETE" },
  );
}
