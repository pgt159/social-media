// @ts-nocheck

import { IChatRoom } from "@/app/home/type";
import { useAppSelector } from "@/lib/hooks";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

const ChatRoomButton = ({ chatRoom }: { chatRoom: IChatRoom }) => {
  const _ = useAppSelector((state) => state.auth.user);
  const user = chatRoom.users.find((item) => item._id !== _?._id);
  const isRead =
    chatRoom?.lastMessage?.sentBy === _?._id ||
    chatRoom?.lastMessage?.sentBy?._id === _?._id ||
    chatRoom?.lastMessage?.readBy.includes(_?._id);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        flex: 1,
        gap: "1rem",
      }}
    >
      <Image
        src={user?.picturePath || "/static/images/default-avatar.jpg"}
        alt="chat_room_image"
        width={50}
        height={50}
        style={{
          borderRadius: "100%",
          objectFit: "cover",
        }}
      />
      <Box
        sx={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <Typography className="text-pDark" fontWeight={"700"} fontSize={16}>
          {user.firstName + " " + user.lastName}
        </Typography>
        <Typography
          className={`text-ellipsis ${
            isRead ? "text-nMain" : "text-pDark font-bold"
          } line-clamp-1`}
        >
          {`${
            chatRoom?.lastMessage?.sentBy === user?._id ? user.lastName : "You"
          }: ${chatRoom?.lastMessage?.content}`}
        </Typography>
      </Box>
      {isRead ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            width={14}
            height={14}
            alt="user_avatar"
            src={user?.picturePath || "/static/images/default-avatar.jpg"}
            className="rounded-full overflow-hidden"
          />
        </Box>
      ) : null}
    </Box>
  );
};

export default ChatRoomButton;
