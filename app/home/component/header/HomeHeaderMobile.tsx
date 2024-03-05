"use client";
import {
  Badge,
  Box,
  IconButton,
  Paper,
  Slide,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import MessageIcon from "@mui/icons-material/Message";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

import React, { useState } from "react";
import Image from "next/image";
import { useAppDispatch } from "@/lib/hooks";
import { authLogout } from "@/lib/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { IUser } from "@/app/profile/type";

const HomeHeaderMobile = ({ user }: { user: IUser }) => {
  const dispatch = useAppDispatch();
  const fullName = `${user?.firstName} ${user?.lastName}`;
  const router = useRouter();

  const handleLogout = () => {
    dispatch(authLogout({}));
    router.push("/auth");
  };

  const [isToggleMenu, setIsToggleMenu] = useState<boolean>(false);

  const theme = useTheme();

  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;

  const SlidingMenu = styled(Paper)(({ theme }) => ({
    minWidth: "300px",
    maxWidth: "500px",
    height: "100vh",
    position: "fixed",
    right: 0,
    top: 0,
    padding: "20px",
    boxSizing: "border-box",
    backgroundColor: background,
    zIndex: 9999,
  }));

  const onToggleMenu = (): void => {
    setIsToggleMenu(!isToggleMenu);
  };

  return (
    <Box className={"flex md:hidden"}>
      <IconButton onClick={onToggleMenu}>
        <MenuRoundedIcon sx={{ color: dark, fontSize: "25px" }} />
      </IconButton>
      <Slide direction="left" in={isToggleMenu} mountOnEnter unmountOnExit>
        <SlidingMenu variant="elevation">
          <Box
            flex={1}
            height={"100%"}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"space-between"}
            position={"relative"}
            paddingTop={"50px"}
            boxSizing={"border-box"}
          >
            <Box
              width={"100%"}
              display={"flex"}
              justifyContent={"flex-end"}
              position={"absolute"}
              right={0}
              top={0}
            >
              <IconButton onClick={onToggleMenu}>
                <CloseRoundedIcon sx={{ color: dark, fontSize: "30px" }} />
              </IconButton>
            </Box>

            <Box
              marginTop={"1rem"}
              display={"flex"}
              flexDirection={"column"}
              gap={"1rem"}
            >
              <IconButton
                onClick={onToggleMenu}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  backgroundColor: "#fff",
                  width: "100%",
                  borderRadius: "0.75rem",
                  padding: "10px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    gap: "1rem",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      height: "30px",
                      borderRadius: "50%",
                      aspectRatio: 1,
                      position: "relative",
                      display: "flex",
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      alt="user-image"
                      src={
                        user?.picturePath || "/static/images/default-avatar.jpg"
                      }
                      height={30}
                      width={30}
                    />
                  </Box>

                  <Typography fontSize={"20px"} color={dark}>
                    {fullName || ""}
                  </Typography>
                </Box>
              </IconButton>

              <IconButton
                onClick={() => {
                  router.push("/messagesMobile");
                  onToggleMenu();
                }}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  backgroundColor: "#fff",
                  width: "100%",
                  borderRadius: "0.75rem",
                  padding: "10px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    gap: "1rem",
                  }}
                >
                  <MessageIcon sx={{ color: dark, fontSize: "30px" }} />
                  <Typography fontSize={"20px"} color={dark}>
                    Messages
                  </Typography>
                </Box>
              </IconButton>
              <IconButton
                onClick={() => {
                  router.push("/notification");
                }}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  backgroundColor: "#fff",
                  width: "100%",
                  borderRadius: "0.75rem",
                  padding: "10px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    gap: "1rem",
                  }}
                >
                  <NotificationsIcon sx={{ color: dark, fontSize: "30px" }} />
                  <Typography fontSize={"20px"} color={dark}>
                    Notifications
                  </Typography>
                  <Badge>
                    <Box></Box>
                  </Badge>
                </Box>
              </IconButton>
            </Box>
            <IconButton
              onClick={handleLogout}
              sx={{
                display: "flex",
                flexDirection: "row",
                backgroundColor: "#fff",
                width: "100%",
                borderRadius: "0.75rem",
                padding: "10px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  gap: "1rem",
                }}
              >
                <LogoutRoundedIcon sx={{ color: dark, fontSize: "30px" }} />
                <Typography fontSize={"20px"} color={dark}>
                  Log out
                </Typography>
              </Box>
            </IconButton>
          </Box>
        </SlidingMenu>
      </Slide>
    </Box>
  );
};

export default HomeHeaderMobile;
