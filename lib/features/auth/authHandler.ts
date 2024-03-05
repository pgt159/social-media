import { call, put } from "redux-saga/effects";
import {
  requestAuthFetchMe,
  requestAuthLogin,
  requestAuthRefreshToken,
  requestAuthRegister,
} from "./authRequest";
import { logout, saveToken } from "@/app/utils/auth";
import { authUpdateUser } from "./authSlice";
import { loadingToggle } from "../loading/loadingSlice";
import apiMethod from "@/app/utils/apiMethod";
import { toast } from "react-toastify";

export function* handleAuthRefreshToken(action) {
  const { payload } = action;
  try {
    const response = yield call(requestAuthRefreshToken, payload);
    if (response.status === 200 && response.data) {
      saveToken(response.data.access_token, response.data.refresh_token);
      apiMethod.defaults.headers[
        "Authorization"
      ] = `Bearer ${response.data.access_token}`;
      yield call(handleAuthFetchMe, { payload: response.data.access_token });
    } else {
      yield call(handleAuthLogout, {});
    }
  } catch (error) {
    console.log(error);
  }
}

export function* handleAuthRegister(action) {
  const { payload, type } = action;
  yield put(loadingToggle(true));
  try {
    const response = yield call(requestAuthRegister, payload);
    if (response.status === 201) {
      toast.success("Register successfully", {
        toastId: "register_success",
      });
    } else {
      toast.error(response.message || "Register failed", {
        toastId: "register_failed",
      });
    }
  } catch (error) {
    console.log(error);
    toast.error(error.response.data.message || "Register failed", {
      toastId: "register_failed",
    });
  } finally {
    yield put(loadingToggle(false));
  }
}

export function* handleAuthLogin(action) {
  const { payload, type } = action;
  yield put(loadingToggle(true));
  try {
    const response = yield call(requestAuthLogin, payload);
    if (response.status === 200) {
      if (response.data.access_token && response.data.refresh_token) {
        console.log("hello");
        saveToken(response.data.access_token, response.data.refresh_token);
        apiMethod.defaults.headers[
          "Authorization"
        ] = `Bearer ${response.data.access_token}`;
        yield call(handleAuthFetchMe, { payload: response.data.access_token });
        // window.location.href = "/";
      }
      toast.success("Login successfully", {
        toastId: "login_success",
      });
    } else {
      toast.error(response.message || "Login failed", {
        toastId: "login_failed",
      });
    }
  } catch (error) {
    console.log(error);
    toast.error(error.response.data.message || "Login failed", {
      toastId: "login_failed",
    });
  } finally {
    yield put(loadingToggle(false));
  }
  yield 1;
}

export function* handleAuthFetchMe(action) {
  const { payload } = action;
  try {
    const response = yield call(requestAuthFetchMe, payload);
    if (response?.status === 200) {
      yield put(
        authUpdateUser({
          user: response.data.data,
          accessToken: payload,
        })
      );
    }
  } catch (error) {
    console.log(error);
  }
}

export function* handleAuthLogout(action) {
  yield put(
    authUpdateUser({
      user: undefined,
      accessToken: null,
    })
  );
  logout();
}
