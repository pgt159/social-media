import React from "react";
import MainLayout from "../components/layout/MainLayout";

const MessageMobileLayout = ({ children }: { children: React.ReactNode }) => {
  return <MainLayout>{children}</MainLayout>;
};

export default MessageMobileLayout;
