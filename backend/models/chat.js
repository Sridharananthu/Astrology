import mongoose from "mongoose";

const chatSessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    panditId: { type: mongoose.Schema.Types.ObjectId, ref: "Pandit", required: true },
    roomId: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: false },
    messages: [
      {
        sender: String,
        text: String,
        time: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("ChatSession", chatSessionSchema);
