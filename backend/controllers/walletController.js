import User from "../models/User.js";
import WalletTransaction from "../models/WalletTransaction.js";

/* ------------------ CREDIT ------------------ */
export const addToWallet = async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    const userId = req.user.id;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.walletBalance += amount;
    await user.save();

    await WalletTransaction.create({
      userId,
      type: "credit",
      amount,
      message: "Added to wallet",
    });

    res.json({
      message: "Amount added successfully",
      balance: user.walletBalance,
    });
  } catch (err) {
    console.error("Wallet Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ------------------ DEBIT ------------------ */
// export const debitFromWallet = async (req, res) => {
//   try {
//     const amount = Number(req.body.amount);
//     const userId = req.user.id;

//     if (!amount || amount <= 0)
//       return res.status(400).json({ message: "Invalid amount" });

//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     if (user.walletBalance < amount)
//       return res.status(400).json({ message: "Insufficient balance" });

//     user.walletBalance -= amount;
//     await user.save();

//     await WalletTransaction.create({
//       userId,
//       type: "debit",
//       amount,
//       message: "Wallet debited for chat",
//     });

//     res.json({
//       success: true,
//       message: "Debited successfully",
//       balance: user.walletBalance,
//     });
//   } catch (err) {
//     console.error("Debit Error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

/* ------------------ GET TRANSACTIONS ------------------ */
export const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;

    const transactions = await WalletTransaction.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ transactions });
  } catch (err) {
    console.error("Transaction Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
