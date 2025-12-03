import express from "express";
import ChatSession from "../models/chat.js";
import ChatRequest from "../models/ChatRequest.js";

const router = express.Router();

/* ==================================================
   1️⃣ CREATE CHAT REQUEST (User → Pandit)
================================================== */
router.post("/request", async (req, res) => {
  try {
    const { userId, panditId, roomId } = req.body;

    if (!userId || !panditId) {
      return res.status(400).json({ success: false, message: "Missing ids" });
    }

    const finalRoomId = roomId || `user_${userId}_pandit_${panditId}`;

    const existing = await ChatRequest.findOne({
      userId,
      panditId,
      accepted: false,
    });

    if (existing) {
      return res.json({
        success: true,
        message: "Existing chat request found",
        request: existing,
      });
    }

    const reqObj = await ChatRequest.create({
      userId,
      panditId,
      roomId: finalRoomId,
      accepted: false,
    });

    res.json({
      success: true,
      message: "Chat request created",
      request: reqObj,
    });
  } catch (err) {
    console.error("❌ Chat request error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ==================================================
   2️⃣ START CHAT (User triggers chat start)
================================================== */
router.post("/start", async (req, res) => {
  try {
    const { userId, panditId } = req.body;

    if (!userId || !panditId) {
      return res.status(400).json({ success: false, message: "Missing IDs" });
    }

    const roomId = `user_${userId}_pandit_${panditId}`;

    let session = await ChatSession.findOne({ roomId });

    if (!session) {
      session = await ChatSession.create({
        userId,
        panditId,
        roomId,
        isActive: false,
        messages: [],
      });
      console.log("🆕 New chat session created:", session._id);
    }

    let existingReq = await ChatRequest.findOne({ userId, panditId });

    if (!existingReq) {
      await ChatRequest.create({
        userId,
        panditId,
        roomId,
        accepted: false,
      });
      console.log("📨 Chat request created");
    }

    return res.status(200).json({
      success: true,
      roomId,
      session,
      message: "Chat session ready",
    });
  } catch (error) {
    console.error("❌ Error starting chat:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ==================================================
   3️⃣ PANDIT ACCEPTS + JOINS CHAT
================================================== */
router.post("/join", async (req, res) => {
  try {
    const { panditId, roomId } = req.body;

    if (!panditId || !roomId) {
      return res.status(400).json({ success: false, message: "Missing data" });
    }

    await ChatRequest.findOneAndUpdate(
      { panditId, roomId },
      { accepted: true }
    );

    const session = await ChatSession.findOneAndUpdate(
      { panditId, roomId },
      { isActive: true },
      { new: true }
    );

    if (!session)
      return res.status(404).json({ success: false, message: "Chat not found" });

    console.log(`🟠 Pandit ${panditId} joined chat room ${roomId}`);

    res.status(200).json({
      success: true,
      session,
      message: "Chat activated successfully",
    });
  } catch (err) {
    console.error("❌ Error joining chat:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ==================================================
   4️⃣ GET CHAT HISTORY
================================================== */
router.get("/history/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;

    const session = await ChatSession.findOne({ roomId });

    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Chat session not found" });
    }

    res.status(200).json({
      success: true,
      roomId,
      messages: session.messages || [],
    });
  } catch (err) {
    console.error("❌ Error fetching history:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ==================================================
   5️⃣ END CHAT SESSION (User or Pandit ends chat)
================================================== */
router.post("/end-session", async (req, res) => {
  try {
    const { roomId } = req.body;

    if (!roomId)
      return res.status(400).json({ success: false, message: "Missing roomId" });

    const session = await ChatSession.findOne({ roomId });
    if (!session)
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });

    const panditId = session.panditId?.toString();

    /* -------------------------------------------------
       🔥 CLEAR CHAT MESSAGES WHEN CHAT ENDS (Option A)
    -------------------------------------------------- */
    await ChatSession.findOneAndUpdate(
      { roomId },
      { $set: { messages: [], isActive: false } }
    );

    /* -------------------------------------------------
       Delete chat request
    -------------------------------------------------- */
    await ChatRequest.deleteMany({ roomId });

    /* -------------------------------------------------
       Clear pandit busy state
    -------------------------------------------------- */
    const Pandit = (await import("../models/Pandit.js")).default;
    await Pandit.findByIdAndUpdate(panditId, {
      currentSession: null,
      isOnline: true,
    });

    /* -------------------------------------------------
       Emit real-time events
    -------------------------------------------------- */
    const io = req.app.get("io");
    if (io) {
      io.emit("pandit_status_update", {
        panditId,
        isOnline: true,
        currentSession: null,
      });

      io.to(roomId).emit("chat_ended", {
        roomId,
        endedBy: "system",
      });
    }

    return res.json({
      success: true,
      message: "Chat session ended successfully",
    });
  } catch (err) {
    console.error("❌ end-session error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
