import { Box } from "@mui/material";
import React from "react";

const Notification = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        marginBottom: "0.75rem",
      }}
    >
      {children}
    </Box>
  );
};

export default Notification;
