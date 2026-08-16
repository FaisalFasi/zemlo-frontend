/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: Categories + brands ke React hooks — list queries aur
 * create/update/delete mutations.
 * REASON: Har mutation ke baad apni list khud refresh (invalidate) —
 * UI hamesha taza. Wohi pattern jo variants/orders hooks ka hai.
 * RISK: Zero — nayi file.
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
  CreateBrandInput,
  CreateCategoryInput,
  UpdateBrandInput,
  UpdateCategoryInput,
} from "../types/admin-catalog.types";

export const adminCatalogQueryKeys = {
  categories: ["admin-catalog", "categories"] as const,
  brands: ["admin-catalog", "brands"] as const,
};

// ── Categories ──────────────────────────────────────────────────────────────

export function useAdminCategoriesQuery() {
  return useQuery({
    queryKey: adminCatalogQueryKeys.categories,
    queryFn: getAdminCategories,
    staleTime: queryDurations.short,
    gcTime: queryDurations.medium,
  });
}

function useInvalidateCategories() {
  const queryClient = useQueryClient();

  return () =>
    void queryClient.invalidateQueries({
      queryKey: adminCatalogQueryKeys.categories,
    });
}

export function useCreateCategoryMutation() {
  const invalidate = useInvalidateCategories();

  return useMutation({
    mutationFn: (input: CreateCategoryInput) => createAdminCategory(input),
    onSuccess: invalidate,
  });
}

export function useUpdateCategoryMutation() {
  const invalidate = useInvalidateCategories();

  return useMutation({
    mutationFn: ({
      categoryId,
      input,
    }: {
      categoryId: string;
      input: UpdateCategoryInput;
    }) => updateAdminCategory(categoryId, input),
    onSuccess: invalidate,
  });
}

export function useDeleteCategoryMutation() {
  const invalidate = useInvalidateCategories();

  return useMutation({
    mutationFn: (categoryId: string) => deleteAdminCategory(categoryId),
    onSuccess: invalidate,
  });
}

// ── Brands ──────────────────────────────────────────────────────────────────

export function useAdminBrandsQuery() {
  return useQuery({
    queryKey: adminCatalogQueryKeys.brands,
    queryFn: getAdminBrands,
    staleTime: queryDurations.short,
    gcTime: queryDurations.medium,
  });
}

function useInvalidateBrands() {
  const queryClient = useQueryClient();

  return () =>
    void queryClient.invalidateQueries({
      queryKey: adminCatalogQueryKeys.brands,
    });
}

export function useCreateBrandMutation() {
  const invalidate = useInvalidateBrands();

  return useMutation({
    mutationFn: (input: CreateBrandInput) => createAdminBrand(input),
    onSuccess: invalidate,
  });
}

export function useUpdateBrandMutation() {
  const invalidate = useInvalidateBrands();

  return useMutation({
    mutationFn: ({
      brandId,
      input,
    }: {
      brandId: string;
      input: UpdateBrandInput;
    }) => updateAdminBrand(brandId, input),
    onSuccess: invalidate,
  });
}

export function useDeleteBrandMutation() {
  const invalidate = useInvalidateBrands();

  return useMutation({
    mutationFn: (brandId: string) => deleteAdminBrand(brandId),
    onSuccess: invalidate,
  });
}
