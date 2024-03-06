import { serviceUpdatePost } from "@/app/home/store/service";
import { IPost } from "@/app/home/type";
import {
  Backdrop,
  Box,
  Button,
  Fade,
  InputBase,
  Modal,
  Typography,
} from "@mui/material";
import Image from "next/image";
import React, { useRef } from "react";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

const ModalUpdatePost = ({
  isOpen,
  setIsOpen,
  post,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  post: IPost;
}) => {
  const queryClient = useQueryClient();
  const inputRef = useRef(null);

  const handleClose = () => {
    setIsOpen(false);
  };

  const mutation = useMutation({
    mutationFn: ({ description }: { description: string }) => {
      return serviceUpdatePost({ description, postId: post?._id });
    },
    onSettled: (returnedData) => {
      if (typeof queryClient.getQueryData("posts") !== "object") return;
      const existingPosts = queryClient.getQueryData("posts") as any[];
      const updatedPostIndex = existingPosts.findIndex((item) => {
        return item?._id === post?._id;
      });
      existingPosts[updatedPostIndex] = returnedData.data.data;
      queryClient.setQueryData(["posts"], existingPosts);
      toast.success("Update post successfully", {
        toastId: "update_post",
      });
    },
  });

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 3,
    borderRadius: "0.75rem",
  };

  const handleUpdatePost = async () => {
    try {
      mutation.mutate({
        description: inputRef?.current?.value || "",
      });
      setIsOpen(false);
    } catch (error) {
      console.log(error);
    } finally {
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
          >
            Update post
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              flex: 1,
              overflow: "scroll",
            }}
            className="bg-[#ededed] my-5 p-2 rounded-lg"
          >
            <InputBase
              defaultValue={post?.description || ""}
              placeholder="Description of your post..."
              inputRef={inputRef}
              sx={{
                padding: "0.5rem",
              }}
            />
            {post?.picturePath ? (
              <Box
                sx={{
                  width: "100%",
                  aspectRatio: 1,
                  display: "flex",
                  position: "relative",
                  borderRadius: "0.5rem",
                }}
              >
                <Image
                  src={post?.picturePath}
                  alt="post_media"
                  fill
                  sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: "contain", borderRadius: "0.5rem" }}
                  priority={true}
                />
              </Box>
            ) : null}
          </Box>
          <Box
            sx={{
              mt: 4,
              display: "flex",
              flexDirection: "row",
              gap: "1rem",
              justifyContent: "flex-end",
            }}
          >
            <Button
              className="text-pDark"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={mutation?.isLoading}
              onClick={handleUpdatePost}
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "0.5rem",
              }}
            >
              {mutation?.isLoading ? (
                <div className="h-full aspect-square box-border border-2 border-pMain border-l-[rgba(0,0,0,0)] animate-spin border-solid rounded-full" />
              ) : null}
              <Typography>Confirm</Typography>
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ModalUpdatePost;
