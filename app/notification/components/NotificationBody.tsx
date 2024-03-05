"use client";
import SkeletonNoti from "@/app/home/component/header/SkeletonNoti";
import { fetchFriendRequests } from "@/app/home/store/service";
import { Box, Divider, Typography, styled } from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Notification from "./Notification";
import FriendConfirmButton from "@/app/home/component/header/buttons/FriendConfirmButton";
import { IFriendRequest } from "@/app/home/component/header/SlidingMenuNoti";

const NotificationBody = () => {
  const [listFriendRequest, setListFriendRequest] = useState<IFriendRequest[]>(
    []
  );

  const [loadingFr, setLoadingFr] = useState<boolean>(false);

  useEffect(() => {
    getUserFriendRequest();
  }, []);

  const Wrapper = styled(Box)(({ theme }) => ({
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  }));

  const Title = styled(Typography)(({ theme }) => ({
    width: "100%",
    fontWeight: "500",
    fontSize: "24px",
  }));

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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "1rem",
        width: "100%",
        marginBottom: "1rem",
        overflow: "scroll",
      }}
    >
      {listFriendRequest?.length > 0 ? (
        <Wrapper>
          <Title>Friend requests</Title>
          {loadingFr ? (
            <SkeletonNoti />
          ) : (
            listFriendRequest?.map((item) => (
              <Notification key={item?._id}>
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
                      item?.picturePath || "/static/images/default-avatar.jpg"
                    }
                    alt="user_avatar"
                    className="rounded-full"
                  />
                  <Typography
                    className="line-clamp-2 text-ellipsis text-[16px]"
                    fontWeight={"500"}
                  >
                    {item?.fullName ||
                      `${item?.firstName || ""} ${item?.lastName || ""}`}{" "}
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
                <Divider />
              </Notification>
            ))
          )}
        </Wrapper>
      ) : null}
      <Wrapper>
        <Title>Notifications</Title>
        {true
          ? Array(6)
              .fill(null)
              .map((item, index) => <SkeletonNoti key={index} />)
          : null}
      </Wrapper>
    </Box>
  );
};

export default NotificationBody;
