// src/libs/socket.js
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_SOCKET_URL;
const token = localStorage.getItem("token");

export const socket = io(BASE_URL, {
  extraHeaders: {
    Authorization: `Bearer ${token}`,
  },
  autoConnect: false,
});
