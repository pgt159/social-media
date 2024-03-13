import apiMethod from "@/app/utils/apiMethod";
import API from "../configs/api";

export const serviceGetListUser = async ({
  name,
  page,
}: {
  name?: string;
  page?: number;
}) => {
  return apiMethod.get(`${API.LIST_USER}${name ? `?name=${name}` : ""}`);
};

export const serviceGetUser = ({ userId }: { userId: string }) => {
  return apiMethod.get(`${API.LIST_USER}/${userId}`);
};
export const serviceGetHistorySearch = () => {
  return apiMethod.get(`${API.HISTORY_SEARCH}`);
};

export const serviceGetUserFriends = () => {
  return apiMethod.get(`${API.FRIEND}`);
};

export const serviceAddFriend = (friendId: string) => {
  return apiMethod.patch(`${API.FRIEND}`, { id: friendId });
};

export const serviceGetFriendRequest = () => {
  return apiMethod.get(`${API.FRIEND}`);
};

export const serviceConfirmFriendRequest = (id: string, isAccept: boolean) => {
  return apiMethod.patch(`${API.FRIEND_REQUEST}`, {
    id,
    isAccept,
  });
};

export const fetchFriendRequests = () => {
  return apiMethod.get(`${API.FRIEND_REQUEST}`);
};

export const serviceCreatePost = (payload: {
  description: string;
  picturePath: string;
}) => {
  return apiMethod.post(`${API.POST_CRUD}`, payload);
};

export const serviceGetNewsFeed = ({ userId }: { userId: string }) => {
  return apiMethod.get(`${API.POST_CRUD}${userId ? `/user/${userId}` : ""}`);
};

export const serviceLikePost = ({
  postId,
  type,
}: {
  postId: string;
  type: string;
}) => {
  return apiMethod.post(`${API.POST_LIKE}/${postId}`, { type });
};

export const serviceUpdatePost = ({
  description,
  postId,
}: {
  description?: string;
  postId: string;
}) => {
  return apiMethod.patch(`${API.POST_CRUD}/${postId}`, { description });
};

export const serviceDeletePost = (postId: string) => {
  return apiMethod.delete(`${API.POST_CRUD}/${postId}`);
};

export const serviceCreateComment = ({
  postId,
  content,
}: {
  postId: string;
  content: string;
}) => {
  return apiMethod.post(`${API.COMMENT_CRUD}/${postId}`, {
    content,
  });
};

export const serviceGetComment = ({
  page,
  limit,
  postId,
}: {
  page: number;
  limit: number;
  postId: string;
}) => {
  return apiMethod.get(
    `${API.COMMENT_CRUD}/${postId}?page=${page || 0}&limit=${limit || 50}`
  );
};

// Message
export const serviceGetMessageFromChatId = ({ chatId }: { chatId: string }) => {
  return apiMethod.get(`${API.CHATROOM_CRUD}/${chatId}/message`);
};

export const serviceSeenMessage = ({
  readBy,
  messageId,
}: {
  readBy: string[];
  messageId: string;
}) => {
  return apiMethod.patch(`${API.MESSAGE_CRUD}/${messageId}`, { readBy });
};

export const serviceCreateMessage = ({
  chatId,
  content,
}: {
  chatId: string;
  content: string;
}) => {
  return apiMethod.post(`${API.CHATROOM_CRUD}/${chatId}/message`, {
    content,
  });
};

export const updateUser = (payload) => {
  return apiMethod.patch(`${API.LIST_USER}`, payload);
};

// Notification
export const getAllNotification = () => {
  return apiMethod.get(`${API.NOTI_CRUD}?limit=50`);
};

export const createNotification = (payload: {
  toUser: string;
  type: string;
  postId: string;
}) => {
  return apiMethod.post(`${API.NOTI_CRUD}`, payload);
};

export const getNotificationUnread = () => {
  return apiMethod.get(`${API.NOTI_UNREAD}`);
};
