export const queryConfig = Object.freeze({
  staleTime: 30 * 1000,
  gcTime: 5 * 60 * 1000,
  retry: 1,
  refetchOnWindowFocus: false,
  mutationRetry: 0,
} as const);
