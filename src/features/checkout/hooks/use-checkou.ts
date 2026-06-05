"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { cartQueryKeys } from "@/features/cart/queries/cart-query-options";

import { checkoutFromCart } from "../api/checkout.api";
import type { CheckoutFromCartInput } from "../types/checkout.types";

export function useCheckoutFromCartMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CheckoutFromCartInput) => checkoutFromCart(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: cartQueryKeys.current(),
      });
    },
  });
}
