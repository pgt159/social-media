import React from "react";
import { Box, Skeleton } from "@mui/material";
const SkeletonLoading = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        bgcolor: "background.paper",
      }}
    >
      {Array(6)
        .fill(null)
        .map((item, index) => (
          <Box
            key={index}
            sx={{
              gap: "0.5rem",
              width: "100%",
              display: "flex",
              flexDirection: "row",
              borderRadius: "9px",
              alignItems: "flex-start",
              mb: "0.8rem",
            }}
          >
            <Skeleton variant="circular" width={35} height={35} />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <Skeleton
                variant="text"
                sx={{ fontSize: "1rem", width: "80%" }}
              />
              <Skeleton
                variant="text"
                sx={{ fontSize: "1rem", width: "80%" }}
              />
            </Box>
          </Box>
        ))}
    </Box>
  );
};

export default SkeletonLoading;
