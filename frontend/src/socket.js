import { io } from "socket.io-client";

// connect to your backend
const socket = io("http://localhost:3000", {
  transports: ["websocket"],
});

export default socket;
