/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: Variants ke React hooks — list query + create/update/
 * delete mutations.
 * REASON: Cache ka intezam ek jagah: kisi bhi mutation ke baad
 *  (1) variants list refetch hoti hai, aur
 *  (2) product ka apna cache bhi invalidate hota hai — kyunke backend
 *      variant add/delete par product.hasVariants recalculate karta
 *      hai; UI ko taza product chahiye.
 * RISK: Zero — nayi file.
 * ═════════════════════════════════════════════════════════════════
 */
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryDurations } from "@/shared/config";

import {
  createAdminVariant,
  deleteAdminVariant,
  getAdminVariants,
  updateAdminVariant,
} from "../api/admin-variants-api";
import { adminProductQueryKeys } from "../queries/admin-products-query-options";
import type {
  CreateVariantInput,
  UpdateVariantInput,
} from "../types/admin-variant.types";

export const adminVariantQueryKeys = {
  list: (productId: string) =>
    ["admin-products", "variants", productId] as const,
};

export function useAdminVariantsQuery(productId: string) {
  return useQuery({
    queryKey: adminVariantQueryKeys.list(productId),
    queryFn: () => getAdminVariants(productId),
    enabled: Boolean(productId),
    staleTime: queryDurations.short,
    gcTime: queryDurations.medium,
  });
}

function useVariantCacheSync(productId: string) {
  const queryClient = useQueryClient();

  return () => {
    void queryClient.invalidateQueries({
      queryKey: adminVariantQueryKeys.list(productId),
    });
    // Backend recalculates product.hasVariants on variant changes.
    void queryClient.invalidateQueries({
      queryKey: adminProductQueryKeys.detail(productId),
    });
    void queryClient.invalidateQueries({
      queryKey: adminProductQueryKeys.lists(),
    });
  };
}

export function useCreateVariantMutation(productId: string) {
  const syncCaches = useVariantCacheSync(productId);

  return useMutation({
    mutationFn: (input: CreateVariantInput) =>
      createAdminVariant(productId, input),
    onSuccess: syncCaches,
  });
}

export function useUpdateVariantMutation(productId: string) {
  const syncCaches = useVariantCacheSync(productId);

  return useMutation({
    mutationFn: ({
      variantId,
      input,
    }: {
      variantId: string;
      input: UpdateVariantInput;
    }) => updateAdminVariant(productId, variantId, input),
    onSuccess: syncCaches,
  });
}

export function useDeleteVariantMutation(productId: string) {
  const syncCaches = useVariantCacheSync(productId);

  return useMutation({
    mutationFn: (variantId: string) =>
      deleteAdminVariant(productId, variantId),
    onSuccess: syncCaches,
  });
}
