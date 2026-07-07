import type {
  CheckoutAddressDto,
  CheckoutResponseDto,
  FromCartCheckoutDto,
} from "@/shared/api/generated/schemas";

import { FromCartCheckoutDtoPaymentMethod } from "@/shared/api/generated/schemas";

export type CheckoutAddress = CheckoutAddressDto;
export type CheckoutFromCartInput = FromCartCheckoutDto;
export type CheckoutFromCartResponse = CheckoutResponseDto;
export type CheckoutPaymentMethod = FromCartCheckoutDto["paymentMethod"];

export const checkoutPaymentMethods = FromCartCheckoutDtoPaymentMethod;
