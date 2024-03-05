import { IComment } from "@/app/home/type";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import moment from "moment";

const CommentItem = ({ item }: { item: IComment }) => {
  const commentBoxStyle = {
    borderRadius: "0.75rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    padding: "0.5rem",
    paddingInline: "1rem",
    backgroundColor: "#e7e7e7",
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: "0.5rem",
      }}
    >
      <Image
        src={item?.userPicturePath || "/static/images/default-avatar.jpg"}
        width={35}
        height={35}
        alt={"user_avatar"}
        className="rounded-full"
      />
      <Box>
        <Box sx={commentBoxStyle}>
          <Typography fontWeight={"500"} className="text-nDark">
            {`${item?.firstName || ""} ${item?.lastName || ""}`}
          </Typography>
          <Typography>{item?.content}</Typography>
        </Box>
        <Typography
          fontSize={"12px"}
          className="text-nMain"
          sx={{
            marginTop: "0.25rem",
            paddingInline: "0.5rem",
          }}
        >
          {moment(item?.createdAt).toNow(true)} ago
        </Typography>
      </Box>
    </Box>
  );
};

export default CommentItem;
