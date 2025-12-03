import express from "express";
import { getUserDashboardData } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { addToWallet, getTransactions } from "../controllers/walletController.js";
import User from "../models/User.js";
import Pandit from "../models/Pandit.js";
import WalletTransaction from "../models/WalletTransaction.js";

const router = express.Router();

/* ---------------- PROTECTED USER ROUTES ---------------- */
router.use((req, res, next) => {
  protect(req, res, () => {
    if (req.role !== "user") {
      return res.status(403).json({ message: "User access only" });
    }
    next();
  });
});

/* ---------------- USER DASHBOARD ---------------- */
router.get("/:id/dashboard", getUserDashboardData);

/* ---------------- USER LOGOUT ---------------- */
router.post("/logout", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logout successful"
  });
});



/* ---------------- WALLET: ADD MONEY ---------------- */
router.post("/wallet/add", addToWallet);

router.get("/wallet/balance", async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ balance: user.walletBalance });
});

router.post("/wallet/debit", protect, async (req, res) => {
  const { panditId } = req.body;
  console.log("pandit body", req.body)
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    const pandit = await Pandit.findById(panditId);

    if (!user || !pandit)
      return res.status(404).json({ message: "Invalid user or pandit" });

    const rate = pandit.rate || 5;

    if (user.walletBalance < rate)
      return res.status(400).json({ message: "Insufficient balance" });

    user.walletBalance -= rate;
    await user.save();

    await WalletTransaction.create({
      userId,
      type: "debit",
      amount: rate,
      message: "Debited per minute chat charge",
    });

    res.json({
      success: true,
      balance: user.walletBalance,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/wallet/transactions", getTransactions);

export default router;
