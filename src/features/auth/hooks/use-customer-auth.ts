"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { cartQueryKeys } from "@/features/cart/queries/cart-query-options";
import { queryDurations } from "@/shared/config";

import {
  getCurrentCustomer,
  loginCustomer,
  logoutCustomer,
  registerCustomer,
  requestPasswordReset,
  resetPassword,
  type CustomerUser,
} from "../api/customer-auth-api";
import { mergeGuestCartIntoUser } from "../lib/merge-guest-cart";
import type {
  LoginFormValues,
  RegisterFormValues,
} from "../schemas/auth.schemas";

export const customerAuthQueryKeys = {
  all: ["customer-auth"] as const,
  currentUser: () => [...customerAuthQueryKeys.all, "current-user"] as const,
};

export function useCurrentCustomerQuery() {
  return useQuery({
    queryKey: customerAuthQueryKeys.currentUser(),
    queryFn: getCurrentCustomer,
    staleTime: queryDurations.medium,
    gcTime: queryDurations.long,
    retry: false,
  });
}

function useSignInFlow<TInput>(
  signIn: (input: TInput) => Promise<{ user: CustomerUser }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: TInput) => {
      const result = await signIn(input);

      // Must run AFTER sign-in — the merge endpoint requires the session
      // that login/register just created.
      await mergeGuestCartIntoUser();

      return result;
    },
    onSuccess: (result) => {
      queryClient.setQueryData(
        customerAuthQueryKeys.currentUser(),
        result.user,
      );
      // Refetch as the user cart (now includes merged guest items).
      void queryClient.invalidateQueries({ queryKey: cartQueryKeys.all });
    },
  });
}

export function useLoginMutation() {
  return useSignInFlow((input: LoginFormValues) => loginCustomer(input));
}

export function useRegisterMutation() {
  return useSignInFlow((input: Omit<RegisterFormValues, "confirmPassword">) =>
    registerCustomer(input),
  );
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (email: string) => requestPasswordReset(email),
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: ({
      token,
      newPassword,
    }: {
      token: string;
      newPassword: string;
    }) => resetPassword(token, newPassword),
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutCustomer,
    onSettled: () => {
      queryClient.setQueryData(customerAuthQueryKeys.currentUser(), null);
      // Drop the user's cart from the cache; a guest starts fresh.
      queryClient.removeQueries({ queryKey: cartQueryKeys.all });
    },
  });
}
