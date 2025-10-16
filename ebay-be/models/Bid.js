import mongoose from "mongoose";
import Product from "./Product.js";
import User from "./User";

const bidSchema = mongoose.Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  bidderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  bidTime: { type: Date, default: Date.now },
});
export default mongoose.model("Bid", bidSchema, "bids");
