import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import panditRoutes from "./routes/panditRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

// Initialize Express
const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(errorHandler);

// Database
connectDB();

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/pandits", panditRoutes);
app.use("/api/chat", chatRoutes);

// ================================
// ⚡ SOCKET.IO SETUP
// ================================
// ================================
// ⚡ SOCKET.IO SETUP
// ================================
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Track active participants per chat room
const activeRooms = {}; // { roomId: { user: false, pandit: false } }

io.on("connection", (socket) => {
  console.log(`🟢 Client connected: ${socket.id}`);

  // ✅ Handle room join (User or Pandit)
  socket.on("join_room", ({ roomId, role }) => {
    socket.join(roomId);
    console.log(`📥 ${role} joined room: ${roomId}`);

    if (!activeRooms[roomId]) {
      activeRooms[roomId] = { user: false, pandit: false };
    }

    activeRooms[roomId][role] = true;

    // 🔔 Notify other side someone joined
    io.to(roomId).emit("participant_joined", { role, roomId });

    // ✅ If both sides joined, notify both
    if (activeRooms[roomId].user && activeRooms[roomId].pandit) {
      io.to(roomId).emit("chat_ready", { roomId });
      console.log(`✅ Room ${roomId} is ready for chat`);
    }
  });

  // ✅ Message broadcast
  socket.on("send_message", (data) => {
    console.log(`💬 Message from ${data.sender} in ${data.roomId}: ${data.message}`);
    io.to(data.roomId).emit("receive_message", data);
  });

  // ✅ Optional: typing indicator
  socket.on("typing", ({ roomId, sender }) => {
    socket.to(roomId).emit("typing", { sender });
  });

  // ✅ Handle disconnect
  socket.on("disconnect", () => {
    console.log(`🔴 Client disconnected: ${socket.id}`);
  });
});


// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
