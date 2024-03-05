import MainLayout from "../components/layout/MainLayout";
import NotificationBody from "./components/NotificationBody";

export default function NotificationPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
