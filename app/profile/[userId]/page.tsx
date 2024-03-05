"use client";
import MainLayout from "@/app/components/layout/MainLayout";
import React, { useEffect } from "react";
import ProfileBody from "../components/ProfileBody";
import GeneralInfo from "@/app/home/component/body/generalInfo/GeneralInfo";
import NewsFeed from "@/app/home/component/body/newsFeed/NewsFeed";
import { useQuery } from "react-query";
import { serviceGetUser } from "@/app/home/store/service";
import { useAppSelector } from "@/lib/hooks";

const UserProfile = ({ params }) => {
  const { data, status } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await serviceGetUser({ userId: params.userId });
      return res.data.data;
    },
  });
  const me = useAppSelector((state) => state.auth.user);
  return (
    <MainLayout>
      <ProfileBody>
        <div className="md:w-[26%]">
          <GeneralInfo isMe={me?._id === data?._id} user={data} />
        </div>
        <div className="md:w-[50%]">
          <NewsFeed userId={params.userId} />
        </div>
      </ProfileBody>
    </MainLayout>
  );
};

export default UserProfile;
