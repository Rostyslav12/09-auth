import axios from "axios";

export const api = axios.create({
  baseURL: "https://notehub-api.goit.study/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
