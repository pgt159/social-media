import MainLayout from "../components/layout/MainLayout";
import HomeBody from "./component/body/HomeBody";
import Contacts from "./component/body/contacts/Contacts";
import GeneralInfo from "./component/body/generalInfo/GeneralInfo";
import NewsFeed from "./component/body/newsFeed/NewsFeed";

export default function HomePage() {
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
