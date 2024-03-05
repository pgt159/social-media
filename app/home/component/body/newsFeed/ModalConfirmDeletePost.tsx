import { serviceCreatePost, serviceDeletePost } from "@/app/home/store/service";
import { Box, Button, Fade, Modal, Typography } from "@mui/material";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import Backdrop from "@mui/material/Backdrop";
import { IPost } from "@/app/home/type";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "@/app/firebase/firebaseConfig";
import { toast } from "react-toastify";

const ModalConfirmDeletePost = ({
  isOpen,
  setIsOpen,
  post,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  post: IPost;
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      return serviceDeletePost(post._id);
    },
    onSettled: () => {
      if (post.picturePath) {
        const imageRef = ref(storage, post.picturePath);
        deleteObject(imageRef)
          .then()
          .catch((error) => console.log(error));
      }
      setTimeout(() => {
        queryClient.invalidateQueries(["posts"]);
        toast.success("Delete post successfully", {
          toastId: "delete_post",
        });
      }, 100);
    },
  });

  const handleClose = () => {
    setIsOpen(false);
  };

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 300,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 3,
    borderRadius: "0.75rem",
  };

  const handleDeletePost = async () => {
    try {
      mutation.mutate();
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
        <Box sx={style}>
          <Typography
            id="transition-modal-title"
            variant="h4"
            component="h4"
            fontWeight={"500"}
          >
            Delete post
          </Typography>
          <Typography id="transition-modal-description" sx={{ mt: 2 }}>
            Are you sure to delete this post?
          </Typography>
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
              onClick={handleDeletePost}
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

export default ModalConfirmDeletePost;
