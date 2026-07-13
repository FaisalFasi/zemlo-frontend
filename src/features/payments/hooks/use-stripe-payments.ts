"use client";

import { useMutation } from "@tanstack/react-query";

import { createStripePaymentIntent } from "../api/payments-api";
import type { CreateStripePaymentIntentInput } from "../types/payments.types";

export function useCreateStripePaymentIntentMutation() {
  return useMutation({
    mutationFn: (input: CreateStripePaymentIntentInput) =>
      createStripePaymentIntent(input),
  });
}
