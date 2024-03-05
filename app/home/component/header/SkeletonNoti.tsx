import { Box, Skeleton } from "@mui/material";
import React from "react";

const SkeletonNoti = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "1rem",
        }}
      >
        <Skeleton variant="circular" width={35} height={35} />
        <Skeleton variant="text" sx={{ fontSize: "16px" }} width={"60%"} />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Skeleton variant="text" sx={{ fontSize: "16px" }} />
        <Skeleton variant="text" sx={{ fontSize: "16px" }} />
        <Skeleton variant="text" sx={{ fontSize: "16px" }} />
      </Box>
    </Box>
  );
};

export default SkeletonNoti;
