import express from "express";
import { placeBid } from "../controllers/bidController.js"
const router = express.Router();

// POST /api/auction/:productId/bid
router.post("/:productId/bid", placeBid);

export default router;
