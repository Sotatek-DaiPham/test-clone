import { RootState } from "@/libs/redux/store";
import { createSelector } from "@reduxjs/toolkit";

export const getAccessToken = createSelector(
  [(state: RootState) => state.user],
  ({ accessToken }) => accessToken
);

export const getUserInfo = createSelector(
  [(state: RootState) => state.user],
  ({ userInfo }) => userInfo
);

export const getIpAddress = createSelector(
  [(state: RootState) => state.user],
  ({ ipAddress }) => ipAddress
);
