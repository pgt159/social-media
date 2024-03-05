import axios from "axios";
import { BASE_URL } from "../config/api";
const apiMethod = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json,application/x-www-form-urlencoded,text/plain,*/*",
    "Content-Type": "application/json;charset=utf-8",
  },
});

export default apiMethod;
