"use client";
import {
  Box,
  Grow,
  IconButton,
  Link,
  MenuList,
  Paper,
  Popper,
  Typography,
  useTheme,
  ClickAwayListener,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpRoundedIcon from "@mui/icons-material/ThumbUpRounded";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";

import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import { IPost } from "@/app/home/type";
import { useAppSelector } from "@/lib/hooks";
import { serviceLikePost } from "@/app/home/store/service";
import ModalConfirmDeletePost from "./ModalConfirmDeletePost";
import ModalUpdatePost from "./ModalUpdatePost";
import ModalDetailPost from "./ModalDetailPost";

const Post = ({ item }: { item: IPost }) => {
  const [postItem, setPostItem] = useState<IPost>(item);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const [openDetail, setOpenDetail] = useState<boolean>(false);

  const theme = useTheme();
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [openReaction, setOpenReaction] = useState<boolean>(false);
  const anchorRef = useRef();
  const reactionAnchorRef = useRef();
  const isDesktop = useMediaQuery("(min-width: 1200px)");
  const user = useAppSelector((state) => state.auth.user);

  const handleReactPost = async (type: "haha" | "like" | "sad" | "love") => {
    try {
      setOpenReaction(false);
      const res = await serviceLikePost({
        postId: item?._id,
        type,
      });
      if (res.status === 200) {
        setPostItem({ ...postItem, likes: res.data.data.likes });
      }
    } catch (error) {
      console.log(error);
    }
  };

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
        // maxHeight: "100%",
        marginBlock: "1rem",
        gap: "1rem",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "1rem",
          cursor: "pointer",
          width: "auto",
        }}
        onClick={() => {}}
      >
        <Image
          src={item?.userPicturePath || "/static/images/default-avatar.jpg"}
          width={50}
          height={50}
          alt={"user_avatar"}
          className="rounded-full"
        />
        <Box
          sx={{
            flex: 1,
          }}
        >
          <Typography variant="h5" className="text-nMain font-semibold]">
            {item?.firstName || "" + item?.lastName || ""}
          </Typography>
          <Typography variant="h5" className="text-nMedium" fontSize={"12px"}>
            {item?.location}
          </Typography>
        </Box>
        {user?._id === item?.userId ? (
          <Box
            sx={{
              position: "relative",
            }}
          >
            <IconButton
              className="rounded-full h-auto aspect-square"
              onClick={(prev) => setOpenMenu(true)}
              ref={anchorRef}
            >
              <MoreHorizIcon />
              <Popper
                open={openMenu}
                anchorEl={anchorRef.current}
                placement="bottom-start"
                transition
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === "bottom-start"
                          ? "left top"
                          : "left bottom",
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={() => setOpenMenu(false)}>
                        <MenuList
                          autoFocusItem={openMenu}
                          id="composition-menu"
                          aria-labelledby="composition-button"
                        >
                          <MenuItem
                            onClick={() => {
                              if (user?._id !== item?.userId) return;
                              setOpenUpdate(true);
                              setOpenMenu(false);
                            }}
                          >
                            Update post
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              if (user?._id !== item?.userId) return;
                              setOpenDelete(true);
                              setOpenMenu(false);
                            }}
                          >
                            Delete post
                          </MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </IconButton>
          </Box>
        ) : null}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
        }}
      >
        <Typography className="text-nMain">{item?.description}</Typography>
        {item?.picturePath ? (
          <Box
            sx={{
              width: "100%",
              aspectRatio: 1,
              display: "flex",
              position: "relative",
              borderRadius: "0.5rem",
              overflow: "hidden",
            }}
          >
            <Image
              src={item?.picturePath}
              alt="post_media"
              fill
              sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
              priority={true}
            />
          </Box>
        ) : null}
        <Box
          sx={{
            mt: "0.25rem",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Box
            display={"flex"}
            flexDirection={"row"}
            alignItems={"center"}
            gap={"1rem"}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "0.3rem",
                alignItems: "center",
              }}
            >
              <IconButton
                sx={{
                  borderRadius: "50%",
                }}
                onMouseEnter={() =>
                  setTimeout(() => setOpenReaction(true), isDesktop ? 300 : 0)
                }
                onMouseLeave={() => {
                  setTimeout(
                    () => {
                      setOpenReaction(false);
                    },
                    isDesktop ? 500 : 0
                  );
                }}
                ref={reactionAnchorRef}
                onClick={() =>
                  handleReactPost(postItem?.likes[user?._id] || "like")
                }
              >
                {!postItem?.likes[user?._id] ? (
                  <ThumbUpOutlinedIcon />
                ) : postItem?.likes[user?._id] === "like" ? (
                  <ThumbUpRoundedIcon className="text-pMain" />
                ) : postItem?.likes[user?._id] === "love" ? (
                  <div className="text-[16px]">❤️</div>
                ) : postItem?.likes[user?._id] === "haha" ? (
                  <div className="text-[16px]">😂</div>
                ) : (
                  <div className="text-[16px]">😞</div>
                )}
                <Popper
                  open={openReaction}
                  anchorEl={reactionAnchorRef.current}
                  placement="bottom-start"
                  transition
                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{
                        transformOrigin:
                          placement === "bottom-start"
                            ? "left top"
                            : "left bottom",
                      }}
                    >
                      <Paper
                        sx={{
                          borderRadius: "2rem",
                          padding: "0.1rem",
                        }}
                      >
                        <ClickAwayListener
                          onClickAway={() => setOpenReaction(false)}
                        >
                          <MenuList
                            autoFocusItem={openMenu}
                            id="composition-menu"
                            aria-labelledby="composition-button"
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              gap: "0.5rem",
                              borderRadius: "50%",
                              padding: 0,
                            }}
                          >
                            <MenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReactPost("like");
                              }}
                              sx={{
                                fontSize: "20px",
                                borderRadius: "50%",
                                aspectRatio: 1,
                              }}
                            >
                              👍
                            </MenuItem>
                            <MenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReactPost("love");
                              }}
                              sx={{
                                fontSize: "20px",
                                borderRadius: "50%",
                                aspectRatio: 1,
                              }}
                            >
                              ❤️
                            </MenuItem>
                            <MenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReactPost("sad");
                              }}
                              sx={{
                                fontSize: "20px",
                                borderRadius: "50%",
                                aspectRatio: 1,
                              }}
                            >
                              😞
                            </MenuItem>
                            <MenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReactPost("haha");
                              }}
                              sx={{
                                fontSize: "20px",
                                borderRadius: "50%",
                                aspectRatio: 1,
                              }}
                            >
                              😂
                            </MenuItem>
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </IconButton>
              <Typography>{Object.keys(postItem.likes).length}</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "0.3rem",
                alignItems: "center",
              }}
            >
              <IconButton
                sx={{
                  borderRadius: "50%",
                }}
                onClick={() => setOpenDetail(true)}
              >
                <ChatBubbleOutlineOutlinedIcon />
              </IconButton>
              <Typography>{item?.comments || 0}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <ModalConfirmDeletePost
        isOpen={openDelete}
        setIsOpen={setOpenDelete}
        post={item}
      />
      <ModalUpdatePost
        isOpen={openUpdate}
        setIsOpen={setOpenUpdate}
        post={item}
      />
      <ModalDetailPost
        isOpen={openDetail}
        setIsOpen={setOpenDetail}
        post={item}
      />
    </Box>
  );
};

export default Post;
