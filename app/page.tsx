import "./styles/home.module.scss";
import MainLayout from "./components/layout/MainLayout";
import { FC, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import HomeBody from "./home/component/body/HomeBody";
import GeneralInfo from "./home/component/body/generalInfo/GeneralInfo";
import NewsFeed from "./home/component/body/newsFeed/NewsFeed";
import { Contacts } from "@mui/icons-material";

export default function Home() {
  return (
    <MainLayout>
      <HomeBody>
        <GeneralInfo isMe={true} user={null} />
        <NewsFeed />
        <Contacts />
      </HomeBody>
    </MainLayout>
  );
}
