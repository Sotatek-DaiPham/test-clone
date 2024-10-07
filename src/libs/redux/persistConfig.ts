import storage from "redux-persist/es/storage";

export const persistConfig = {
  key: "root",
  storage: storage,
  version: 1,
  blacklist: ["user", "wallet"],
  whitelist: ["user", "wallet"],
};
