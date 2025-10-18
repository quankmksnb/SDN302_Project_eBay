import mongoose from "mongoose";
import User from "./User.js";
import Address from "./Address.js";

const orderSchema = mongoose.Schema({
  buyerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  addressId: { type: Schema.Types.ObjectId, ref: "Address", required: true },
  orderDate: { type: Date, default: Date.now },
  totalPrice: { type: Number, required: true },
  status: { type: String, default: "Pending" }, // Create Enum for: Pending, Shipped, Delivered, Canceled
});

export default mongoose.model("Order", orderSchema, "orders");
