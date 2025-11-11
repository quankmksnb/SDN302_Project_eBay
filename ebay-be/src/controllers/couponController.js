import Coupon from "../models/Coupon.js";
import User from "../models/User.js";

/**
 * [GET] /api/coupons
 */
export const getAllCoupons = async (req, res) => {
  try {
    const { status, type } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;

    const coupons = await Coupon.find(filter).sort({ createAt: -1 });
    res.status(200).json({ success: true, coupons });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error,
    });
  }
};

/**
 * [GET] /api/coupons/:id
 */
export const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    res.status(200).json({ coupon });
  } catch (error) {
    console.error("Error fetching coupon:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error,
    });
  }
};

/**
 * [POST] /api/coupons
 */
export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountPercent,
      startDate,
      endDate,
      status = "active",
      type = "global",
      productIds = [],
      maxUsage,
      maxUsagePerUser = 1,
      minOrderValue,
      maxDiscountAmount,
    } = req.body;

    const existing = await Coupon.findOne({ code });
    if (existing)
      return res
        .status(400)
        .json({ success: false, message: "Coupon code already exists" });
    const newCoupon = await Coupon.create({
      code,
      discountPercent,
      startDate,
      endDate,
      status,
      type,
      productIds,
      maxUsage,
      maxUsagePerUser,
      minOrderValue,
      maxDiscountAmount,
    });

    res.status(201).json({
      message: "Coupon created successfully",
      coupon: newCoupon,
    });
  } catch (error) {
    console.error("Error creating coupons:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error,
    });
  }
};

/**
 * [PATCH] /api/coupons/:id
 */
export const updateCoupon = async (req, res) => {
  try {
    const updates = req.body;
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });
    if (!coupon)
      return res
        .status(404)
        .json({ success: false, message: "Coupon not found" });
    res
      .status(200)
      .json({ success: true, message: "Coupon updated successfully", coupon });
  } catch (error) {
    console.error("Error updating coupons:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error,
    });
  }
};

/**
 * [DELETE] /api/coupons/:id
 */
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon)
      return res
        .status(404)
        .json({ success: false, message: "Coupon not found" });
    res
      .status(200)
      .json({ success: true, message: "Coupon deleted successfully" });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error,
    });
  }
};

/**
 * [GET] /api/coupons/my
 */
export const getCouponsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    const coupons = await Coupon.find({
      status: "active",
      startDate: { $lte: now },
      endDate: { $gte: now },
      $or: [{ type: "global" }, { assignedTo: userId }],
    }).lean();

    res.status(200).json({ coupons });
  } catch (error) {
    console.error("Error fetching coupons by user:", error);
    res.status(500).json({ message: "Server error" });
  }
};
