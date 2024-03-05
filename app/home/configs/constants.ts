import { ENVIRONMENT } from "@/app/config/constants";

export const ENDPOINT =
  ENVIRONMENT === "production"
    ? "https://social-media-server-w8cl.onrender.com:8080"
    : "http://localhost:8080";
