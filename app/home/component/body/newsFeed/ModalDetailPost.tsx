import { IComment, IPost } from "@/app/home/type";
import { useAppSelector } from "@/lib/hooks";
import {
  Backdrop,
  Box,
  Button,
  Divider,
  Fade,
  IconButton,
  InputBase,
  Modal,
  Typography,
} from "@mui/material";
import Image from "next/image";
import React, { useRef, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  serviceCreateComment,
  serviceGetComment,
} from "@/app/home/store/service";
import Empty from "@/app/components/empty/Empty";
import CommentItem from "./CommentItem";

const PAGE_LIMIT = 50;

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  //   p: 3,
  borderRadius: "0.75rem",
};

const ModalDetailPost = ({
  isOpen,
  setIsOpen,
  post,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  post: IPost;
}) => {
  const [page, setPage] = useState<number>(0);
  const queryClient = useQueryClient();
  const inputRef = useRef(null);

  const { data, status } = useQuery({
    queryKey: ["comments", post?._id],
    queryFn: async () => {
      const res = await serviceGetComment({
        page,
        limit: PAGE_LIMIT,
        postId: post?._id,
      });

      return res;
    },
    staleTime: Infinity,
  });

  const mutation = useMutation({
    mutationFn: async ({ content }: { content: string }) => {
      return serviceCreateComment({ postId: post?._id, content });
    },
    onSettled: () => {
      inputRef.current.value = "";
      setTimeout(() => {
        queryClient.invalidateQueries(["comments", post?._id]);
      }, 100);
      setTimeout(() => {
        if (typeof queryClient.getQueryData("posts") !== "object") return;
        const existingPosts = queryClient.getQueryData("posts") as any[];
        const updatedPostIndex = existingPosts.findIndex((item) => {
          return item?._id === post?._id;
        });
        existingPosts[updatedPostIndex] = {
          ...existingPosts[updatedPostIndex],
          comments: Number((existingPosts[updatedPostIndex].comments || 0) + 1),
        };
        queryClient.setQueryData("posts", existingPosts);
      }, 100);
    },
  });

  const user = useAppSelector((state) => state.auth.user);
  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSendComment = async () => {
    try {
      if (!inputRef.current?.value) return;
      const res = await mutation.mutate({
        content: inputRef.current?.value || "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={isOpen}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={isOpen}>
        <Box
          sx={style}
          className="md:w-[600px] w-[80%] max-h-[80%] flex flex-col"
        >
          <Typography
            id="transition-modal-title"
            variant="h4"
            component="h4"
            fontWeight={"500"}
            className="text-nDark"
            sx={{
              width: "100%",
              textAlign: "center",
              p: 3,
              boxSizing: "border-box",
            }}
          >
            {`Post's comments`}
          </Typography>
          <Divider className="border-nDark" />
          <Box
            sx={{
              maxHeight: "80%",
              overflow: "scroll",
              display: "flex",
              p: 3,
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            {data?.data?.data?.length > 0 ? (
              data?.data?.data?.map((item: IComment) => (
                <CommentItem item={item} key={item?._id} />
              ))
            ) : (
              <Empty title="Be the first one to give comment to this post!" />
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "0.5rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "1rem",
                p: 3,
                alignItems: "flex-start",
                width: "100%",
              }}
              onClick={() => {}}
            >
              <Image
                src={user?.picturePath || "/static/images/default-avatar.jpg"}
                width={35}
                height={35}
                alt={"user_avatar"}
                className="rounded-full"
              />
              <InputBase
                placeholder="Comment something..."
                sx={{
                  backgroundColor: "#e7e7e7",
                  padding: "0.5rem",
                  borderRadius: "0.75rem",
                  flex: 1,
                  paddingInline: "1rem",
                }}
                inputProps={{
                  ref: inputRef,
                }}
                onKeyDown={(e) => {
                  if (e?.code === "Enter") {
                    handleSendComment();
                  }
                }}
              />
              <IconButton className={`text-pDark`} onClick={handleSendComment}>
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ModalDetailPost;
