import { useAppSelector } from "@/lib/hooks";
import useRefreshToken from "./useRefreshToken";
import { useEffect } from "react";
import apiMethodPrivate from "../utils/apiMethodPrivate";

export default function useAxiosPrivate() {
  const auth = useAppSelector((state) => state.auth);
  const refresh = useRefreshToken();
  useEffect(() => {
    const requestInterceptor = apiMethodPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = apiMethodPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        console.log(error);
        const prevRequest = error.config;
        if (error?.response?.status.startsWith("4") && !prevRequest.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return apiMethodPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      apiMethodPrivate.interceptors.request.eject(requestInterceptor);
      apiMethodPrivate.interceptors.response.eject(responseInterceptor);
    };
  }, [auth.accessToken, refresh]);

  return apiMethodPrivate;
}
