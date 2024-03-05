export interface IUserFriend {
  _id: string;
  fullName: string;
  email: string;
  picturePath?: string;
  firstName: string;
  lastName: string;
}

export interface IUser {
  firstName: string;
  lastName: string;
  email?: string;
  picturePath?: string;
  location?: string;
  occupation?: string;
  viewedProfile?: number;
  impression?: number;
  friend?: IUserFriend[];
  friendRequest?: string[];
  friendRequested?: string[];
  _id: string;
  linkFb?: string;
  linkLinkedin: string;
}
