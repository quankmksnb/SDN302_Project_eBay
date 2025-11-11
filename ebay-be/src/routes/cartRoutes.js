import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import {
  addToCard,
  applyCoupon,
  clearCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from "../controllers/cartController.js";

const cartRoutes = express.Router();

cartRoutes.get("/", authenticateToken, getCart);
cartRoutes.post("/add", authenticateToken, addToCard);
cartRoutes.patch("/update", authenticateToken, updateCartItem);
cartRoutes.delete("remove/:productId", authenticateToken, removeFromCart);
cartRoutes.delete("/clear", authenticateToken, clearCart);

// Apply coupon
cartRoutes.post("/apply-coupon", authenticateToken, applyCoupon);

export default cartRoutes;
