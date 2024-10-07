import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type walletStates = {
  openWallet: boolean;
  openDrawerHeader: boolean;
};

const initialState: walletStates = {
  openWallet: false,
  openDrawerHeader: false,
};

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setOpenWallet: (state, actions: PayloadAction<boolean>) => {
      state.openWallet = actions.payload;
    },
    setOpenDrawerHeader: (state, actions: PayloadAction<boolean>) => {
      state.openDrawerHeader = actions.payload;
    },

    clearWallet: () => initialState,
  },
});

export const { setOpenWallet, clearWallet, setOpenDrawerHeader } =
  walletSlice.actions;

export const walletStateReducer = walletSlice.reducer;
