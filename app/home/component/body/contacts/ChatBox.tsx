import { IChatRoom, IMess } from "@/app/home/type";
import { Box, Divider, IconButton, InputBase, Typography } from "@mui/material";
import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import MinimizeIcon from "@mui/icons-material/Minimize";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import Message from "./Message";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  serviceCreateMessage,
  serviceGetMessageFromChatId,
  serviceSeenMessage,
} from "@/app/home/store/service";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import Empty from "@/app/components/empty/Empty";
import { v4 } from "uuid";
import { IUser } from "@/app/profile/type";
import {
  chatRoomFetch,
  messCloseChatRoom,
} from "@/lib/features/message/messSlice";
import { useSocket } from "@/app/components/SocketProvider";

const styleHeader = {
  display: "flex",
  flexDirection: "row",
  padding: "0.25rem",
  justifyContent: "space-between",
  paddingBottom: "0.5rem",
};
const styleBody = {
  display: "flex",
  flex: 1,
  padding: "0.5rem",
  overflow: "scroll",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
};
const styleFooter = {
  display: "flex",
  flexDirection: "row",
  width: "100%",
  padding: "0.5rem",
  paddingBlock: "12px",
  boxSizing: "border-box",
  gap: "0.75rem",
};

const ChatBox = ({ item }: { item?: IChatRoom }) => {
  const [loading, setLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState<boolean>(false);
  const [isMeTyping, setIsMeTyping] = useState(false);
  const [isFriendTyping, setIsFriendTyping] = useState(null);
  const [isFriendSeen, setIsFriendSeen] = useState(false);

  const [messageData, setMessageData] = useState<IMess[]>([]);
  const user = useAppSelector((state) => state.auth.user);
  const friend = item.users.find((friendItem) => friendItem._id !== user?._id);

  const inputRef = useRef(null);

  const scrollRef = useRef(null);
  const scrollRefChildren = useRef(null);

  const dispatch = useAppDispatch();

  const socket = useSocket();

  useEffect(() => {
    scrollToBottom();
  }, [messageData, isFriendTyping]);

  useEffect(() => {
    if (socket) {
      socket.on("message received", (newMessage: IMess) => {
        if (!item || item._id !== newMessage.chatRoomId) {
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
    }
  }, [socket]);

  useEffect(() => {
    if (isMeTyping) {
      socket.emit("typing", { chatRoom: item, user });
    } else {
      socket.emit("stop typing", { chatRoom: item, user });
    }
  }, [isMeTyping]);

  useEffect(() => {
    fetchMessageData();
  }, [item]);

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
      if (!item || !item._id) return;
      const res = await serviceGetMessageFromChatId({ chatId: item?._id });
      if (res.status === 200) {
        setMessageData(res.data.data);
        socket.emit("join chat", { chatRoom: item, user });
        const lastMessage = res.data.data[res.data.data.length - 1];
        if (
          lastMessage?.readBy.length > 0 &&
          !lastMessage?.readBy.includes(user?._id)
        ) {
          setIsFriendSeen(true);
        }

        if (
          !lastMessage?.readBy.includes(user?._id) &&
          lastMessage?.sentBy._id !== user?._id
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
        chatId: item?._id,
        content: inputRef.current.value,
      });
      if (res.status === 201 && res.data.data.chatRoomId === item._id) {
        socket.emit("new message", {
          users: item.users,
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

  const handleCloseChatBox = () => {
    dispatch(messCloseChatRoom(item._id));
    socket.off("friend typing");
    socket.off("friend stop typing");
    socket.off("friend seen");
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
        socket.emit("seen", { chatRoom: item, user });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      className="bg-nLight"
      sx={{
        width: "328px",
        height: "445px",
        borderRadius: "0.5rem 0.5rem 0 0 ",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={styleHeader}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "0.5rem",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              height: "35px",
              aspectRatio: "1 / 1",
              position: "relative",
            }}
          >
            <Image
              src={friend.picturePath || "/static/images/default-avatar.jpg"}
              alt="user_avatar"
              fill
              style={{ objectFit: "cover", borderRadius: "50%" }}
              sizes="35px"
            />
          </Box>
          <Typography
            fontWeight={"500"}
            fontSize={"14px"}
            className="text-nDark"
          >
            {`${friend.firstName} ${friend.lastName}`}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {/* <IconButton className="text-nDark text-[25px]">
            <MinimizeIcon />
          </IconButton> */}
          <IconButton
            className="text-nDark text-[25px]"
            onClick={handleCloseChatBox}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>
      <Divider />
      <Box sx={styleBody} ref={scrollRef}>
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
                title={`Let's chat with ${friend.firstName || ""} ${
                  friend.lastName || ""
                }`}
              />
            ) : null}
            {messageData?.length > 0
              ? messageData?.map((dataItem: IMess) => (
                  <Message
                    key={dataItem._id}
                    message={dataItem}
                    user={dataItem.sentBy}
                    isMyMessage={dataItem.sentBy?._id === user?._id}
                  />
                ))
              : null}
            {isFriendTyping ? (
              <Message
                key={v4()}
                message={null}
                user={friend}
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
      <Divider />
      <Box sx={styleFooter}>
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
          className={`text-pMain ${
            sendLoading ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={() => {
            if (sendLoading) return;
            handleCreateMessage();
          }}
        >
          {sendLoading ? (
            <div className="h-full aspect-square border-solid border-2 border-pMain border-l-[rgba(0,0,0,0)] animate-spin rounded-full" />
          ) : (
            <SendIcon />
          )}
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatBox;
