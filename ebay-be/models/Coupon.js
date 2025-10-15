import mongoose from "mongoose";
import Product from "./Product.js";

const couponSchema = mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountPercent: { type: Number, required: true, min: 0, max: 100 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  maxUsage: { type: Number },
  status: { type: String, default: "active" },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
});

export default mongoose.model("Coupon", couponSchema, "coupons");
