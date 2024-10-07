import { baseQueryApi } from "@/libs/redux/baseQueryApi";
import { APIResponse } from "../http";
import { ParamsCoingecko, PayloadCurrency } from "./types";

export const walletApi = baseQueryApi.injectEndpoints({
  endpoints: (build) => ({
    getCoingeckoPrice: build.query<any, ParamsCoingecko>({
      query: (params) => {
        return {
          url: `/coingecko`,
          method: "GET",
          params: params,
        };
      },
    }),
    getCurrencies: build.query<APIResponse<PayloadCurrency[]>, undefined>({
      query: () => {
        return {
          url: `/currencies`,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useGetCoingeckoPriceQuery,
  useGetCurrenciesQuery,
  useLazyGetCurrenciesQuery,
} = walletApi;
