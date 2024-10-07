import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import dayjs from "dayjs";
import Cookies from "js-cookie";
import { RootState } from "./store";

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_ENDPOINT + "/api/",
  prepareHeaders: (headers, { getState, endpoint }) => {
    // const ipAddress = (getState() as RootState).user.ipAddress;
    // if (ipAddress) {
    //   headers.set("x-client-ip", ipAddress);
    // }

    headers.set("timezone", (dayjs().utcOffset() / 60).toString());

    const token = (getState() as RootState).user.accessToken;

    if (!!token && endpoint !== "refresh") {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock();
  // const { getState, dispatch } = api;

  let result = await baseQuery(args, api, extraOptions);

  const isAuthorizeError = result.error && result.error.status === 401;
  if (isAuthorizeError) {
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        Cookies.remove("accessToken");
        localStorage.clear();
        api.dispatch({ type: "user/setLogout" });
      } finally {
        // release must be called once the mutex should be released again.
        release();
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const baseQueryApi = createApi({
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["user", "wallet"],
  endpoints: () => ({}),
  keepUnusedDataFor: 0,
});
