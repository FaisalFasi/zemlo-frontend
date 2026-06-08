import { QueryClient } from "@tanstack/react-query";

import { queryConfig } from "@/shared/config/query";

let browserQueryClient: QueryClient | undefined;

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: queryConfig.staleTime,
        gcTime: queryConfig.gcTime,
        retry: queryConfig.retry,
        refetchOnWindowFocus: queryConfig.refetchOnWindowFocus,
      },
      mutations: {
        retry: queryConfig.mutationRetry,
      },
    },
  });
}

export function getQueryClient() {
  if (typeof window === "undefined") {
    return createQueryClient();
  }

  if (!browserQueryClient) {
    browserQueryClient = createQueryClient();
  }

  return browserQueryClient;
}
