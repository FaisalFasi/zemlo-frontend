/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: Variant data ki TypeScript shapes — generated DTOs ke
 * chhote naam (wohi pattern jo admin-order.types.ts mein hai).
 * REASON: Components generated code directly import nahi karte —
 * regeneration-safe boundary.
 * RISK: Zero — sirf type aliases.
 * ═════════════════════════════════════════════════════════════════
 */
import type {
  AdminProductVariantResponseDto,
  CreateProductVariantDto,
  UpdateProductVariantDto,
} from "@/shared/api/generated/schemas";

export type AdminVariant = AdminProductVariantResponseDto;
export type CreateVariantInput = CreateProductVariantDto;
export type UpdateVariantInput = UpdateProductVariantDto;
