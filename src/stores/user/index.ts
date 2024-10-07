import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { APIResponse, ResponseAuth } from "../http";
import { userApi } from "./api";
import { UserInfo } from "./types";

type AuthStates = {
  accessToken: null | string;
  refreshToken: null | string;
  userInfo: UserInfo;
  ipAddress: string;
};

const initialState: AuthStates = {
  accessToken: null,
  refreshToken: null,
  userInfo: {},
  ipAddress: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLogout: () => initialState,

    setUserInfo: (state, actions: PayloadAction<UserInfo>) => {
      state.userInfo = { ...state.userInfo, ...actions.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      userApi.endpoints.login.matchFulfilled,
      (state, action: PayloadAction<APIResponse<ResponseAuth>>) => {
        state.accessToken = action?.payload?.data?.accessToken;
        state.refreshToken = action?.payload?.data?.refreshToken;
      }
    );
    builder.addMatcher(
      userApi.endpoints.getProfile.matchFulfilled,
      (state, action: PayloadAction<APIResponse<any>>) => {
        state.userInfo = { ...state.userInfo, ...action?.payload?.data };
      }
    );
  },
});

export const { setLogout, setUserInfo } = userSlice.actions;

export const userStateReducer = userSlice.reducer;
