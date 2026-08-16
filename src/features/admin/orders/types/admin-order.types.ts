/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: Admin orders ke data ki TypeScript "shapes" — backend ke
 * generated DTOs ko chhote, saaf naam de rahe hain (AdminOrderSummary
 * waghera) taake components lambi generated naam na likhen.
 * REASON: Yehi pattern customer orders (order.types.ts) aur admin
 * products mein hai. Generated code regenerate hota rehta hai — ye
 * aliases stable boundary hain.
 * RISK: Zero — sirf type aliases, koi runtime code nahi.
 * ═════════════════════════════════════════════════════════════════
 */
import type {
  AdminStatsResponseDto,
  OrderDetailResponseDto,
  OrderSummaryResponseDto,
  UpdateAdminOrderShippingDto,
  UpdateAdminOrderStatusDto,
} from "@/shared/api/generated/schemas";

export type AdminOrderSummary = OrderSummaryResponseDto;
export type AdminOrderDetail = OrderDetailResponseDto;

export type UpdateAdminOrderStatusInput = UpdateAdminOrderStatusDto;
export type UpdateAdminOrderShippingInput = UpdateAdminOrderShippingDto;

export type AdminStats = AdminStatsResponseDto;
