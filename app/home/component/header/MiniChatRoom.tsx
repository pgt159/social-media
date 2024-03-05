// @ts-nocheck
import React from "react";
import { IChatRoom } from "../../type";
import { Box, Typography } from "@mui/material";
import { useAppSelector } from "@/lib/hooks";
import Image from "next/image";

const MiniChatRoom = ({ chatRoom }: { chatRoom: IChatRoom }) => {
  const _ = useAppSelector((state) => state.auth.user);
  const user = chatRoom.users.find((item) => item._id !== _?._id);
  const isRead =
    chatRoom?.lastMessage?.sentBy === _?._id ||
    chatRoom?.lastMessage?.sentBy?._id === _?._id ||
    chatRoom?.lastMessage?.readBy.includes(_?._id);

  return (
    <Box
      sx={{
        // padding: "10px",
        width: "100%",
        display: "flex",
        flexDirection: "row",
        gap: "0.75rem",
        textTransform: "none",
      }}
    >
      <Box>
        <Image
          width={56}
          height={56}
          alt="user_avatar"
          src={user?.picturePath || "/static/images/default-avatar.jpg"}
          className="rounded-full overflow-hidden"
        />
      </Box>
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
            width={16}
            height={16}
            alt="user_avatar"
            src={user?.picturePath || "/static/images/default-avatar.jpg"}
            className="rounded-full overflow-hidden"
          />
        </Box>
      ) : null}
    </Box>
  );
};

export default MiniChatRoom;
