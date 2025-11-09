import express from "express";
import { registerPandit, loginPandit, getPanditDashboard } from "../controllers/panditController.js";
import { protect , verifyToken} from "../middleware/authMiddleware.js";
import { getAllPandits } from "../controllers/panditController.js";
const router = express.Router();

router.post("/register", registerPandit);
router.post("/login", loginPandit);
router.get("/getAllPandits", getAllPandits);
router.get("/:id/dashboard", protect, getPanditDashboard);

export default router;
