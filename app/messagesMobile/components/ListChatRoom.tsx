"use client";
import { useSocket } from "@/app/components/SocketProvider";
import Empty from "@/app/components/empty/Empty";
import { IChatRoom, IMess } from "@/app/home/type";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Box, IconButton, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import ChatRoomButton from "./ChatRoomButton";
import { requestGetOneChatRoom } from "@/lib/features/message/messRequest";
import { chatRoomUpdateAll } from "@/lib/features/message/messSlice";
import Link from "next/link";

const ListChatRoom = () => {
  const { allChatRoom } = useAppSelector((state) => state.mess);
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const socket = useSocket();

  useEffect(() => {
    if (!socket || !allChatRoom) return;
    socket.on("message received", async (newMessage: IMess) => {
      let sortedChatRoom = [...allChatRoom];
      const newChatRoom = sortedChatRoom.find(
        (chatRoom) => chatRoom._id === newMessage.chatRoomId
      );
      const indexChatRoom = sortedChatRoom.findIndex(
        (chatRoom) => chatRoom._id === newMessage.chatRoomId
      );
      if (!newChatRoom && indexChatRoom === -1) {
        const responseChatRoom = await requestGetOneChatRoom({
          chatRoomId: newMessage.chatRoomId,
        });
        if (responseChatRoom.status === 200) {
          sortedChatRoom.unshift(responseChatRoom.data.data);
        }
      } else {
        if (indexChatRoom !== 0) {
          sortedChatRoom
            .filter((chatRoom) => chatRoom._id !== newChatRoom._id)
            .unshift({ ...newChatRoom, lastMessage: newMessage });
        } else {
          sortedChatRoom[0] = { ...newChatRoom, lastMessage: newMessage };
        }
      }
      dispatch(chatRoomUpdateAll(sortedChatRoom));
      return;
    });
    return () => {
      socket.off("message received");
    };
  }, [socket, allChatRoom, dispatch]);

  const handleEnterChatRoom = (chatRoomId: string) => {
    router.push(`/messageMobile/${chatRoomId}`);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "0.5rem",
        width: "100%",
      }}
    >
      <Typography variant="h3" fontWeight={"700"}>
        Chats
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          paddingInline: "0.5rem",
          flex: 1,
          height: "100%",
          justifyContent:
            allChatRoom?.filter((chatRoom) => chatRoom.lastMessage)?.length > 0
              ? "flex-start"
              : "center",
        }}
      >
        {allChatRoom?.filter((chatRoom) => chatRoom.lastMessage).length > 0 ? (
          allChatRoom
            ?.filter((chatRoom) => chatRoom.lastMessage)
            ?.map((chatRoom: IChatRoom) => (
              <Link
                href={`/messagesMobile/${chatRoom?._id}`}
                key={chatRoom?._id}
                onClick={() => handleEnterChatRoom(chatRoom._id)}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  paddingBlock: "0.5rem",
                  borderRadius: "1rem",
                  justifyContent: "space-between",
                  textDecoration: "none",
                }}
              >
                <ChatRoomButton chatRoom={chatRoom} />
              </Link>
            ))
        ) : (
          <Empty title="You haven't chatted with friends recently" />
        )}
      </Box>
    </Box>
  );
};

export default ListChatRoom;
