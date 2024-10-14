export const SEARCH_PARAMS = {
  terminal: {
    tab: "tab",
    filter: "filter",
    top: "top",
    rising: "rising",
    finalized: "finalized",
    age: "age",
    min: "min",
    max: "max",
  },
  myProfile: {
    tab: "tab",
  },
} as const;

export type ExtractKeyType<T, K extends keyof T> = T[K][keyof T[K]];
export type TypeSearchParams<K extends keyof typeof SEARCH_PARAMS> =
  ExtractKeyType<typeof SEARCH_PARAMS, K>;
