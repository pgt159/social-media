import { call, put } from "redux-saga/effects";
import {
  requestCreateChatRoom,
  requestGetAllChatRoom,
  requestGetOneChatRoom,
} from "./messRequest";
import { chatRoomUpdateAll, messAddChatRoom } from "./messSlice";

export function* handleMessOpen(action) {
  try {
    const { users, chatRoomExisted, getNewChat } = action.payload;
    if (chatRoomExisted) {
      yield put(messAddChatRoom(chatRoomExisted));
    } else {
      if (getNewChat) {
        const responseChatRoom = yield call(requestGetOneChatRoom, {
          chatRoomId: getNewChat,
        });
        if (responseChatRoom.status === 200) {
          yield put(messAddChatRoom(responseChatRoom.data.data));
          yield call(handleFetchChatRoom);
        }
      } else {
        const response = yield call(requestCreateChatRoom, { users });
        if (response.status === 201) {
          yield put(messAddChatRoom(response.data.data));
          yield call(handleFetchChatRoom);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
}

// CHATROOM

export function* handleFetchChatRoom() {
  try {
    const response = yield call(requestGetAllChatRoom);
    if (response.status === 200) {
      yield put(chatRoomUpdateAll(response.data.data));
    }
  } catch (error) {
    console.log(error);
  }
}
