// @ts-nocheck
"use client";
import {
  Box,
  Divider,
  IconButton,
  InputBase,
  styled,
  useTheme,
  Button,
  Typography,
} from "@mui/material";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { storage } from "@/app/firebase/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import BodyWrapper from "@/app/components/share/BodyWrapper";
import { serviceCreatePost } from "@/app/home/store/service";
import { useMutation, useQueryClient } from "react-query";
import { useAppSelector } from "@/lib/hooks";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";

const PostingArea = () => {
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [loading, setLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const user = useAppSelector((state) => state.auth.user);
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const inputRef = useRef();

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

  const Search = styled("div")({
    display: "flex",
    alignItems: "center",
    backgroundColor: neutralLight,
    padding: "1rem 2rem",
    borderRadius: "2rem",
    flex: 1,
  });

  const mutation = useMutation({
    mutationFn: (payload) => {
      serviceCreatePost(payload);
    },
    onError: (error) => {
      console.log(error);
    },
    onSettled: () => {
      setTimeout(() => {
        setSelectedFile(undefined);
        setPreview(undefined);
        queryClient.invalidateQueries(["posts"]);
        toast.success("Upload successfully", {
          toastId: "upload post success",
        });
      }, 100);
    },
  });

  const handlePost = async () => {
    if (mutation?.isLoading) return;
    try {
      let imageUrl = null;
      if (preview || selectedFile) {
        if (selectedFile) {
          const imageRef = ref(storage, `post/${v4()}${selectedFile}`);
          const resUpload = await uploadBytes(imageRef, selectedFile);
          imageUrl = await getDownloadURL(imageRef);
        }
      }
      mutation.mutate({
        description: inputRef?.current?.value || null,
        picturePath: imageUrl || null,
      });
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  return (
    <BodyWrapper sx={{ gap: "1rem" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "1rem",
        }}
      >
        <Image
          src={user?.picturePath || "/static/images/default-avatar.jpg"}
          width={60}
          height={60}
          className="rounded-full"
          alt="user_avatar"
        />
        <Search>
          <InputBase placeholder="What's on your mind..." inputRef={inputRef} />
        </Search>
      </Box>

      {preview ? (
        <Box className="w-[30%] md:w-[20%] relative aspect-square">
          <Image
            alt={"preview_image"}
            src={preview}
            className="rounded-lg"
            sizes="(max-width: 768px) 30vw, 150px"
            style={{ objectFit: "cover" }}
            fill
          />
          <IconButton
            className="bg-[#fff] rounded-full absolute top-2 right-2 "
            onClick={() => {
              setPreview(undefined);
              setSelectedFile(undefined);
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      ) : null}
      <Divider
        sx={{
          marginBlock: "1rem",
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <IconButton
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "0.5rem",
            borderRadius: "0.75rem",
            width: "30%",
          }}
          className="w-[50%] md:w-[30%]"
        >
          <AddPhotoAlternateIcon fontSize="large" />
          <Typography fontWeight={"500"}>Add photo</Typography>
          <input
            type="file"
            accept="image/png, image/jpeg"
            className="opacity-0 absolute inset-0 z-20 cursor-pointer"
            onChange={(e) => {
              onSelectFile(e);
            }}
          />
        </IconButton>
        <IconButton
          className={`bg-pMain text-bAlt hover:bg-pSub rounded-2xl flex flex-row gap-2 px-3 ${
            mutation?.isLoading ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={handlePost}
        >
          {mutation?.isLoading || loading ? (
            <div className="rounded-full border-2 border-solid border-[#fff] border-l-[rgba(0,0,0,0)] animate-spin w-3 aspect-square" />
          ) : (
            <SendRoundedIcon />
          )}
          <Typography className="text-bAlt">Post</Typography>
        </IconButton>
      </Box>
    </BodyWrapper>
  );
};

export default PostingArea;
