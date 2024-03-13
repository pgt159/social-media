import { IChatRoom } from "@/app/home/type";
import { createSlice } from "@reduxjs/toolkit";

export interface INotiState {
  unread: number;
}
const initialState: INotiState = {
  unread: 0,
};

export const notiSlice = createSlice({
  name: "noti",
  initialState,
  reducers: {
    notiUpdateUnread: (state, action) => {
      return { ...state, unread: action.payload };
    },
  },
});

export const { notiUpdateUnread } = notiSlice.actions;

export default notiSlice.reducer;
