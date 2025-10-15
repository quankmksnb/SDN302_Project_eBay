import mongoose from "mongoose";
import Order from "./Order.js";
import User from "./User.js";

const disputeSchema = mongoose.Schema({
  orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  raisedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  description: { type: String },
  status: { type: String, default: "Open" }, // Create enum for: Open, Under Review, Resolved
  resolution: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Dispute", disputeSchema, "disputes");
