"use client";

import { Box, Link } from "@mui/material";
import React, { useEffect, useState } from "react";

import HomeHeaderDesktop from "./HomeHeaderDesktop";
import HomeHeaderMobile from "./HomeHeaderMobile";
import { useAppSelector } from "@/lib/hooks";

const HomeHeader = () => {
  const user = useAppSelector((state) => state.auth.user);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  useEffect(() => {
    setIsMobile(window?.innerWidth <= 767);
  }, []);
  return (
    <Box
      p={"1rem 6%"}
      textAlign={"center"}
      display={"flex"}
      flexDirection={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      gap={"1.75rem"}
      height={"73px"}
      width={"100%"}
      boxSizing={"border-box"}
      position={"absolute"}
      top={0}
      className={"bg-bAlt"}
      // zIndex={99999}
    >
      <Link
        fontWeight={"bold"}
        fontSize={"32px"}
        color={"primary"}
        sx={{ cursor: "pointer" }}
        flex={0}
        href={"/"}
        underline="none"
      >
        Sociopedia
      </Link>
      {isMobile ? (
        <HomeHeaderMobile user={user} />
      ) : (
        <HomeHeaderDesktop user={user} />
      )}
    </Box>
  );
};

export default HomeHeader;
