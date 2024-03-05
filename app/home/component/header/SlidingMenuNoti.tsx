"use client";
import { useAppSelector } from "@/lib/hooks";
import {
  Box,
  Button,
  Drawer,
  Paper,
  Slide,
  Typography,
  styled,
} from "@mui/material";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  fetchFriendRequests,
  serviceConfirmFriendRequest,
} from "../../store/service";
import SkeletonNoti from "./SkeletonNoti";
import Image from "next/image";
import FriendConfirmButton from "./buttons/FriendConfirmButton";
import { useSocket } from "@/app/components/SocketProvider";

interface INotiProps {
  isNotiOpen: boolean;
  setIsNotiOpen: Dispatch<SetStateAction<boolean>>;
}

export interface IFriendRequest {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  picturePath: string;
  friend: string[];
  fullName?: string;
  id?: string;
}

const SlidingMenuNoti = ({ isNotiOpen, setIsNotiOpen }: INotiProps) => {
  const [listFriendRequest, setListFriendRequest] = useState<IFriendRequest[]>(
    []
  );
  const socket = useSocket();

  const [loadingFr, setLoadingFr] = useState<boolean>(false);

  const SlidingMenu = styled(Paper)(({ theme }) => ({
    width: "300px",
    maxHeight: "calc(100vh - 73px - 20px)",
    position: "fixed",
    top: "73px",
    right: "6%",
    padding: "20px",
    boxSizing: "border-box",
    backgroundColor: "#fff",
    zIndex: 9999,
  }));

  const Wrapper = styled(Box)(({ theme }) => ({
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  }));

  const NotiItem = styled(Box)(({ theme }) => ({
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    marginBottom: "0.75rem",
  }));

  const Title = styled(Typography)(({ theme }) => ({
    width: "100%",
    fontWeight: "500",
    fontSize: "18px",
  }));

  useEffect(() => {
    if (isNotiOpen) {
      getUserFriendRequest();
    }
  }, [isNotiOpen]);

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

      setIsNotiOpen(open);
    };

  const getUserFriendRequest = async () => {
    setLoadingFr(true);
    try {
      const result = await fetchFriendRequests();
      if (result.status === 200 && result?.data?.data) {
        setListFriendRequest(result?.data?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingFr(false);
    }
  };

  return (
    <Drawer
      anchor={"top"}
      open={isNotiOpen}
      onClose={toggleDrawer("top", false)}
      sx={{
        "& .MuiModal-backdrop": {
          backgroundColor: "rgba(0,0,0,0)",
        },
        "& .MuiPaper-elevation": {
          overflow: "scroll",
        },
      }}
      transitionDuration={0}
    >
      <SlidingMenu>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {listFriendRequest?.length > 0 ? (
            <Wrapper>
              <Title>Friend requests</Title>
              {loadingFr ? (
                <SkeletonNoti />
              ) : (
                listFriendRequest?.map((item) => (
                  <NotiItem key={item?._id}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "1rem",
                        alignItems: "flex-start",
                      }}
                    >
                      <Image
                        width={35}
                        height={35}
                        src={
                          item?.picturePath ||
                          "/static/images/default-avatar.jpg"
                        }
                        alt="user_avatar"
                        className="rounded-full"
                      />
                      <Typography
                        className="line-clamp-2 text-ellipsis"
                        fontWeight={"500"}
                      >
                        {item?.fullName ||
                          `${item?.firstName || ""} ${
                            item?.lastName || ""
                          }`}{" "}
                        wants to be your friend
                      </Typography>
                    </Box>
                    <Box>
                      <Typography>
                        Click{" "}
                        <span
                          className="font-[500] inline text-pMain"
                          // fontWeight={"500"}
                          // display={"inline"}
                          // className="text-pMain"
                        >
                          Accept
                        </span>{" "}
                        if you want to add friend
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          gap: "1.5rem",
                          marginTop: "0.5rem",
                        }}
                      >
                        <FriendConfirmButton
                          isAccept={true}
                          item={item}
                          cb={getUserFriendRequest}
                        />
                        <FriendConfirmButton
                          isAccept={false}
                          item={item}
                          cb={getUserFriendRequest}
                        />
                      </Box>
                    </Box>
                  </NotiItem>
                ))
              )}
            </Wrapper>
          ) : null}
          {/* <Wrapper>
            <Title>Notifications</Title>
            {true
              ? Array(6)
                  .fill(null)
                  .map((item, index) => <SkeletonNoti key={index} />)
              : null}
          </Wrapper> */}
        </Box>
      </SlidingMenu>
    </Drawer>
  );
};

export default SlidingMenuNoti;
