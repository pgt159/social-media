import EmptyIcon from "@/public/static/svgs/EmptyIcon";
import { Box, Typography } from "@mui/material";
import React from "react";

const Empty = ({
  title,
  description,
}: {
  title: string;
  description?: string;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "1.5rem",
      }}
    >
      <Box
        sx={{
          width: "30%",
        }}
      >
        <EmptyIcon color="#A3A3A3" />
      </Box>
      <Typography fontWeight={"500"} className="text-nMain">
        {title}
      </Typography>
      <Typography className="text-nMain">{description}</Typography>
    </Box>
  );
};

export default Empty;
