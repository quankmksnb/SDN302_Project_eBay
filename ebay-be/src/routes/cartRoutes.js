import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import {
  addToCart,
  applyCoupon,
  clearCart,
  getCart,
  mergeGuestCart,
  removeFromCart,
  updateCartItem,
} from "../controllers/cartController.js";

const cartRoutes = express.Router();

cartRoutes.get("/", authenticateToken, getCart);
cartRoutes.post("/add", authenticateToken, addToCart);
cartRoutes.patch("/update", authenticateToken, updateCartItem);
cartRoutes.delete("remove/:productId", authenticateToken, removeFromCart);
cartRoutes.delete("/clear", authenticateToken, clearCart);

// Apply coupon
cartRoutes.post("/apply-coupon", authenticateToken, applyCoupon);

cartRoutes.post("/merge", authenticateToken, mergeGuestCart);

export default cartRoutes;
