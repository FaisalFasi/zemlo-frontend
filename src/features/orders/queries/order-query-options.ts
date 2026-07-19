/**
 * Query keys + options for customer orders (TanStack Query).
 *
 * Centralizing keys prevents cache-invalidation typos; mirrors
 * cart-query-options.ts. staleTime keeps order lists snappy on
 * back-navigation without refetching on every mount.
 */
import { queryOptions } from "@tanstack/react-query";

import { queryDurations } from "@/shared/config";

import { getMyOrderByNumber, getMyOrders } from "../api/orders-api";

export const orderQueryKeys = {
  all: ["orders"] as const,
  myOrders: () => [...orderQueryKeys.all, "my-orders"] as const,
  myOrder: (orderNumber: string) =>
    [...orderQueryKeys.myOrders(), orderNumber] as const,
};

export const orderQueryOptions = {
  myOrders: () =>
    queryOptions({
      queryKey: orderQueryKeys.myOrders(),
      queryFn: getMyOrders,
      staleTime: queryDurations.short,
      gcTime: queryDurations.medium,
    }),

  myOrder: (orderNumber: string) =>
    queryOptions({
      queryKey: orderQueryKeys.myOrder(orderNumber),
      queryFn: () => getMyOrderByNumber(orderNumber),
      staleTime: queryDurations.short,
      gcTime: queryDurations.medium,
    }),
};
