import { authUpdateUser } from "@/lib/features/auth/authSlice";
import API from "../auth/configs/api";
import apiMethod from "../utils/apiMethod";
import { getToken, saveToken } from "../utils/auth";

export default function useRefreshToken() {
  const refresh = async () => {
    const { refresh_token } = getToken();
    if (!refresh_token) return null;
    const response = await apiMethod.post(API.AUTH_REFRESH_TOKEN, {
      "Content-Type": "Application/json",
      refresh_token,
    });
    saveToken(response.data.accessToken, response.data.refreshToken);
    authUpdateUser((prev) => ({
      ...prev,
      accessToken: response?.data?.accessToken,
    }));
    return response?.data?.accessToken || "";
  };
  return refresh;
}
