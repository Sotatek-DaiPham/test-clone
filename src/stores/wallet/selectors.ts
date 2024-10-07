import { RootState } from "@/libs/redux/store";
import { createSelector } from "@reduxjs/toolkit";

export const getOpenWallet = createSelector(
  [(state: RootState) => state.wallet],
  ({ openWallet }) => openWallet
);
export const getOpenDrawerHeader = createSelector(
  [(state: RootState) => state.wallet],
  ({ openDrawerHeader }) => openDrawerHeader
);
