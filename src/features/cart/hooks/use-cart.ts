"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addCartItem,
  clearCart,
  removeCartItem,
  updateCartItem,
} from "../api/cart-api";
import { cartQueryKeys, cartQueryOptions } from "../queries/cart-query-options";
import type {
  AddCartItemInput,
  Cart,
  UpdateCartItemInput,
} from "../types/cart.types";

export function useCartQuery() {
  return useQuery(cartQueryOptions.current());
}

export function useCartBadgeQuantity() {
  const queryClient = useQueryClient();

  const cart = queryClient.getQueryData<Cart>(cartQueryKeys.current());

  return {
    totalQuantity: cart?.totalQuantity ?? 0,
  };
}

export function useAddCartItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AddCartItemInput) => addCartItem(input),
    onSuccess: (cart) => {
      queryClient.setQueryData(cartQueryKeys.current(), cart);
    },
  });
}

export function useUpdateCartItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      input,
    }: {
      itemId: string;
      input: UpdateCartItemInput;
    }) => updateCartItem(itemId, input),
    onSuccess: (cart) => {
      queryClient.setQueryData(cartQueryKeys.current(), cart);
    },
  });
}

export function useRemoveCartItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => removeCartItem(itemId),
    onSuccess: (cart) => {
      queryClient.setQueryData(cartQueryKeys.current(), cart);
    },
  });
}

export function useClearCartMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCart,
    onSuccess: (cart) => {
      queryClient.setQueryData(cartQueryKeys.current(), cart);
    },
  });
}

export function useCart() {
  const cartQuery = useCartQuery();
  const addItemMutation = useAddCartItemMutation();
  const updateItemMutation = useUpdateCartItemMutation();
  const removeItemMutation = useRemoveCartItemMutation();
  const clearCartMutation = useClearCartMutation();

  return {
    cart: cartQuery.data,
    cartItems: cartQuery.data?.items ?? [],
    totalItems: cartQuery.data?.totalItems ?? 0,
    totalQuantity: cartQuery.data?.totalQuantity ?? 0,
    subtotal: cartQuery.data?.subtotal ?? 0,

    isCartLoading: cartQuery.isLoading,
    isCartFetching: cartQuery.isFetching,
    cartError: cartQuery.error instanceof Error ? cartQuery.error.message : "",
    refetchCart: cartQuery.refetch,

    addItem: addItemMutation.mutate,
    addItemAsync: addItemMutation.mutateAsync,
    isAddingItem: addItemMutation.isPending,
    addItemError:
      addItemMutation.error instanceof Error
        ? addItemMutation.error.message
        : "",

    updateItemQuantity: updateItemMutation.mutate,
    updateItemQuantityAsync: updateItemMutation.mutateAsync,
    isUpdatingItem: updateItemMutation.isPending,

    removeItem: removeItemMutation.mutate,
    removeItemAsync: removeItemMutation.mutateAsync,
    isRemovingItem: removeItemMutation.isPending,

    clearCurrentCart: clearCartMutation.mutate,
    clearCurrentCartAsync: clearCartMutation.mutateAsync,
    isClearingCart: clearCartMutation.isPending,
  };
}
