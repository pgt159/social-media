import { ENVIRONMENT } from "@/app/config/constants";

export const ENDPOINT =
  ENVIRONMENT === "development"
    ? "https://social-media-server-w8cl.onrender.com:8000/"
    : "http://localhost:8000";
