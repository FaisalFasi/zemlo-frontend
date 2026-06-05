import { queryOptions } from "@tanstack/react-query";

import {
  getAdminProductById,
  getAdminProducts,
} from "../api/admin-products-api";

export const adminProductQueryKeys = {
  all: ["admin-products"] as const,
  lists: () => [...adminProductQueryKeys.all, "list"] as const,
  detail: (productId: string) =>
    [...adminProductQueryKeys.all, "detail", productId] as const,
};

export const adminProductQueryOptions = {
  list: () =>
    queryOptions({
      queryKey: adminProductQueryKeys.lists(),
      queryFn: getAdminProducts,
    }),

  detail: (productId: string) =>
    queryOptions({
      queryKey: adminProductQueryKeys.detail(productId),
      queryFn: () => getAdminProductById(productId),
      enabled: Boolean(productId),
    }),
};
