"use context";
import { createContext, useContext, useEffect, useMemo } from "react";
import io from "socket.io-client";
import { ENDPOINT } from "../home/configs/constants";
import { useAppSelector } from "@/lib/hooks";

const SocketContext = createContext(null);
export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAppSelector((state) => state.auth);
  const socket = useMemo(() => io(ENDPOINT), []);

  useEffect(() => {
    if (!user || !socket) return;
    socket.emit("setup", user);
    return () => {
      console.log("returned");
      socket.off("connected");
      socket.off("setup");
    };
  }, [user, socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
