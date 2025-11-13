import express from "express";
import { placeBid, getBidHistory } from "../controllers/bidController.js"
const router = express.Router();

// POST /api/auction/:productId/bid
router.post("/:productId/bid", placeBid);
router.get("/:productId/historyBid", getBidHistory)

export default router;
