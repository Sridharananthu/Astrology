// backend/controllers/chatController.js

import ChatSession from "../models/chat.js";
import User from "../models/User.js";
import WalletTransaction from "../models/WalletTransaction.js";

export const endChatSession = async (req, res) => {
  try {
    const { roomId } = req.body;

    const session = await ChatSession.findOne({ roomId });
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    // mark end time
    session.endTime = new Date();
    session.isActive = false;
    await session.save();

    // calculate duration
    const start = session.startTime;
    const end = session.endTime;

    const durationMinutes = Math.ceil((end - start) / 60000); // at least 1 minute
    const totalAmount = durationMinutes * 5;

    // Deduct from user wallet
    const user = await User.findById(session.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.walletBalance -= totalAmount;
    await user.save();

    // Create ONE transaction entry
    await WalletTransaction.create({
      userId: session.userId,
      type: "debit",
      amount: totalAmount,
      message: `Chat ended with Pandit (${durationMinutes} min)`
    });

    res.json({
      success: true,
      message: "Chat ended successfully",
      deducted: totalAmount,
      minutes: durationMinutes,
    });

  } catch (err) {
    console.error("End chat error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
