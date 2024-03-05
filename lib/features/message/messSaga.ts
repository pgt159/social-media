import { takeLatest } from "redux-saga/effects";
import {
  chatRoomFetch,
  chatRoomUpdateAll,
  messOpenNewChatRoom,
} from "./messSlice";
import { handleMessOpen, handleFetchChatRoom } from "./messHandler";

export default function* messSagas() {
  yield takeLatest(messOpenNewChatRoom.type, handleMessOpen);
  yield takeLatest(chatRoomFetch.type, handleFetchChatRoom);
}
