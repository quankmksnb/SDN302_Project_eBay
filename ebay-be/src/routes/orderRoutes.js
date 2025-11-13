import express from "express";
import {
  createOrder,
  getOrderDetails,
  updateOrderStatus,
  updateShippingInfoStatus,
  createReturnRequest,
  updateReturnRequestStatus,
} from "../controllers/orderController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// giả lạp cho admin hoặc seller
router.put("/:id/status", updateOrderStatus);
router.put("/shipping/:orderId/status", updateShippingInfoStatus);
router.put("/returns/:id/status", updateReturnRequestStatus);

router.use(authenticateToken);
router.post("/", createOrder);
router.get("/:id", getOrderDetails);
router.post("/:id/return", createReturnRequest);

export default router;
