// @ts-nocheck
"use client";

import {
  Box,
  Button,
  Divider,
  IconButton,
  Typography,
  styled,
} from "@mui/material";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import BusinessCenterRoundedIcon from "@mui/icons-material/BusinessCenterRounded";
import FacebookLogo from "@/public/static/svgs/FacebookLogo";
import LinkedinLogo from "@/public/static/svgs/LinkedinLogo";
import BlockDivider from "../BlockDivider";
import { useAppSelector } from "@/lib/hooks";
import { IUser } from "@/app/profile/type";
import BodyWrapper from "@/app/components/share/BodyWrapper";
import ModalUploadImage from "./ModalUpdloadImage";
import EditIcon from "@mui/icons-material/Edit";
import ModalUpdateProfile from "./ModalUpdateProfile";

const GeneralInfo = ({ user, isMe }: { user?: IUser; isMe: boolean }) => {
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);

  const router = useRouter();
  const pathname = usePathname();
  const auth = useAppSelector((state) => state.auth);
  const currentUser = isMe ? auth?.user : user;
  const isProfilePage = pathname.startsWith("/profile");
  const avatarImageRef = useRef(null);

  const fullName = `${currentUser?.firstName || ""} ${
    currentUser?.lastName || ""
  }`;
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (e) => {
    if (!e?.target?.files || e?.target?.files?.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    setSelectedFile(e.target.files[0]);
  };

  const goToProfile = () => {
    if (isProfilePage) return;
    router.push(`/profile/${currentUser?._id}`);
  };

  return (
    <BodyWrapper sx={{}}>
      {isProfilePage && currentUser?._id === auth.user?._id ? (
        <BlockDivider
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "1rem",
            flex: 1,
            width: "100%",
            paddingBottom: "0.75rem",
          }}
        >
          <Button
            component="label"
            tabIndex={-1}
            sx={{
              padding: 0,
              backgroundColor: "rgba(0,0,0,0)",
              boxShadow: "none",
            }}
            className="hover:bg-none relative cursor-pointer"
          >
            <Image
              alt={"user_image"}
              src={user?.picturePath || "/static/images/default-avatar.jpg"}
              height={50}
              width={50}
              style={{
                objectFit: "cover",
              }}
              className="rounded-full cursor-pointer"
            />
            <input
              type="file"
              ref={avatarImageRef}
              accept="image/png, image/jpeg"
              className="opacity-0 absolute inset-0 z-20 cursor-pointer"
              onChange={(e) => {
                onSelectFile(e);
              }}
            />
          </Button>

          <Box
            sx={{
              display: "block",
              flex: 1,
              overflow: "hidden",
              flexDirection: "column",
              gap: "0.75rem",
              alignItems: "flex-start",
              textOverflow: "truncate",
            }}
          >
            <Typography
              fontSize={16}
              className="text-nDark line-clamp-1 text-left"
            >
              {fullName}
            </Typography>
            <Typography className="text-nMedium line-clamp-1 text-left">
              {currentUser?.friend?.length} friends
            </Typography>
          </Box>
        </BlockDivider>
      ) : (
        <IconButton
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            borderRadius: "0.5rem",
            flex: 1,
            overflow: "hidden",
            marginBottom: "1.1rem",
          }}
          onClick={goToProfile}
        >
          <BlockDivider
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "1rem",
              flex: 1,
              width: "100%",
              paddingBottom: 0,
            }}
          >
            <Image
              alt={"user_image"}
              src={
                currentUser?.picturePath || "/static/images/default-avatar.jpg"
              }
              height={50}
              width={50}
              className="rounded-full"
            />

            <Box
              sx={{
                display: "block",
                flex: 1,
                overflow: "hidden",
                flexDirection: "column",
                gap: "0.75rem",
                alignItems: "flex-start",
                textOverflow: "truncate",
              }}
            >
              <Typography
                fontSize={16}
                className="text-nDark line-clamp-1 text-left"
              >
                {fullName}
              </Typography>
              <Typography className="text-nMedium line-clamp-1 text-left">
                {currentUser?.friend?.length} friends
              </Typography>
            </Box>
          </BlockDivider>
        </IconButton>
      )}
      <Divider />
      <BlockDivider
        sx={{
          paddingTop: "1.1rem",
          gap: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "1rem",
            alignItems: "center",
            marginBottom: "0.5rem",
          }}
        >
          <LocationOnRoundedIcon className="text-nMain text-[25px]" />
          <Typography className="text-nMedium line-clamp-1">
            {currentUser?.location}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <BusinessCenterRoundedIcon className="text-nMain text-[25px]" />
          <Typography className="text-nMedium line-clamp-1">
            {currentUser?.occupation}
          </Typography>
        </Box>
      </BlockDivider>
      <Divider />

      <BlockDivider
        sx={{
          paddingTop: "1.1rem",
          gap: 0,
        }}
      >
        <Typography className="text-nMain mb-[1rem] text-[1rem]">
          Social Profiles
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Link
            style={{
              width: "100%",
              textDecoration: "none",
              marginBottom: "0.5rem",
            }}
            href={
              currentUser?.linkFb
                ? `https://${currentUser?.linkFb?.replace("https://", "")}`
                : "#"
            }
          >
            <IconButton
              sx={{
                gap: "1rem",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                borderRadius: "0.5rem",
                justifyContent: "flex-start",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  width: "25px",
                  aspectRatio: 1,
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <FacebookLogo color={"#A3A3A3"} />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                }}
              >
                <Typography fontWeight={"500"} className="text-nMain text-left">
                  Facebook
                </Typography>
                <Typography className="text-nMedium text-left line-clamp-1 text-ellipsis">
                  {currentUser?.linkFb || "Not available"}
                </Typography>
              </Box>
            </IconButton>
          </Link>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Link
            style={{
              width: "100%",
              textDecoration: "none",
            }}
            href={
              currentUser?.linkLinkedin
                ? `https://${currentUser?.linkLinkedin?.replace(
                    "https://",
                    ""
                  )}`
                : "#"
            }
          >
            <IconButton
              sx={{
                gap: "1rem",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                borderRadius: "0.5rem",
                justifyContent: "flex-start",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  width: "25px",
                  aspectRatio: 1,
                  overflow: "hidden",
                }}
              >
                <LinkedinLogo color={"#A3A3A3"} />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                }}
              >
                <Typography
                  // color={theme.palette.neutral.main}
                  // fontWeight={"500"}
                  textAlign={"left"}
                  className="text-nMain text-left"
                >
                  Linkedin
                </Typography>
                <Typography
                  // color={theme.palette.neutral.medium}
                  className="text-nMedium text-left line-clamp-1 text-ellipsis"
                  textAlign={"left"}
                >
                  {currentUser?.linkLinkedin || "Not available"}
                </Typography>
              </Box>
            </IconButton>
          </Link>
        </Box>
      </BlockDivider>
      {isProfilePage && currentUser?._id === auth.user?._id ? (
        <BlockDivider>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              cursor: "pointer",
              width: "100%",
              justifyContent: "center",
              gap: "1rem",
            }}
            className={"hover:scale-105 transition-all"}
            onClick={() => setOpenUpdate(true)}
          >
            <EditIcon style={{ color: "#A3A3A3" }} />
            <Typography className="text-nMain">Edit profile</Typography>
          </div>
        </BlockDivider>
      ) : null}
      <ModalUploadImage
        open={!!preview}
        setOpen={setPreview}
        image={preview}
        selectedFile={selectedFile}
        onSelectFile={onSelectFile}
      />
      <ModalUpdateProfile
        open={openUpdate}
        setOpen={setOpenUpdate}
        user={currentUser}
      />
    </BodyWrapper>
  );
};

export default GeneralInfo;
