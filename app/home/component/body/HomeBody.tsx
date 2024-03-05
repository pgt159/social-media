"use client";

import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const HomeBody = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full py-[1.5rem] px-[6%] flex gap-[1rem] justify-between md:flex-row flex-col box-border h-full flex-1 overflow-scroll bg-bDefault">
      <div className="md:w-[26%]">{children[0]}</div>
      <div className="md:w-[46%]">{children[1]}</div>
      <div className="md:w-[26%]">{children[2]}</div>
    </div>
  );
};

export default HomeBody;
