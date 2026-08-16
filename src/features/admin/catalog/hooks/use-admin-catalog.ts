/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: Categories + brands ke React hooks — list queries aur
 * create/update/delete mutations, ek generic factory se banaye gaye
 * (dono resources ka shape — list/create/update/delete + invalidate —
 * bilkul same hai).
 * REASON: Pehle categories aur brands ke liye alag-alag hooks
 * copy-paste thay (~100 lines duplicate). Ek factory se dono banao —
 * naya catalog resource (e.g. tags) add karna ho to bhi wohi factory
 * reuse hogi.
 * RISK: Zero — sirf refactor, behavior same (mutation payload shape
 * `{categoryId, input}` → `{id, input}` ho gaya hai, dono managers
 * update kar diye hain).
 * ═════════════════════════════════════════════════════════════════
 */
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryDurations } from "@/shared/config";

import {
  createAdminBrand,
  createAdminCategory,
  deleteAdminBrand,
  deleteAdminCategory,
  getAdminBrands,
  getAdminCategories,
  updateAdminBrand,
  updateAdminCategory,
} from "../api/admin-catalog-api";
import type {
  AdminBrand,
  AdminCategory,
  CreateBrandInput,
  CreateCategoryInput,
  UpdateBrandInput,
  UpdateCategoryInput,
} from "../types/admin-catalog.types";

export const adminCatalogQueryKeys = {
  categories: ["admin-catalog", "categories"] as const,
  brands: ["admin-catalog", "brands"] as const,
};

function createAdminCatalogResourceHooks<TEntity, TCreateInput, TUpdateInput>(
  queryKey: readonly unknown[],
  api: {
    list: () => Promise<TEntity[]>;
    create: (input: TCreateInput) => Promise<TEntity>;
    update: (id: string, input: TUpdateInput) => Promise<TEntity>;
    remove: (id: string) => Promise<void>;
  },
) {
  function useResourceQuery() {
    return useQuery({
      queryKey,
      queryFn: api.list,
      staleTime: queryDurations.short,
      gcTime: queryDurations.medium,
    });
  }

  function useInvalidate() {
    const queryClient = useQueryClient();

    return () => void queryClient.invalidateQueries({ queryKey });
  }

  function useCreateMutation() {
    const invalidate = useInvalidate();

    return useMutation({
      mutationFn: (input: TCreateInput) => api.create(input),
      onSuccess: invalidate,
    });
  }

  function useUpdateMutation() {
    const invalidate = useInvalidate();

    return useMutation({
      mutationFn: ({ id, input }: { id: string; input: TUpdateInput }) =>
        api.update(id, input),
      onSuccess: invalidate,
    });
  }

  function useDeleteMutation() {
    const invalidate = useInvalidate();

    return useMutation({
      mutationFn: (id: string) => api.remove(id),
      onSuccess: invalidate,
    });
  }

  return {
    useResourceQuery,
    useCreateMutation,
    useUpdateMutation,
    useDeleteMutation,
  };
}

const categoryResource = createAdminCatalogResourceHooks<
  AdminCategory,
  CreateCategoryInput,
  UpdateCategoryInput
>(adminCatalogQueryKeys.categories, {
  list: getAdminCategories,
  create: createAdminCategory,
  update: updateAdminCategory,
  remove: deleteAdminCategory,
});

export const useAdminCategoriesQuery = categoryResource.useResourceQuery;
export const useCreateCategoryMutation = categoryResource.useCreateMutation;
export const useUpdateCategoryMutation = categoryResource.useUpdateMutation;
export const useDeleteCategoryMutation = categoryResource.useDeleteMutation;

const brandResource = createAdminCatalogResourceHooks<
  AdminBrand,
  CreateBrandInput,
  UpdateBrandInput
>(adminCatalogQueryKeys.brands, {
  list: getAdminBrands,
  create: createAdminBrand,
  update: updateAdminBrand,
  remove: deleteAdminBrand,
});

export const useAdminBrandsQuery = brandResource.useResourceQuery;
export const useCreateBrandMutation = brandResource.useCreateMutation;
export const useUpdateBrandMutation = brandResource.useUpdateMutation;
export const useDeleteBrandMutation = brandResource.useDeleteMutation;
