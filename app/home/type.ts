import { IUser } from "../profile/type";

export interface IPost {
  comments: number;
  createdAt: string;
  description?: string;
  firstName?: string;
  lastName?: string;
  likes: {};
  location?: string;
  picturePath?: string;
  updatedAt: string;
  userId: string;
  userPicturePath?: string;
  __v?: number;
  _id: string;
}

export interface IComment {
  _id: string;
  firstName: string;
  lastName: string;
  userId: string;
  postId: string;
  content: string;
  userPicturePath?: string;
  createdAt: Date;
}

export interface IChatRoom {
  _id: string;
  users: IUser[];
  isGroupChat: boolean;
  chatName?: string;
  groupAdmin?: string;
  lastMessage?: IMess;
}

export interface IMess {
  _id: string;
  readBy: string[];
  sentBy: IUser;
  content: string;
  chatRoomId: string;
  createdAt: Date;
}

export interface INoti {
  _id: string;
  isRead: boolean;
  postId: IPost;
  toUser: string;
  fromUser: IUser;
  type: string;
  createdAt: Date;
}
