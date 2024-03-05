"use client";
import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  authRefreshToken,
  authUpdateUser,
} from "@/lib/features/auth/authSlice";
import { getToken, logout } from "@/app/utils/auth";
import HomeHeader from "@/app/home/component/header/HomeHeader";
import ChatBox from "@/app/home/component/body/contacts/ChatBox";
import { chatRoomFetch } from "@/lib/features/message/messSlice";
import { io } from "socket.io-client";
import { ENDPOINT } from "@/app/home/configs/constants";
import { SocketProvider } from "../SocketProvider";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const { user } = useAppSelector((state) => state.auth);
  const { activeMess } = useAppSelector((state) => state.mess);

  useEffect(() => {
    const { refresh_token, access_token } = getToken();
    if (!refresh_token) {
      dispatch(authUpdateUser({}));
      logout();
      router.push("/auth");
    }
    if (!user) {
      dispatch(authRefreshToken(refresh_token));
    } else {
      dispatch(
        authUpdateUser({
          user,
          accessToken: access_token,
        })
      );
      dispatch(chatRoomFetch({}));
    }
    if (pathname === "/" || pathname === "") {
      router.push("/home");
    }
  }, [user]);

  return (
    <SocketProvider>
      <div className="w-full h-screen pt-[73px] relative box-border flex">
        <HomeHeader />
        {children}
        <div className="fixed bottom-0 w-full overflow-auto pr-28 justify-end flex box-border gap-2">
          {activeMess?.length > 0
            ? activeMess?.map((item, index) => (
                <ChatBox key={item._id} item={item} />
              ))
            : null}
        </div>
      </div>
    </SocketProvider>
  );
};

export default MainLayout;
