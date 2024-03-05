export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://social-media-server-w8cl.onrender.com/api/v1"
    : "http://localhost:8000/api/v1";
