import { paymentsControllerCreateStripePaymentIntent } from "@/shared/api/generated/payments/payments";

import type {
  CreateStripePaymentIntentInput,
  StripePaymentIntentResult,
} from "../types/payments.types";

export async function createStripePaymentIntent(
  input: CreateStripePaymentIntentInput,
): Promise<StripePaymentIntentResult> {
  return paymentsControllerCreateStripePaymentIntent(
    input,
  ) as Promise<StripePaymentIntentResult>;
}
