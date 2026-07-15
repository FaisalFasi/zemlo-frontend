/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAIN: Admin orders ke React hooks — 2 data-lane wale (list,
 * detail) aur 2 update wale (status, shipping).
 * REASON: Caching/refresh ek jagah. Update ke baad:
 *  - setQueryData(detail): backend jo updated order wapas deta hai wo
 *    seedha cache mein — UI foran naya status dikhaye, dobara fetch na ho
 *  - invalidateQueries(list): orders table bhi agli nazar mein taza ho
 * Ye admin products (use-admin-products.ts) ka hi pattern hai.
 * RISK: Zero — nayi file.
 * ═════════════════════════════════════════════════════════════════
 */
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryDurations } from "@/shared/config";

import {
  getAdminOrderById,
  getAdminOrders,
  updateAdminOrderShipping,
  updateAdminOrderStatus,
} from "../api/admin-orders-api";
import type {
  AdminOrderDetail,
  UpdateAdminOrderShippingInput,
  UpdateAdminOrderStatusInput,
} from "../types/admin-order.types";

export const adminOrderQueryKeys = {
  all: ["admin", "orders"] as const,
  list: () => [...adminOrderQueryKeys.all, "list"] as const,
  detail: (orderId: string) =>
    [...adminOrderQueryKeys.all, "detail", orderId] as const,
};

export function useAdminOrdersQuery() {
  return useQuery({
    queryKey: adminOrderQueryKeys.list(),
    queryFn: getAdminOrders,
    staleTime: queryDurations.short,
    gcTime: queryDurations.medium,
  });
}

export function useAdminOrderQuery(orderId: string) {
  return useQuery({
    queryKey: adminOrderQueryKeys.detail(orderId),
    queryFn: () => getAdminOrderById(orderId),
    enabled: Boolean(orderId),
    staleTime: queryDurations.short,
    gcTime: queryDurations.medium,
  });
}

function useOrderUpdateCacheSync(orderId: string) {
  const queryClient = useQueryClient();

  return (updatedOrder: AdminOrderDetail) => {
    queryClient.setQueryData(
      adminOrderQueryKeys.detail(orderId),
      updatedOrder,
    );
    void queryClient.invalidateQueries({
      queryKey: adminOrderQueryKeys.list(),
    });
  };
}

export function useUpdateOrderStatusMutation(orderId: string) {
  const syncCaches = useOrderUpdateCacheSync(orderId);

  return useMutation({
    mutationFn: (input: UpdateAdminOrderStatusInput) =>
      updateAdminOrderStatus(orderId, input),
    onSuccess: syncCaches,
  });
}

export function useUpdateOrderShippingMutation(orderId: string) {
  const syncCaches = useOrderUpdateCacheSync(orderId);

  return useMutation({
    mutationFn: (input: UpdateAdminOrderShippingInput) =>
      updateAdminOrderShipping(orderId, input),
    onSuccess: syncCaches,
  });
}
