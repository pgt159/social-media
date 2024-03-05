"use client";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  Box,
  Button,
  Divider,
  Drawer,
  Paper,
  Typography,
  styled,
} from "@mui/material";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import MiniChatRoom from "./MiniChatRoom";
import Empty from "@/app/components/empty/Empty";
import {
  chatRoomFetch,
  messOpenNewChatRoom,
} from "@/lib/features/message/messSlice";
import { IChatRoom, IMess } from "../../type";
import { useQuery } from "react-query";
import { useSocket } from "@/app/components/SocketProvider";

interface IMessProps {
  isMessOpen: boolean;
  setIsMessOpen: Dispatch<SetStateAction<boolean>>;
}

const SlidingMenuMess = ({ isMessOpen, setIsMessOpen }: IMessProps) => {
  const { allChatRoom, activeMess } = useAppSelector((state) => state.mess);

  const dispatch = useAppDispatch();
  const SlidingMenu = styled(Paper)(({ theme }) => ({
    width: "400px",
    maxHeight: "calc(100vh - 100px)",
    overflow: "scroll",
    position: "fixed",
    top: "73px",
    right: "1%",
    boxSizing: "border-box",
    backgroundColor: "#fff",
    zIndex: 9999,
    padding: "0.5rem",
  }));

  const toggleDrawer =
    (anchor: string, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setIsMessOpen(open);
    };

  const handleOpenMiniChatRoom = (chatRoom: IChatRoom) => {
    setIsMessOpen(false);
    if (activeMess.find((activeChat) => activeChat._id === chatRoom._id))
      return;
    dispatch(
      messOpenNewChatRoom({
        users: chatRoom.users,
        chatRoomExisted: chatRoom,
      })
    );
  };

  return (
    <Drawer
      anchor={"top"}
      open={isMessOpen}
      onClose={toggleDrawer("top", false)}
      sx={{
        "& .MuiModal-backdrop": {
          backgroundColor: "rgba(0,0,0,0)",
        },
      }}
      transitionDuration={0}
    >
      <SlidingMenu>
        <header className="px-[16px] pt-[12px] pb-[4px]">
          <Typography fontWeight={"700"} fontSize={30} className="text-nDark">
            Chats
          </Typography>
        </header>
        <Divider
          sx={{
            marginBlock: "1rem",
          }}
        />
        <Box>
          {allChatRoom.filter((chatRoom) => chatRoom.lastMessage).length > 0 ? (
            allChatRoom
              .filter((chatRoom) => chatRoom.lastMessage)
              .map((singleChatRoom) => (
                <Button
                  key={singleChatRoom._id}
                  className="w-full"
                  onClick={() => handleOpenMiniChatRoom(singleChatRoom)}
                >
                  <MiniChatRoom chatRoom={singleChatRoom} />
                </Button>
              ))
          ) : (
            <Empty title="You haven't chatted with friends recently" />
          )}
        </Box>
      </SlidingMenu>
    </Drawer>
  );
};

export default SlidingMenuMess;
