// src/utils/socket.js
import { io } from "socket.io-client";

// ✅ Initialize a single reusable socket connection
export const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// ✅ Optional debugging (you can remove in production)
socket.on("connect", () => {
  console.log("🟢 Connected to socket server:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.warn("🔴 Socket disconnected:", reason);
});

socket.on("connect_error", (err) => {
  console.error("⚠️ Socket connection error:", err.message);
});
