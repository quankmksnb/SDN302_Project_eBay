import mongoose from "mongoose";
import Order from "./Order.js";
import Product from "./Product.js";

const orderItemSchema = mongoose.Schema({
  orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
});

export default mongoose.model("OrderItem", orderItemSchema, "orderItems");
