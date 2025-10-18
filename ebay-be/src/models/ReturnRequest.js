import mongoose from "mongoose";
import User from "./User.js";
import Order from "./Order.js";

const returnRequestSchema = mongoose.Schema({
  orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  reason: String,
  status: { type: String, default: "pending" }, // Create enum for: Pending, Approved, Rejected
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model(
  "ReturnRequest",
  returnRequestSchema,
  "returnRequests"
);
