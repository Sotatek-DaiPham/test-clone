import { baseQueryApi } from "@/libs/redux/baseQueryApi";
import { APIResponse, ResponseAuth } from "../http";
import { IParamsProfile, IPayloadLogin } from "./types";

export const userApi = baseQueryApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<APIResponse<ResponseAuth>, IPayloadLogin>({
      query: (payload) => {
        return {
          url: "auth/login",
          body: payload,
          method: "POST",
        };
      },
    }),
    getProfile: build.query<APIResponse<any>, IParamsProfile>({
      query: () => {
        return {
          url: "auth/profile",
          method: "GET",
        };
      },
    }),
  }),
});

export const { useLoginMutation, useGetProfileQuery, useLazyGetProfileQuery } =
  userApi;
