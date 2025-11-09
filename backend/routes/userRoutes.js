import express from "express";
import { getUserDashboardData } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ This route must exist
router.get("/:id/dashboard", verifyToken, getUserDashboardData);

export default router;
