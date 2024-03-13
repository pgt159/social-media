// @ts-nocheck
import { Badge, Box, IconButton, styled, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MessageIcon from "@mui/icons-material/Message";
import NotificationsIcon from "@mui/icons-material/Notifications";

import React, { useEffect, useState } from "react";
import DesktopHeaderDropdown from "./logoutButton/DesktopHeaderDropdown";
import HeaderSearch from "@/app/components/modal/HeaderSearch/HeaderSearch";
import SlidingMenuNoti from "./SlidingMenuNoti";
import SlidingMenuMess from "./SlidingMenuMessage";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { IUser } from "@/app/profile/type";
import { IChatRoom } from "../../type";
import { useSocket } from "@/app/components/SocketProvider";
import {
  chatRoomFetch,
  messOpenNewChatRoom,
} from "@/lib/features/message/messSlice";
import { useQuery } from "react-query";
import { getNotificationUnread } from "../../store/service";

const HomeHeaderDesktop = ({ user }: { user: IUser }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isNotiOpen, setIsNotiOpen] = useState<boolean>(false);
  const [isMessOpen, setIsMessOpen] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const { allChatRoom, activeMess } = useAppSelector((state) => state.mess);

  const { data, status } = useQuery({
    queryKey: "notiUnread",
    queryFn: async () => {
      const res = await getNotificationUnread();
      console.log(res);
      if (res.status === 200) {
        console.log(res.data.data);
        return res.data.data;
      }
    },
    staleTime: Infinity,
  });

  const theme = useTheme();
  const dark = theme.palette.neutral.dark;

  const IconWrapper = styled("div")({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
    flex: 1,
  });

  const socket = useSocket();

  useEffect(() => {
    socket.on("message received", (newMessage: IMess) => {
      if (
        activeMess?.find(
          (activeChat: IChatRoom) => activeChat._id === newMessage.chatRoomId
        )
      )
        return;
      if (
        allChatRoom?.find(
          (chatRoom: IChatRoom) => chatRoom._id === newMessage.chatRoomId
        )
      ) {
        const chatRoomExisted = allChatRoom?.find((item: IChatRoom) =>
          item.users?.find(
            (userItem: IUser) => userItem._id === newMessage.chatRoomId
          )
        );
        dispatch(
          messOpenNewChatRoom({
            users: [user?._id, newMessage.sentBy?._id],
            chatRoomExisted,
          })
        );
      } else {
        dispatch(messOpenNewChatRoom({ getNewChat: newMessage.chatRoomId }));
      }
    });

    return () => {
      socket.off("message received");
    };
  }, [socket]);

  useEffect(() => {
    if (isMessOpen) {
      dispatch(chatRoomFetch({}));
    }
  }, [isMessOpen]);

  useEffect(() => {});

  return (
    <Box
      flexDirection={"row"}
      display={"flex"}
      justifyContent={"flex-end"}
      alignItems={"center"}
      gap="1rem"
      flex={1}
      className={"hidden md:flex"}
    >
      <HeaderSearch open={open} setOpen={setOpen} />
      <Box
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        gap={"2rem"}
      >
        <IconWrapper
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "2rem",
          }}
        >
          <IconButton
            onClick={() => {
              setOpen(true);
            }}
          >
            <SearchIcon sx={{ color: dark, fontSize: "25px" }} />
          </IconButton>
          <IconButton
            onClick={() => {
              setIsMessOpen(!isMessOpen);
            }}
          >
            <Badge
              badgeContent={
                allChatRoom?.filter((chatRoom: IChatRoom) => {
                  return (
                    chatRoom.lastMessage &&
                    !chatRoom.lastMessage.readBy.includes(user?._id) &&
                    chatRoom.lastMessage.sentBy !== user?._id
                  );
                }).length
              }
              color="error"
              max={99}
            >
              <MessageIcon sx={{ color: dark, fontSize: "25px" }} />
            </Badge>
          </IconButton>
          <IconButton
            onClick={() => {
              setIsNotiOpen(!isNotiOpen);
            }}
          >
            <Badge badgeContent={data || 0} color="error" max={99}>
              <NotificationsIcon sx={{ color: dark, fontSize: "25px" }} />
            </Badge>
          </IconButton>
        </IconWrapper>
        <DesktopHeaderDropdown />
      </Box>
      <SlidingMenuNoti isNotiOpen={isNotiOpen} setIsNotiOpen={setIsNotiOpen} />
      <SlidingMenuMess isMessOpen={isMessOpen} setIsMessOpen={setIsMessOpen} />
    </Box>
  );
};

export default HomeHeaderDesktop;
