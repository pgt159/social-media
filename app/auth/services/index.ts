import apiMethod from "@/app/utils/apiMethod";
import API from "../configs/api";
import { ILoginProps, IRegisterProps } from "@/app/auth/type";

// const axiosPrivate = useAxiosPrivate();
export const loginService = async (payload: ILoginProps): Promise<void> => {
  try {
    const res = await apiMethod.post(API.AUTH_LOGIN, payload);
    if (res.status === 200) {
      return res.data.data.user;
    }
    apiMethod.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${res.data.data.access_token}`;
  } catch (error) {
    console.log(error);
  }
};

export const registerService = async (payload: IRegisterProps) => {
  try {
    const res = await apiMethod.post(API.AUTH_REGISTER, payload);
    if (res.status === 201) {
      return res;
    }
  } catch (error) {
    console.log(error);
  }
};
