import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "./types";

interface AuthState { user: User | null; token: string | null; }
const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("petcare_user") || "null") as User | null,
  token: localStorage.getItem("petcare_token")
};
const authSlice = createSlice({
  name: "auth", initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user; state.token = action.payload.token;
      localStorage.setItem("petcare_user", JSON.stringify(action.payload.user));
      localStorage.setItem("petcare_token", action.payload.token);
    },
    logout(state) {
      state.user = null; state.token = null;
      localStorage.removeItem("petcare_user"); localStorage.removeItem("petcare_token");
    }
  }
});
export const { setCredentials, logout } = authSlice.actions;
export const store = configureStore({ reducer: { auth: authSlice.reducer } });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
