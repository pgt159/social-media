"use client";
import { useSocket } from "@/app/components/SocketProvider";
import { IUser } from "@/app/profile/type";
import { requestGetOneChatRoom } from "@/lib/features/message/messRequest";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Box, Divider, IconButton, InputBase, Typography } from "@mui/material";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { IMess } from "@/app/home/type";
import Message from "@/app/home/component/body/contacts/Message";
import Empty from "@/app/components/empty/Empty";
import { v4 } from "uuid";
import SendIcon from "@mui/icons-material/Send";

import {
  serviceCreateMessage,
  serviceGetMessageFromChatId,
  serviceSeenMessage,
} from "@/app/home/store/service";
import { chatRoomFetch } from "@/lib/features/message/messSlice";
const ChatRoomMobile = ({ params }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [sendLoading, setSendLoading] = useState<boolean>(false);
  const [messageData, setMessageData] = useState<IMess[]>([]);
  const [isFriendTyping, setIsFriendTyping] = useState(null);
  const [isFriendSeen, setIsFriendSeen] = useState(false);
  const [isMeTyping, setIsMeTyping] = useState(false);

  const socket = useSocket();
  const { chatRoomId } = params || {};
  const { data, status } = useQuery({
    queryKey: ["chatRoom"],
    queryFn: async () => {
      const res = await requestGetOneChatRoom({ chatRoomId });
      return res.data.data;
    },
    staleTime: Infinity,
  });

  const dispatch = useAppDispatch();
  const me = useAppSelector((state) => state.auth.user);
  const user = data?.users?.find((item: IUser) => item?._id !== me?._id);

  const scrollRef = useRef(null);
  const scrollRefChildren = useRef(null);
  const inputRef = useRef(null);
  useEffect(() => {
    scrollToBottom();
  }, [messageData, isFriendTyping]);

  useEffect(() => {
    if (socket && data) {
      socket.on("joined chat", () => {
        console.log("joined");
        socket.on("message", () => {
          console.log("new message");
        });
        console.log("59");
        socket.on("message received", (newMessage: IMess) => {
          if (!data || data._id !== newMessage.chatRoomId) {
            // give notification
          } else {
            setMessageData((prev) => [...prev, newMessage]);
            handleSeenMessage({ message: newMessage });
            setIsFriendSeen(false);
          }
        });
        socket.on("friend typing", (user: IUser) => {
          setIsFriendTyping(user || true);
        });
        socket.on("friend stop typing", (user: IUser) => {
          setIsFriendTyping(null);
        });
        socket.on("friend seen", () => {
          setIsFriendSeen(true);
          setTimeout(scrollToBottom, 200);
        });
      });

      console.log("ending");
    }

    // return () => {
    //   socket.off("friend typing");
    //   socket.off("friend stop typing");
    //   socket.off("friend seen");
    // };
  }, [socket, data]);

  useEffect(() => {
    if (isMeTyping) {
      socket.emit("typing", { chatRoom: data, user });
    } else {
      socket.emit("stop typing", { chatRoom: data, user });
    }
  }, [isMeTyping]);

  useEffect(() => {
    if (!user || !me || !data) return;
    fetchMessageData();
  }, [data, user, me]);

  const scrollToBottom = () => {
    const { height } = scrollRefChildren.current?.getBoundingClientRect() || {};
    const scrollHeight = scrollRefChildren.current?.scrollHeight;
    scrollRef.current?.scroll({
      top: height + scrollHeight + 10,
    });
  };

  const fetchMessageData = async () => {
    setLoading(true);
    try {
      if (!data || !data._id) return;
      const res = await serviceGetMessageFromChatId({ chatId: data?._id });
      if (res.status === 200) {
        setMessageData(res.data.data);
        socket.emit("join chat", { chatRoom: data, user: me });
        const lastMessage = res.data.data[res.data.data.length - 1];
        if (
          lastMessage?.readBy.length > 0 &&
          !lastMessage?.readBy.includes(me?._id)
        ) {
          setIsFriendSeen(true);
        }

        if (
          !lastMessage?.readBy.includes(me?._id) &&
          lastMessage?.sentBy._id !== me?._id
        ) {
          handleSeenMessage({ message: lastMessage });
          dispatch(chatRoomFetch({}));
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMessage = async () => {
    setSendLoading(true);
    if (!inputRef.current.value || inputRef.current.value.length <= 0) return;
    try {
      const res = await serviceCreateMessage({
        chatId: data?._id,
        content: inputRef.current.value,
      });
      if (res.status === 201 && res.data.data.chatRoomId === data._id) {
        socket.emit("new message", {
          users: data.users,
          ...res.data.data,
        });
        inputRef.current.value = "";
        setMessageData((prev) => [...prev, res.data.data]);
        setIsFriendSeen(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSendLoading(false);
    }
  };

  const handleSeenMessage = async ({ message }: { message: IMess }) => {
    if (!message) return;
    try {
      const newReadBy = message?.readBy.includes(user?._id)
        ? message?.readBy
        : [...message.readBy, user?._id];

      const result = await serviceSeenMessage({
        readBy: newReadBy,
        messageId: message._id,
      });

      if (result.status === 200) {
        socket.emit("seen", { chatRoom: data, user });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box className="bg-nLight relative w-full h-full flex flex-col">
      <header className="flex flex-row gap-2 items-center py-2">
        <IconButton>
          <ChevronLeftIcon fontSize="large" />
        </IconButton>
        <Image
          alt={"user_avatar"}
          src={user?.picturePath || "/static/images/default-avatar.jpg"}
          width={50}
          height={50}
          className="rounded-full "
        />
        <Typography
          fontSize={18}
          fontWeight={"800"}
          className="text-pMain line-clamp-1 text-ellipsis"
        >
          {user ? `${user?.firstName} ${user?.lastName}` : ""}
        </Typography>
      </header>
      <Divider className="mb-4" />
      <Box
        className="flex flex-1 flex-col overflow-scroll p-2 items-center justify-center"
        ref={scrollRef}
      >
        {!loading ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              justifyContent: "flex-end",
              height: "max-content",
              width: "100%",
            }}
            ref={scrollRefChildren}
          >
            {messageData?.length <= 0 && !isFriendTyping ? (
              <Empty
                title={`Let's chat with ${user?.firstName || ""} ${
                  user?.lastName || ""
                }`}
              />
            ) : null}
            {messageData?.length > 0
              ? messageData?.map((dataItem: IMess) => (
                  <Message
                    key={dataItem._id}
                    message={dataItem}
                    user={dataItem.sentBy}
                    isMyMessage={dataItem.sentBy?._id === me?._id}
                  />
                ))
              : null}
            {isFriendTyping ? (
              <Message
                key={v4()}
                message={null}
                user={user}
                isMyMessage={false}
                isTyping={true}
              />
            ) : null}
          </Box>
        ) : (
          <div className="h-12 aspect-square border-solid border-pMain border-4 border-l-[rgba(0,0,0,0)] rounded-full animate-spin" />
        )}
        {!isFriendTyping && isFriendSeen ? (
          <Box
            sx={{
              height: "20px",
              width: "100%",
            }}
          >
            <Typography className="text-nMain text-[14px] w-full pr-1 box-border text-right">
              ✓ Seen
            </Typography>
          </Box>
        ) : null}
      </Box>
      <footer
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          padding: "0.5rem",
          paddingBlock: "12px",
          boxSizing: "border-box",
          gap: "0.75rem",
        }}
      >
        <Divider className="py-2" />
        <InputBase
          placeholder="Aa"
          className=""
          sx={{
            backgroundColor: "#fff",
            flex: 1,
            borderRadius: "1.5rem",
            paddingInline: "12px",
          }}
          inputRef={inputRef}
          onChange={(e) => {
            if (isMeTyping) return;
            setIsMeTyping(true);
            setTimeout(() => {
              setIsMeTyping(false);
            }, 1000);
          }}
          onKeyDown={(e) => {
            if (e.code === "Enter") {
              handleCreateMessage();
              setIsMeTyping(false);
            }
          }}
        />
        <IconButton
          className={`text-pMain`}
          onClick={() => {
            handleCreateMessage();
          }}
        >
          {sendLoading ? (
            <div className="h-full aspect-square border-solid border-2 border-pMain border-l-[rgba(0,0,0,0)] animate-spin rounded-full" />
          ) : (
            <SendIcon />
          )}
        </IconButton>
      </footer>
    </Box>
  );
};

export default ChatRoomMobile;
