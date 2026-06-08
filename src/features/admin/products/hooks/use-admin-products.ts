"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  archiveAdminProduct,
  createAdminProduct,
  updateAdminProduct,
} from "../api/admin-products-api";
import type {
  CreateAdminProductInput,
  UpdateAdminProductInput,
} from "../types/admin-product.types";
import {
  adminProductQueryKeys,
  adminProductQueryOptions,
} from "../queries/admin-products-query-options";

export function useAdminProductsQuery() {
  return useQuery(adminProductQueryOptions.list());
}

export function useAdminProductDetailQuery(productId: string) {
  return useQuery(adminProductQueryOptions.detail(productId));
}

export function useCreateAdminProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAdminProductInput) => createAdminProduct(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: adminProductQueryKeys.lists(),
      });
    },
  });
}

export function useUpdateAdminProductMutation(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateAdminProductInput) =>
      updateAdminProduct(productId, input),
    onSuccess: (product) => {
      queryClient.setQueryData(
        adminProductQueryKeys.detail(productId),
        product,
      );

      void queryClient.invalidateQueries({
        queryKey: adminProductQueryKeys.lists(),
      });
    },
  });
}

export function useArchiveAdminProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => archiveAdminProduct(productId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: adminProductQueryKeys.lists(),
      });
    },
  });
}
