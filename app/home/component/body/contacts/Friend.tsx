"use client";
import { IUserFriend } from "@/app/profile/type";
import { messOpenNewChatRoom } from "@/lib/features/message/messSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import Image from "next/image";
import React, { useEffect } from "react";

const Friend = ({
  friend,
  userId,
}: {
  friend: IUserFriend;
  userId: string;
}) => {
  const dispatch = useAppDispatch();
  const allChatRoom = useAppSelector((state) => state.mess.allChatRoom);
  const fullName =
    friend?.fullName || `${friend?.firstName || ""} ${friend?.lastName || ""}`;
  const handleOpenChat = () => {
    const chatRoomExisted = allChatRoom.find((item) =>
      item.users.find((userItem) => userItem._id === friend._id)
    );
    dispatch(
      messOpenNewChatRoom({
        users: [userId, friend?._id],
        chatRoomExisted,
      })
    );
  };
  return (
    <IconButton
      key={friend._id}
      sx={{
        borderRadius: "0.5rem",
        mb: "0.5rem",
        width: "100%",
      }}
      onClick={handleOpenChat}
    >
      <ListItem
        alignItems="flex-start"
        sx={{
          p: 0,
          gap: "0.5rem",
        }}
      >
        <Image
          className="rounded-[50%]"
          alt="user_avatar"
          src={friend.picturePath || "/static/images/default-avatar.jpg"}
          height={35}
          width={35}
        />
        <ListItemText
          primary={
            <Typography
              sx={{ display: "inline" }}
              component="span"
              fontWeight={"500"}
              className="line-clamp-1 text-ellipsis"
            >
              {fullName}
            </Typography>
          }
        />
      </ListItem>
    </IconButton>
  );
};

export default Friend;
