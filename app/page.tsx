import "./styles/home.module.scss";
import MainLayout from "./components/layout/MainLayout";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Home({ children }) {
  return <MainLayout>{children}</MainLayout>;
}
