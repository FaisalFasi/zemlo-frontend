import { QueryClient } from "@tanstack/react-query";

const QUERY_STALE_TIME = 30 * 1000;
const QUERY_GC_TIME = 5 * 60 * 1000;

let browserQueryClient: QueryClient | undefined;

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: QUERY_STALE_TIME,
        gcTime: QUERY_GC_TIME,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
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
