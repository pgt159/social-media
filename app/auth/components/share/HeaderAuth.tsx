import { Box, Link, Typography, useTheme } from "@mui/material";
import { colorTokens } from "@/app/theme";
import React from "react";

const HeaderAuth = () => {
  const theme = useTheme();
  return (
    <Box
      p={"1rem 6%"}
      textAlign={"center"}
      bgcolor={theme.palette.background?.alt || "#fff"}
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
    </Box>
  );
};

export default HeaderAuth;
