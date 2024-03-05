import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  socketConnected: false,
  socketInstance: null,
};

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setSocketSetConnected: (state, action) => ({
      ...state,
      socketConnected: action.payload || state.socketConnected,
    }),
    setSocketInstance: (state, action) => ({
      ...state,
      socketInstance: action.payload || state.socketInstance,
    }),
  },
});

export const { setSocketSetConnected, setSocketInstance } = socketSlice.actions;
export default socketSlice.reducer;
