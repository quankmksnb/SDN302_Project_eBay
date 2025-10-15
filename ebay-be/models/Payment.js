import mongoose from "mongoose";
import Order from "./Order";
import User from "./User";

const paymentSchema = mongoose.Schema({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: "Order",
    required: true,
    unique: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: { type: Number, required: true },
  method: { type: String, required: true }, // Create enum for: Credit Card, PayPal
  status: { type: String, default: "pending" }, // Create enum: Completed, Failed, Pending
  paidAt: { type: Date },
});

export default mongoose.model("Payment", paymentSchema, "payments");
