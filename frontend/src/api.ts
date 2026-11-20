import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { store, setAccessToken, logout } from "./store";
const baseURL=import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const api=axios.create({baseURL});
let refreshing:Promise<string|null>|null=null;
api.interceptors.request.use(config=>{const token=store.getState().auth.token;if(token)config.headers.Authorization=`Bearer ${token}`;return config;});
api.interceptors.response.use(response=>response,async(error:AxiosError)=>{
 const original=error.config as (InternalAxiosRequestConfig & {_retry?:boolean})|undefined;
 if(error.response?.status!==401||!original||original._retry||original.url?.includes("/auth/login")||original.url?.includes("/auth/refresh"))return Promise.reject(error);
 original._retry=true;const refreshToken=store.getState().auth.refreshToken;
 if(!refreshToken){store.dispatch(logout());return Promise.reject(error);}
 if(!refreshing){refreshing=axios.post(`${baseURL}/auth/refresh`,{refreshToken}).then(response=>{const {accessToken,refreshToken:next}=response.data;store.dispatch(setAccessToken({accessToken,refreshToken:next}));return accessToken as string;}).catch(()=>{store.dispatch(logout());return null;}).finally(()=>{refreshing=null;});}
 const token=await refreshing;if(!token)return Promise.reject(error);original.headers.Authorization=`Bearer ${token}`;return api(original);
});
export default api;
