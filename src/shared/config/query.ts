const SECOND = 1000;
const MINUTE = 60 * SECOND;

export const queryConfig = Object.freeze({
  staleTime: 30 * SECOND,
  gcTime: 5 * MINUTE,
  retry: 1,
  refetchOnWindowFocus: false,
  mutationRetry: 0,
} as const);

export const queryDurations = Object.freeze({
  second: SECOND,
  minute: MINUTE,
  short: 30 * SECOND,
  medium: 5 * MINUTE,
  long: 30 * MINUTE,
} as const);

// export const queryConfig = Object.freeze({
//   staleTime: 30 * 1000,
//   gcTime: 5 * 60 * 1000,
//   retry: 1,
//   refetchOnWindowFocus: false,
//   mutationRetry: 0,
// } as const);
// //
