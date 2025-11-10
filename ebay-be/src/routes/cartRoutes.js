import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import {
  addToCard,
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

export default cartRoutes;
