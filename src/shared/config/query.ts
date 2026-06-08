const SECOND = 1000;
const MINUTE = 60 * SECOND;

export const queryDurations = Object.freeze({
  second: SECOND,
  minute: MINUTE,
  short: 30 * SECOND,
  medium: 5 * MINUTE,
  long: 30 * MINUTE,
} as const);

export const queryConfig = Object.freeze({
  staleTime: queryDurations.short,
  gcTime: queryDurations.medium,
  retry: 1,
  refetchOnWindowFocus: false,
  mutationRetry: 0,
} as const);
