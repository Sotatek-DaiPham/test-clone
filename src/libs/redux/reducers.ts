import { userStateReducer } from "@/stores/user";
import { walletStateReducer } from "@/stores/wallet";
import { combineReducers } from "redux";
import { baseQueryApi } from "./baseQueryApi";

const appReducer = combineReducers({
  user: userStateReducer,
  wallet: walletStateReducer,

  [baseQueryApi.reducerPath]: baseQueryApi.reducer,
});

export const rootReducer = (state: any, action: any) =>
  appReducer(state, action);
