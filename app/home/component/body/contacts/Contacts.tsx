"use client";

import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import Friend from "./Friend";
import BodyWrapper from "@/app/components/share/BodyWrapper";
import { useAppSelector } from "@/lib/hooks";
import Empty from "@/app/components/empty/Empty";

const Contacts = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const user = useAppSelector((state) => state.auth.user);

  return (
    !isMobile && (
      <BodyWrapper
        sx={{
          padding: "1rem 1rem 0.5rem 1rem",
        }}
      >
        <Typography
          mb={"1.5rem"}
          fontWeight={"500"}
          color={theme.palette.neutral.dark}
          variant="h5"
        >
          Contacts
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            flex: 1,
            maxHeight: "100%",
            overflow: "scroll",
          }}
        >
          {user?.friend?.length > 0 ? (
            user?.friend?.map((item, index) => (
              <Friend key={index} friend={item} userId={user?._id} />
            ))
          ) : (
            <Empty
              title="You have no friend"
              description="Let's find some on Sociopedia!"
            />
          )}
        </Box>
      </BodyWrapper>
    )
  );
};

export default Contacts;
