"use client";
import { Box, Divider } from "@mui/material";
import React from "react";
import PostingArea from "./PostingArea";
import Post from "./Post";
import Empty from "@/app/components/empty/Empty";
import { serviceGetNewsFeed } from "@/app/home/store/service";
import { useQuery } from "react-query";

const NewsFeed = ({ userId }: { userId?: string }) => {
  const { data, status } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await serviceGetNewsFeed({ userId });
      if (res?.status === 200) {
        return res?.data?.data;
      }
      return [];
    },
    staleTime: Infinity,
  });

  return (
    <Box
      sx={{
        height: "100%",
        overflow: "scroll",
      }}
    >
      <PostingArea />
      {status === "loading" ? (
        <div className="flex flex-col p-[1.5rem] rounded-xl bg-bAlt box-border w-full max-h-full my-[1rem] gap-4 justify-center items-center">
          <div className="w-8 h-8 rounded-full border-solid border-4 border-l-[rgba(0,0,0,0)] animate-spin border-pMain" />
        </div>
      ) : data?.length > 0 ? (
        data?.map((item, index) => (
          <Post key={item?._id || index} item={item} />
        ))
      ) : (
        <Empty title="Add something interesting to your news feed!" />
      )}
    </Box>
  );
};

export default NewsFeed;
