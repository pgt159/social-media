import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import { textAlign } from "@mui/system";
import Image from "next/image";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { storage } from "@/app/firebase/firebaseConfig";
import { v4 } from "uuid";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { authUpdateUser } from "@/lib/features/auth/authSlice";
import { updateUser } from "@/app/home/store/service";
import { toast } from "react-toastify";
import { usePathname, useRouter } from "next/navigation";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  // width: 400,
  bgcolor: "background.paper",
  borderRadius: "1rem",
  pt: 2,
  px: 4,
  pb: 3,
};
const ModalUploadImage = ({
  open,
  setOpen,
  image,
  onSelectFile,
  selectedFile,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  image: string;
  onSelectFile: (e: any) => void;
  selectedFile: any;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { user, accessToken } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const pathname = usePathname();

  const handleChangeAvatar = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      if (open && selectedFile) {
        let imageUrl = null;
        const imageRef = ref(storage, `user/${v4()}${selectedFile}`);
        const resUpload = await uploadBytes(imageRef, selectedFile);
        imageUrl = await getDownloadURL(imageRef);
        if (imageUrl) {
          const result = await updateUser({ picturePath: imageUrl });
          if (result.status === 200 && result.data.data) {
            const oldImage = ref(storage, user?.picturePath);
            deleteObject(oldImage).then(() => {
              console.log("CHANGE SUCCESS, FILE DELETED");
              dispatch(
                authUpdateUser({
                  user: {
                    ...result.data.data,
                  },
                  accessToken,
                })
              );
            });
            toast.success(
              "Update user avatar successfully, reload to apply changes",
              {
                toastId: "update_avatar",
              }
            );
            setOpen(null);
            router.replace(pathname);
          } else {
            toast.success("Update user avatar failed", {
              toastId: "update_avatar",
            });
            deleteObject(imageRef).then(() => {
              console.log("CHANGE FAIL, FILE DELETED");
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Modal
      open={open}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <Box
        sx={{ ...style }}
        className="w-[80%] md:w-[500px] flex flex-col justify-center items-center gap-4 relative"
      >
        <Typography
          fontWeight={"700"}
          fontSize={28}
          sx={{
            width: "100%",
            textAlign: "center",
          }}
        >
          Update avatar
        </Typography>
        <IconButton
          className="absolute top-4 right-4 p-4"
          onClick={() => onSelectFile(null)}
        >
          <CloseIcon className="scale-150" />
        </IconButton>
        <Box className="w-[80%] relative aspect-square">
          <Image
            alt={"preview_image"}
            src={image}
            className="rounded-full"
            sizes="(max-width: 768px) 70vw, 500px"
            style={{ objectFit: "cover" }}
            fill
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "20px",
            paddingTop: "20px",
          }}
        >
          <Button className="bg-pLight text-pDark text-[10px] md:text-[14px] p-4 rounded-md hover:opacity-80 transition-all relative">
            Choose another image
            <input
              type="file"
              accept="image/png, image/jpeg"
              className="opacity-0 absolute inset-0 z-20 cursor-pointer"
              onChange={(e) => {
                onSelectFile(e);
              }}
            />
          </Button>
          <Button
            className={`bg-pMain text-[#fff] text-[10px] md:text-[14px] p-4 rounded-md hover:opacity-80 transition-all ${
              isLoading ? "opacity-70" : ""
            }`}
            disabled={isLoading}
            onClick={handleChangeAvatar}
          >
            {isLoading ? (
              <div className=" h-full aspect-square border-solid border-2 border-[#fff] border-l-[rgba(0,0,0,0)] animate-spin rounded-full" />
            ) : null}
            Change avatar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalUploadImage;
