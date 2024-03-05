import { all, fork, takeLatest } from "redux-saga/effects";
import authSagas from "./features/auth/authSagas";
import messSagas from "./features/message/messSaga";

export default function* rootSaga() {
  yield all([fork(authSagas), fork(messSagas)]);
}
