import express from "express";
import {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
} from "../controllers/couponController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.get("/", getAllCoupons);
router.get("/my", authenticateToken, deleteCoupon);
router.get("/:id", getCouponById);
router.post("/", createCoupon);
router.patch("/:id", updateCoupon);
router.delete("/:id", deleteCoupon);

export default router;
