import apiMethod from "@/app/utils/apiMethod";
import API from "@/app/auth/configs/api";
import API_HOME from "@/app/home/configs/api";
import { IChatRoom } from "@/app/home/type";

export const requestGetAllChatRoom = () => {
  return apiMethod.get(`${API_HOME.CHATROOM_CRUD}`);
};

export const requestCreateChatRoom = (payload: { users: string[] }) => {
  if (!payload) return;
  return apiMethod.post(`${API_HOME.CHATROOM_CRUD}`, payload);
};

export const requestGetOneChatRoom = ({
  chatRoomId,
}: {
  chatRoomId: string;
}) => {
  if (!chatRoomId) return;
  return apiMethod.get(`${API_HOME.CHATROOM_CRUD}/${chatRoomId}`);
};
