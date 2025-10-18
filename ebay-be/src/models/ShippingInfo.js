import mongoose from "mongoose";

const shippingInfoSchema = mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  carrier: { type: String, required: true },
  trackingNumber: { type: String, required: true },
  status: { type: String, default: "shipping" },
  estimateArrival: { type: Date, required: true },
});

export default mongoose.model("ShippingInfo", shippingInfoSchema);
