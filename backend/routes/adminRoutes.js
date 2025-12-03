// routes/adminRoutes.js
import express from "express";
import { loginAdmin } from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";

import Pandit from "../models/Pandit.js";
import Transaction from "../models/WalletTransaction.js";

const router = express.Router();

/* ---------------- ADMIN LOGIN (Unified) ---------------- */
router.post("/login", loginAdmin);

/* ---------------- PROTECTED ADMIN ROUTES ---------------- */
// 🔒 Only admins can access these
router.use((req, res, next) => {
  protect(req, res, () => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }
    next();
  });
});

/* ---------------- Pandit Management ---------------- */

// Get all pending Pandit requests
router.get("/pandit-requests", async (req, res) => {
  const requests = await Pandit.find({ status: "pending" });
  res.json({ success: true, requests });
});

// Approve Pandit
router.post("/approve-pandit/:id", async (req, res) => {
  try {
    const pandit = await Pandit.findById(req.params.id);
    if (!pandit) return res.status(404).json({ message: "Pandit not found" });

    pandit.status = "approved";
    pandit.approved = true;
    pandit.createdByAdmin = pandit.createdByAdmin || false;

    // Auto-generated credentials
    const panditId = "P" + Date.now().toString(36).toUpperCase();
    const rawPassword = Math.random().toString(36).slice(-8);

    const bcrypt = (await import("bcryptjs")).default;
    const hash = await bcrypt.hash(rawPassword, 10);

    pandit.credentials = { panditId, passwordHash: hash };
    await pandit.save();

    res.json({
      success: true,
      message: "Pandit approved successfully",
      panditId,
      password: rawPassword,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error approving pandit" });
  }
});

// Reject Pandit
router.post("/reject-pandit/:id", async (req, res) => {
  await Pandit.findByIdAndUpdate(req.params.id, { status: "rejected" });
  res.json({ success: true, message: "Pandit rejected" });
});

// Get all approved Pandits
router.get("/pandit", async (req, res) => {
  const pandit = await Pandit.find({ status: "approved" });
  res.json({ success: true, pandit });
});

/* ---------------- Dashboard Stats ---------------- */
router.get("/dashboard", async (req, res) => {
  const totalPandits = await Pandit.countDocuments();
  const pendingPandits = await Pandit.countDocuments({ status: "pending" });

  const totalTransactions = await Transaction.countDocuments();
  const totalEarnings = await Transaction.aggregate([
    { $match: { type: "userPayment" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  res.json({
    success: true,
    totalPandits,
    pendingPandits,
    totalTransactions,
    totalEarnings: totalEarnings[0]?.total || 0,
  });
});

export default router;
