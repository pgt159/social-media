"use client";
import { serviceConfirmFriendRequest } from "@/app/home/store/service";
import { Button } from "@mui/material";
import React, { useState } from "react";
import { IFriendRequest } from "../SlidingMenuNoti";
import { useAppDispatch } from "@/lib/hooks";
import { authFetchMe } from "@/lib/features/auth/authSlice";
import { getToken } from "@/app/utils/auth";

const FriendConfirmButton = ({
  isAccept,
  item,
  cb,
}: {
  isAccept: boolean;
  item: IFriendRequest;
  cb: () => void;
}) => {
  const dispatch = useAppDispatch();
  const { access_token } = getToken();

  const [loading, setLoading] = useState<boolean>(false);
  const handleConfirmFriendRequest = async (id: string, isAccept: boolean) => {
    setLoading(true);
    try {
      const result = await serviceConfirmFriendRequest(id, isAccept);
      if (result?.status === 201) {
        cb();
        if (isAccept) {
          dispatch(authFetchMe(access_token));
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      sx={{
        flex: 1,
        borderRadius: "9px",
        padding: "10px",
        textTransform: "none",
      }}
      className={`text-[18px] md:text-[16px] ${
        isAccept
          ? "bg-pMain text-[#fff] hover:bg-pSub"
          : "text-[#fff]  bg-nMedium"
      }`}
      onClick={() => handleConfirmFriendRequest(item?._id, isAccept)}
    >
      {loading ? (
        <div
          className={`h-[80%] aspect-square border-[3px] border-l-[rgba(0,0,0,0)] ${
            isAccept ? "border-[#fff]" : "border-nMain"
          } border-solid rounded-full animate-spin `}
        />
      ) : isAccept ? (
        "Accept"
      ) : (
        "Remove"
      )}
    </Button>
  );
};

export default FriendConfirmButton;
