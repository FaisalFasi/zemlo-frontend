/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: Categories/brands ke data ki TypeScript shapes —
 * generated DTOs ke chhote naam (regeneration-safe boundary).
 * REASON: Wohi pattern jo variants/orders types ka hai.
 * RISK: Zero — sirf type aliases.
 * ═════════════════════════════════════════════════════════════════
 */
import type {
  AdminBrandResponseDto,
  AdminCategoryResponseDto,
  CreateAdminBrandDto,
  CreateAdminCategoryDto,
  UpdateAdminBrandDto,
  UpdateAdminCategoryDto,
} from "@/shared/api/generated/schemas";

export type AdminCategory = AdminCategoryResponseDto;
export type CreateCategoryInput = CreateAdminCategoryDto;
export type UpdateCategoryInput = UpdateAdminCategoryDto;

export type AdminBrand = AdminBrandResponseDto;
export type CreateBrandInput = CreateAdminBrandDto;
export type UpdateBrandInput = UpdateAdminBrandDto;
