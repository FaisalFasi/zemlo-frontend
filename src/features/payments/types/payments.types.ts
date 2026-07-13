import type {
  CreateStripePaymentIntentDto,
  StripePaymentIntentResponseDto,
} from "@/shared/api/generated/schemas";

export type CreateStripePaymentIntentInput = CreateStripePaymentIntentDto;

export type StripePaymentIntentResult = StripePaymentIntentResponseDto;
