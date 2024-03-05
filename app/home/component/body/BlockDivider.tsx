import { Box } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { BoxTypeMap } from "@mui/system";

import React from "react";

const BlockDivider = ({
  children,
  sx,
}: {
  children: React.ReactNode;
  sx?: any;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        flex: 1,
        width: "100%",
        paddingBottom: "1.1rem",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default BlockDivider;
