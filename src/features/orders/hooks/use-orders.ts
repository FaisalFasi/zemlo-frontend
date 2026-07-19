/**
 * React hooks for customer orders — the interface components use,
 * mirroring use-cart.ts. Auth comes from the session cookie via the proxy.
 */
"use client";

import { useQuery } from "@tanstack/react-query";

import { orderQueryOptions } from "../queries/order-query-options";

export function useMyOrdersQuery() {
  return useQuery(orderQueryOptions.myOrders());
}

export function useMyOrderQuery(orderNumber: string) {
  return useQuery({
    ...orderQueryOptions.myOrder(orderNumber),
    // Don't fire until the order number from the URL is actually available.
    enabled: Boolean(orderNumber),
  });
}
