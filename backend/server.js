import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import panditRoutes from "./routes/panditRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();

const app = express();

// ====== Middleware ======
app.use(cors());
app.use(express.json());

// ====== Database Connection ======
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/astroDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// ====== API Routes ======
app.use("/api/users", userRoutes);
app.use("/api/pandits", panditRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/payments", paymentRoutes);

// ====== Default Route ======
app.get("/", (req, res) => {
  res.send("🌟 AstroConnect Backend API Running Successfully!");
});

// ====== Start Server ======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
