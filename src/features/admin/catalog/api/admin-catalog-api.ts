/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: Categories + brands ke CRUD functions (4 + 4) jo proxy
 * routes ko adminApiRequest se call karte hain.
 * REASON: Components seedha fetch nahi likhte — error handling aur
 * session-expiry redirect adminApiRequest mein ek jagah hai.
 * RISK: Zero — nayi file.
 * ═════════════════════════════════════════════════════════════════
 */
import { adminApiRequest } from "@/features/admin/lib/admin-api-request";

import type {
  AdminBrand,
  AdminCategory,
  CreateBrandInput,
  CreateCategoryInput,
  UpdateBrandInput,
  UpdateCategoryInput,
} from "../types/admin-catalog.types";

// ── Categories ──────────────────────────────────────────────────────────────

export async function getAdminCategories() {
  return adminApiRequest<AdminCategory[]>("/api/admin/categories");
}

export async function createAdminCategory(input: CreateCategoryInput) {
  return adminApiRequest<AdminCategory>("/api/admin/categories", {
    method: "POST",
    body: input,
  });
}

export async function updateAdminCategory(
  categoryId: string,
  input: UpdateCategoryInput,
) {
  return adminApiRequest<AdminCategory>(
    `/api/admin/categories/${encodeURIComponent(categoryId)}`,
    { method: "PATCH", body: input },
  );
}

export async function deleteAdminCategory(categoryId: string) {
  return adminApiRequest<void>(
    `/api/admin/categories/${encodeURIComponent(categoryId)}`,
    { method: "DELETE" },
  );
}

// ── Brands ──────────────────────────────────────────────────────────────────

export async function getAdminBrands() {
  return adminApiRequest<AdminBrand[]>("/api/admin/brands");
}

export async function createAdminBrand(input: CreateBrandInput) {
  return adminApiRequest<AdminBrand>("/api/admin/brands", {
    method: "POST",
    body: input,
  });
}

export async function updateAdminBrand(
  brandId: string,
  input: UpdateBrandInput,
) {
  return adminApiRequest<AdminBrand>(
    `/api/admin/brands/${encodeURIComponent(brandId)}`,
    { method: "PATCH", body: input },
  );
}

export async function deleteAdminBrand(brandId: string) {
  return adminApiRequest<void>(
    `/api/admin/brands/${encodeURIComponent(brandId)}`,
    { method: "DELETE" },
  );
}
