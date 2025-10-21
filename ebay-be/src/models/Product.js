import mongoose from "mongoose";
import User from "./User.js";
import Category from "./Category.js";

const { Schema } = mongoose;
const productSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  images: [{ type: String }],
  categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  sellerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  isAuction: { type: Boolean, default: false },
  auctionEndTime: {
    type: Date,
    required: function () {
      return this.isAuction;
    },
  },
});

export default mongoose.model("Product", productSchema, "products");
