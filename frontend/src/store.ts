import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "./types";
interface AuthState { user: User | null; token: string | null; refreshToken: string | null; }
const initialState: AuthState = {
 user: JSON.parse(localStorage.getItem("petcare_user") || "null") as User | null,
 token: localStorage.getItem("petcare_token"), refreshToken: localStorage.getItem("petcare_refresh_token")
};
const authSlice = createSlice({ name:"auth", initialState, reducers:{
 setCredentials(state, action:PayloadAction<{user:User;token?:string;accessToken?:string;refreshToken?:string}>) {
  state.user=action.payload.user; state.token=action.payload.accessToken || action.payload.token || null; state.refreshToken=action.payload.refreshToken || null;
  localStorage.setItem("petcare_user",JSON.stringify(action.payload.user));
  if(state.token) localStorage.setItem("petcare_token",state.token);
  if(state.refreshToken) localStorage.setItem("petcare_refresh_token",state.refreshToken);
 },
 setAccessToken(state,action:PayloadAction<{accessToken:string;refreshToken:string}>) {
  state.token=action.payload.accessToken; state.refreshToken=action.payload.refreshToken;
  localStorage.setItem("petcare_token",state.token); localStorage.setItem("petcare_refresh_token",state.refreshToken);
 },
 logout(state) { state.user=null; state.token=null; state.refreshToken=null; localStorage.removeItem("petcare_user"); localStorage.removeItem("petcare_token"); localStorage.removeItem("petcare_refresh_token"); }
}});
export const {setCredentials,setAccessToken,logout}=authSlice.actions;
export const store=configureStore({reducer:{auth:authSlice.reducer}});
export type RootState=ReturnType<typeof store.getState>;
export type AppDispatch=typeof store.dispatch;
