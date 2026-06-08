import { queryOptions } from "@tanstack/react-query";

import { getCart } from "../api/cart-api";

export const cartQueryKeys = {
  all: ["cart"] as const,
  current: () => [...cartQueryKeys.all, "current"] as const,
};

export const cartQueryOptions = {
  current: () =>
    queryOptions({
      queryKey: cartQueryKeys.current(),
      queryFn: getCart,
    }),
};
