export const SEARCH_PARAMS = {
  filter: "filter",
} as const;

export type ExtractKeyType<T, K extends keyof T> = T[K][keyof T[K]];
export type TypeSearchParams<K extends keyof typeof SEARCH_PARAMS> =
  ExtractKeyType<typeof SEARCH_PARAMS, K>;
