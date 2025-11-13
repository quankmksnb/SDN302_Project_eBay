import mongoose from "mongoose";

const shippingInfoSchema = mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  carrier: { type: String, required: true },
  trackingNumber: { type: String, required: true },
  status: {
    type: String,
    default: "Pending_Pickup",
    enum: [
      "Pending_Pickup", // Chờ bên vận chuyển lấy hàng
      "In_Transit", // Đang trên đường vận chuyển
      "Out_for_Delivery", // Đang giao
      "Delivered", // Đã giao hàng thành công
      "Canceled", // Đơn hàng bị hủy
      "Failed_Attempt", // Thử giao thất bại
    ],
  },
  estimateArrival: { type: Date, required: true },
  deliveredDate: { type: Date },
});

export default mongoose.model("ShippingInfo", shippingInfoSchema);
