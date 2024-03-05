import { IUser } from "@/app/profile/type";
import { createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
export interface AuthState {
  user?: IUser;
  accessToken?: string;
}

// Define the initial state using that type
const initialState: AuthState = {
  user: undefined,
  accessToken: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authLogin: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    authRegister: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    authUpdateUser: (state, action) => {
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
      };
    },
    authRefreshToken: (state, action) => {
      return {
        ...state,
      };
    },
    authFetchMe: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    authLogout: (state, action) => ({
      ...state,
      ...action.payload,
    }),
  },
});

export const {
  authLogin,
  authRegister,
  authUpdateUser,
  authFetchMe,
  authRefreshToken,
  authLogout,
} = authSlice.actions;

export default authSlice.reducer;
