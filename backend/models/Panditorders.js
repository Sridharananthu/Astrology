import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  panditId: { type: mongoose.Schema.Types.ObjectId, ref: "Pandit" },
  userId: String,
  client: String,
  service: String,
  date: Date,
  status: { type: String, enum: ["Pending", "Active", "Completed"], default: "Pending" },
});

export default mongoose.model("Order", orderSchema);
