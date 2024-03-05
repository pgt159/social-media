import apiMethod from "@/app/utils/apiMethod";
import API from "@/app/auth/configs/api";
import { ILoginProps, IRegisterProps } from "@/app/auth/type";

export const requestAuthRegister = (data: IRegisterProps) => {
  return apiMethod.post(API.AUTH_REGISTER, data);
};
export const requestAuthLogin = (data: ILoginProps) => {
  return apiMethod.post(API.AUTH_LOGIN, data);
};

export const requestAuthFetchMe = (token: string) => {
  if (!token) return;
  return apiMethod.get(API.AUTH_FETCH_ME);
};

export const requestAuthRefreshToken = (token: string) => {
  if (!token) return;
  return apiMethod.post(API.AUTH_REFRESH_TOKEN, { refresh_token: token });
};
