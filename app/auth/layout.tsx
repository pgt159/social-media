"use client";
import { Box, useTheme } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import HeaderAuth from "./components/share/HeaderAuth";
import { useAppSelector } from "@/lib/hooks";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    router.push("/");
  }, [user]);

  return (
    <div className="min-h-screen bg-bDefault pb-4">
      <HeaderAuth />
      {children}
    </div>
  );
};

export default AuthLayout;
