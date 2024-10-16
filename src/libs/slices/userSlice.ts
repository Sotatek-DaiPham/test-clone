import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  accessToken: string | null;
  address: string | null;
  refreshToken: string | null;
  userId: string | null;
}

const initialState: UserState = {
  accessToken: null,
  address: null,
  refreshToken: null,
  userId: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, { payload }: PayloadAction<UserState>) => {
      Object.assign(state, payload);
    },
    clearUser: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
