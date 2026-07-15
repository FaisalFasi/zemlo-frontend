"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";

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
  CartItem,
  UpdateCartItemInput,
} from "../types/cart.types";

export function useCartQuery() {
  return useQuery(cartQueryOptions.current());
}

export function useCartBadgeQuantity() {
  const cartQuery = useQuery({
    ...cartQueryOptions.current(),
    enabled: false,
  });

  return {
    totalQuantity: cartQuery.data?.totalQuantity ?? 0,
  };
}

// --- Optimistic update helpers -------------------------------------------
// The UI updates instantly from the cached cart; the server response (or a
// rollback on error) is the source of truth afterwards.

function recalculateCart(cart: Cart, items: CartItem[]): Cart {
  return {
    ...cart,
    items,
    totalItems: items.length,
    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.lineTotal, 0),
  };
}

type OptimisticContext = {
  previousCart: Cart | undefined;
};

async function applyOptimisticCart(
  queryClient: QueryClient,
  updateItems: (items: CartItem[]) => CartItem[],
): Promise<OptimisticContext> {
  // Stop in-flight refetches from overwriting our optimistic state.
  await queryClient.cancelQueries({ queryKey: cartQueryKeys.current() });

  const previousCart = queryClient.getQueryData<Cart>(cartQueryKeys.current());

  if (previousCart) {
    queryClient.setQueryData(
      cartQueryKeys.current(),
      recalculateCart(previousCart, updateItems(previousCart.items)),
    );
  }

  return { previousCart };
}

function rollbackCart(queryClient: QueryClient, context?: OptimisticContext) {
  if (context?.previousCart) {
    queryClient.setQueryData(cartQueryKeys.current(), context.previousCart);
  }
}

// --------------------------------------------------------------------------

export function useAddCartItemMutation() {
  const queryClient = useQueryClient();

  // No optimistic update here: building a full cart line requires product
  // data (name, price, image) the client may not have yet.
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
    onMutate: ({ itemId, input }) =>
      applyOptimisticCart(queryClient, (items) =>
        items.map((item) =>
          item.id === itemId
            ? {
                ...item,
                quantity: input.quantity,
                lineTotal: item.unitPrice * input.quantity,
              }
            : item,
        ),
      ),
    onError: (_error, _variables, context) =>
      rollbackCart(queryClient, context),
    onSuccess: (cart) => {
      queryClient.setQueryData(cartQueryKeys.current(), cart);
    },
  });
}

export function useRemoveCartItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => removeCartItem(itemId),
    onMutate: (itemId) =>
      applyOptimisticCart(queryClient, (items) =>
        items.filter((item) => item.id !== itemId),
      ),
    onError: (_error, _variables, context) =>
      rollbackCart(queryClient, context),
    onSuccess: (cart) => {
      queryClient.setQueryData(cartQueryKeys.current(), cart);
    },
  });
}

export function useClearCartMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCart,
    onMutate: () => applyOptimisticCart(queryClient, () => []),
    onError: (_error, _variables, context) =>
      rollbackCart(queryClient, context),
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
