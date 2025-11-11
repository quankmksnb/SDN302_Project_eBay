import ReturnRequest from "../models/ReturnRequest.js";
import Order from "../models/Order.js";
import ShippingInfo from "../models/ShippingInfo.js";
import mongoose from "mongoose";

// Thời gian tối đa cho phép hoàn trả (7 ngày)
const MAX_RETURN_DAYS = 7;

/**
 * POST /api/returns
 * Yêu cầu: orderId, reason (trong body)
 */
export const requestOrderReturn = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId, reason } = req.body;

    if (!orderId || !reason) {
      return res
        .status(400)
        .json({ success: false, message: "Order ID and reason are required." });
    }

    const objectOrderId = new mongoose.Types.ObjectId(orderId);

    const order = await Order.findOne({ _id: objectOrderId, buyerId: userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or does not belong to the user.",
      });
    }

    const existingReturnRequest = await ReturnRequest.findOne({
      orderId: objectOrderId,
      status: { $in: ["pending", "approved"] },
    });
    if (existingReturnRequest) {
      return res.status(400).json({
        success: false,
        message:
          "A return request for this order is already pending or approved.",
      });
    }

    const shippingInfo = await ShippingInfo.findOne({ orderId: objectOrderId });

    if (!shippingInfo || shippingInfo.status !== "delivered") {
      return res.status(400).json({
        success: false,
        message: "Order must be delivered before a return can be requested.",
      });
    }

    const deliveredDate = shippingInfo.deliveredDate;

    if (!deliveredDate) {
      return res.status(500).json({
        success: false,
        message:
          "Delivery date information is missing for this delivered order.",
      });
    }

    const deliveredMoment = new Date(deliveredDate);
    const now = new Date();
    const timeDifference = now.getTime() - deliveredMoment.getTime();
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

    if (daysDifference > MAX_RETURN_DAYS) {
      return res.status(400).json({
        success: false,
        message: `The return window of ${MAX_RETURN_DAYS} days has expired. (Delivered ${Math.floor(
          daysDifference
        )} days ago).`,
      });
    }

    const returnRequest = await ReturnRequest.create({
      orderId: objectOrderId,
      userId: userId,
      reason: reason,
      status: "pending",
    });

    order.status = "Return Requested";
    await order.save();

    return res.status(201).json({
      success: true,
      message:
        "Return request submitted successfully. Waiting for seller approval.",
      returnRequest,
    });
  } catch (error) {
    console.error("Request order return error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/returns/my
 */
export const getUserReturnRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const requests = await ReturnRequest.find({ userId })
      .populate("orderId", "totalPrice status orderDate")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, requests });
  } catch (error) {
    console.error("Get user return requests error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
