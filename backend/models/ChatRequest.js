import mongoose from "mongoose";

const chatRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    panditId: { type: mongoose.Schema.Types.ObjectId, ref: "Pandit", required: true },
    roomId: { type: String, required: true },
    accepted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("ChatRequest", chatRequestSchema);
