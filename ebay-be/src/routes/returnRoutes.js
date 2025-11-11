import express from "express";
import {
  requestOrderReturn,
  getUserReturnRequests,
} from "../controllers/returnController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// POST /api/returns
router.route("/").post(authenticateToken, requestOrderReturn);

// GET /api/returns/my
router.route("/my").get(authenticateToken, getUserReturnRequests);

export default router;
