// backend/server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "./models/Admin.js";
import ChatSession from "./models/chat.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import panditRoutes from "./routes/panditRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

// Create Express app
const app = express();

// Resolve current directory for static paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================================
// 🧠 Middleware
// ================================
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================================
// 💾 Connect Database
// ================================
connectDB();

// ================================
// 🔗 API Routes
// ================================
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/pandit", panditRoutes);
app.use("/api/chat", chatRoutes);

// Root test route
app.get("/", (req, res) => {
  res.send("AstroWeb Backend running successfully 🌠");
});

// ================================
// 🧩 TEMP ADMIN LOGIN ENDPOINT
// ================================
app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ message: "Username and password required" });

    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      admin: { id: admin._id, username: admin.username },
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================================
// ⚡ SOCKET.IO SETUP
// ================================
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

app.set("io", io);

// Track active participants per chat room
// Option A: keep chat history until chat END
const activeRooms = {}; // { roomId: { user: false, pandit: false } }

io.on("connection", (socket) => {
  console.log(`🟢 Client connected: ${socket.id}`);

  // Track which room and role this socket belongs to (for cleanup)
  socket.sessionInfo = { roomId: null, role: null };

  // join a room
  socket.on("join_room", async ({ roomId, role, userId, panditId }) => {
    try {
      if (!roomId || !role) return;

      socket.join(roomId);
      console.log(`📥 ${role} joined room: ${roomId} (socket: ${socket.id})`);

      // store room & role for cleanup on disconnect
      socket.sessionInfo.roomId = roomId;
      socket.sessionInfo.role = role;

      if (!activeRooms[roomId]) {
        activeRooms[roomId] = { user: false, pandit: false };
      }
      if (role === "user" || role === "pandit") {
        activeRooms[roomId][role] = true;
      }

      // Optional: you can attach the real userId/panditId to socket for reference
      if (userId) socket.data.userId = userId;
      if (panditId) socket.data.panditId = panditId;

      // Notify room that a participant joined
      io.to(roomId).emit("participant_joined", { role, roomId });

      // Emit chat_ready only when both participant flags are true
      if (activeRooms[roomId].user && activeRooms[roomId].pandit) {
        io.to(roomId).emit("chat_ready", { roomId });
        console.log(`✅ Room ${roomId} is ready for chat`);
      } else {
        // If only one participant is present, send a personal waiting event
        socket.emit("waiting_for_peer", { roomId });
      }
    } catch (err) {
      console.error("join_room error:", err);
    }
  });

  // send_message
  socket.on("send_message", async (data) => {
    try {
      if (!data || !data.roomId || !data.message) {
        console.warn("send_message missing required fields:", data);
        return;
      }

      let chatSession = await ChatSession.findOne({ roomId: data.roomId });

      if (!chatSession) {
        // Create session record (session becomes active when pandit accepts via REST)
        chatSession = await ChatSession.create({
          userId: data.userId || null,
          panditId: data.panditId || null,
          roomId: data.roomId,
          isActive: true,
          messages: [],
        });
      }

      const messageObj = {
        sender: data.senderName || data.sender || data.senderId || "unknown",
        text: data.message,
        time: new Date(),
      };

      chatSession.messages.push(messageObj);
      await chatSession.save();

      io.to(data.roomId).emit("receive_message", {
        roomId: data.roomId,
        sender: messageObj.sender,
        message: messageObj.text,
        time: messageObj.time,
        sessionId: chatSession._id,
      });
    } catch (err) {
      console.error("Error in send_message:", err);
    }
  });

  // typing indicator
  socket.on("typing", ({ roomId, sender }) => {
    try {
      if (!roomId) return;
      socket.to(roomId).emit("typing", { sender });
    } catch (err) {
      console.error("typing event error:", err);
    }
  });

  socket.on("pandit_status_update", (payload) => {
    io.emit("pandit_status_update", payload);
  });

  // If a client emits chat_ended (client-side emit after REST end or manual), forward to room
  socket.on("chat_ended", ({ roomId, endedBy = "peer" }) => {
    try {
      if (!roomId) return;
      io.to(roomId).emit("chat_ended", { roomId, endedBy });
    } catch (err) {
      console.error("chat_ended forward error:", err);
    }
  });

  // Cleanup on disconnect
  socket.on("disconnect", () => {
    console.log(`🔴 Client disconnected: ${socket.id}`);

    const { roomId, role } = socket.sessionInfo;

    if (roomId && activeRooms[roomId]) {
      if (role === "user" || role === "pandit") {
        activeRooms[roomId][role] = false;

        // Notify the other participant in room that someone left
        io.to(roomId).emit("participant_left", { role, roomId });
      }

      // If both disconnected, cleanup memory
      if (!activeRooms[roomId].user && !activeRooms[roomId].pandit) {
        delete activeRooms[roomId];
        console.log(`🧹 Cleaned empty room: ${roomId}`);
      }
    }
  });
});

// ================================
// 🚀 Start Server
// ================================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
