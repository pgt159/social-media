import { IMess } from "@/app/home/type";
import { IUser } from "@/app/profile/type";
import {
  Box,
  Skeleton,
  Tooltip,
  TooltipProps,
  Typography,
  styled,
  tooltipClasses,
} from "@mui/material";
import Image from "next/image";
import React from "react";
import moment from "moment";
const Message = ({
  message,
  isMyMessage,
  isTyping,
  picturePath,
}: // user,
{
  message?: IMess;
  isMyMessage?: boolean;
  isTyping?: boolean;
  picturePath?: string;
  // user?: IUser;
}) => {
  const messStyle = {
    display: "flex",
    flexDirection: isMyMessage ? "row-reverse" : "row",
    gap: "0.5rem",
    alignItems: "center",
    maxWidth: "70%",
    width: "fit-content",
    alignSelf: isMyMessage ? "flex-end" : "flex-start",
  };

  const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      color: "rgba(0, 0, 0, 0.87)",
      boxShadow: theme.shadows[1],
      fontSize: 14,
      padding: "0.7rem",
      borderRadius: "1.25rem",
    },
  }));

  return (
    <LightTooltip
      title={moment(message?.createdAt).format("DD/MM/YYYY HH:mm")}
      placement="left-start"
    >
      <Box sx={messStyle}>
        <Box
          sx={{
            height: "30px",
            aspectRatio: "1 / 1",
            position: "relative",
          }}
        >
          <Image
            src={picturePath || "/static/images/default-avatar.jpg"}
            alt="user_avatar"
            fill
            style={{ objectFit: "cover", borderRadius: "50%" }}
            sizes="35px"
          />
        </Box>
        <Box
          sx={{
            borderRadius: "1rem",
            backgroundColor: "#fff",
            padding: "0.4rem",
            paddingInline: "0.75rem",
            flex: 1,
            //   width: "min-content",
          }}
        >
          {!isTyping ? (
            message.content
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "0.5rem",
              }}
            >
              <Skeleton variant="circular" width={16} height={16} />
              <Skeleton variant="circular" width={16} height={16} />
              <Skeleton variant="circular" width={16} height={16} />
            </Box>
          )}
        </Box>
      </Box>
    </LightTooltip>
  );
};

export default Message;
