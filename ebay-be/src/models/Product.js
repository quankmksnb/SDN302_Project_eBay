import mongoose from "mongoose";
import User from "./User.js";
import Category from "./Category.js";
const productSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  images: [{ type: String }],
  categoryld: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  sellerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  IsAuction: { type: Boolean, default: false },
  auctionEndTime: {
    type: Date,
    required: function () {
      return this.IsAuction;
    },
  },
});

export default mongoose.model("Product", productSchema, "products");
