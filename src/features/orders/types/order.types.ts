import type {
  OrderDetailResponseDto,
  OrderItemResponseDto,
  OrderSummaryResponseDto,
  OrderSummaryResponseDtoPaymentStatus,
  OrderSummaryResponseDtoStatus,
} from "@/shared/api/generated/schemas";

export type OrderSummary = OrderSummaryResponseDto;
export type OrderDetail = OrderDetailResponseDto;
export type OrderItem = OrderItemResponseDto;

export type OrderStatus = OrderSummaryResponseDtoStatus;
export type OrderPaymentStatus = OrderSummaryResponseDtoPaymentStatus;
