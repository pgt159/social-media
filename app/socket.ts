import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  process.env.NODE_ENV === "production"
    ? "https://social-media-server-w8cl.onrender.com/"
    : "http://localhost:8000";

export const socket = io(URL);
