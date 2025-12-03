// routes/panditRoutes.js
import express from "express";
import multer from "multer";

import {
  registerPandit,
  loginPandit,
  getAllPandits,
  getPanditDashboard,
  updatePanditOnlineStatus,
  updatePanditSessionStatus,
  getPanditRequests,
} from "../controllers/panditController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ---------------- Multer Setup ---------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

/* ---------------- Public Routes ---------------- */
router.post("/register", upload.single("image"), registerPandit);
router.post("/login", loginPandit);
router.get("/getAllPandits", getAllPandits);

/* ---------------- Protected Pandit Routes ---------------- */
router.use((req, res, next) => {
  protect(req, res, () => {
    if (req.role !== "pandit") {
      return res.status(403).json({ message: "Pandit access only" });
    }
    next();
  });
});

// ⭐ NEW — Chat Requests API
router.get("/:id/requests", getPanditRequests);

// Dashboard
router.get("/:id/dashboard", getPanditDashboard);

// Update Online/Offline
router.patch("/:id/online-status", updatePanditOnlineStatus);
router.patch("/:id/session-status", updatePanditSessionStatus);

export default router;
