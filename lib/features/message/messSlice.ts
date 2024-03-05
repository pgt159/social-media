import { IChatRoom } from "@/app/home/type";
import { createSlice } from "@reduxjs/toolkit";

export interface IMessState {
  activeMess: IChatRoom[];
  allChatRoom: IChatRoom[];
  value: number;
}
const initialState: IMessState = {
  activeMess: [],
  allChatRoom: [],
  value: 0,
};

export const messSlice = createSlice({
  name: "mess",
  initialState,
  reducers: {
    messOpenNewChatRoom: (state, action) => {
      return {
        ...state,
      };
    },
    messAddChatRoom: (state, action) => {
      const activeChatRoomIndex = state.activeMess.findIndex(
        (item) => item._id === action.payload._id
      );
      let newArray = state.activeMess;
      if (activeChatRoomIndex > -1) {
        newArray = newArray.filter((item) => item._id !== action.payload._id);
      }
      newArray = [action.payload, ...newArray];
      if (newArray?.length > 4) {
        newArray.pop();
      }
      return { ...state, activeMess: newArray };
    },
    messCloseChatRoom: (state, action) => {
      return {
        ...state,
        activeMess: [...state.activeMess].filter(
          (chatRoom) => chatRoom._id !== action.payload
        ),
      };
    },

    chatRoomFetch: (state, action) => {
      return { ...state };
    },

    chatRoomUpdateAll: (state, action) => {
      return { ...state, allChatRoom: action.payload };
    },
  },
});

export const {
  messOpenNewChatRoom,
  chatRoomUpdateAll,
  chatRoomFetch,
  messAddChatRoom,
  messCloseChatRoom,
} = messSlice.actions;

export default messSlice.reducer;
