import express from "express";
import { getSellerFeedback } from "../controllers/feedbackController.js";

const router = express.Router();

// GET /api/feedbacks/:sellerId
router.route("/:sellerId").get(getSellerFeedback);

export default router;
