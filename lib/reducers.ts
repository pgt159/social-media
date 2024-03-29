import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import messReducer from "./features/message/messSlice";
import socketReducer from "./features/socketConnection/socketSlice";
import loadingReducer from "./features/loading/loadingSlice";
import notiReducer from "./features/notification/notiSlice";

const reducers = combineReducers({
  auth: authReducer,
  mess: messReducer,
  socket: socketReducer,
  loading: loadingReducer,
  noti: notiReducer,
});

export default reducers;
