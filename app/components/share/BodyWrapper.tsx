"use client";

import { Box, useTheme } from "@mui/material";
import React from "react";

const BodyWrapper = ({
  children,
  sx,
}: {
  children: React.ReactNode;
  sx: any;
}) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: "1.5rem 1.5rem 0.75rem 1.5rem",
        borderRadius: "0.75rem",
        backgroundColor: theme.palette.background.alt,
        boxSizing: "border-box",
        width: "100%",
        maxHeight: "100%",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default BodyWrapper;
