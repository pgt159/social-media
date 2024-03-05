import { takeLatest } from "redux-saga/effects";
import {
  authLogin,
  authRefreshToken,
  authRegister,
  authLogout,
  authFetchMe,
} from "./authSlice";
import {
  handleAuthRegister,
  handleAuthLogin,
  handleAuthRefreshToken,
  handleAuthLogout,
  handleAuthFetchMe,
} from "./authHandler";

export default function* authSagas() {
  yield takeLatest(authRefreshToken.type, handleAuthRefreshToken);
  yield takeLatest(authRegister.type, handleAuthRegister);
  yield takeLatest(authLogin.type, handleAuthLogin);
  yield takeLatest(authFetchMe.type, handleAuthFetchMe);
  yield takeLatest(authLogout.type, handleAuthLogout);
}
