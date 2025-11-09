import express from "express";
import ChatSession from "../models/chat.js";

const router = express.Router();

// 1️⃣ Start Chat (User triggers)
router.post("/start", async (req, res) => {
  try {
    const { userId, panditId } = req.body;
    if (!userId || !panditId) {
      return res.status(400).json({ success: false, message: "Missing IDs" });
    }

    const roomId = `user_${userId}_pandit_${panditId}`;

    let session = await ChatSession.findOne({ roomId });
    if (!session) {
      session = await ChatSession.create({ userId, panditId, roomId });
      console.log("🆕 Created new chat session:", session._id);
    } else {
      console.log("♻️ Reused existing chat session:", session._id);
    }

    return res.status(200).json({ success: true, roomId, session });
  } catch (error) {
    console.error("❌ Error starting chat:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 2️⃣ Pandit Joins Chat
router.post("/join", async (req, res) => {
  try {
    const { panditId, roomId } = req.body;
    const session = await ChatSession.findOneAndUpdate(
      { panditId, roomId },
      { isActive: true },
      { new: true }
    );

    if (!session)
      return res.status(404).json({ success: false, message: "Chat not found" });

    // Notify both clients through socket
    req.io.to(roomId).emit("chat_active", { roomId });

    res.status(200).json({ success: true, session });
  } catch (err) {
    console.error("❌ Error joining chat:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
