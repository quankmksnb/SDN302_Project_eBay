import Feedback from "../models/Feedback.js";
import Review from "../models/Review.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

export const updateSellerFeedback = async (sellerId) => {
  try {
    const objectSellerId = new mongoose.Types.ObjectId(sellerId);

    const sellerProducts = await Product.find(
      { sellerId: objectSellerId },
      "_id"
    );
    const productIds = sellerProducts.map((p) => p._id);

    if (productIds.length === 0) {
      await Feedback.findOneAndDelete({ sellerId: objectSellerId });
      return;
    }

    const reviewAggregation = await Review.aggregate([
      { $match: { productId: { $in: productIds } } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          positiveReviews: {
            $sum: { $cond: [{ $gte: ["$rating", 4] }, 1, 0] },
          },
        },
      },
    ]);

    let averageRating = 0;
    let totalReviews = 0;
    let positiveRate = 0;

    if (reviewAggregation.length > 0) {
      const data = reviewAggregation[0];
      totalReviews = data.totalReviews;
      averageRating = parseFloat(data.averageRating.toFixed(1));
      positiveRate =
        totalReviews > 0
          ? parseFloat(((data.positiveReviews / totalReviews) * 100).toFixed(2))
          : 0;
    }

    await Feedback.findOneAndUpdate(
      { sellerId: objectSellerId },
      {
        $set: {
          averageRating,
          totalReviews,
          positiveRate,
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );
  } catch (error) {
    console.error(`Error updating seller feedback for ${sellerId}:`, error);
  }
};

/**
 * GET /api/feedbacks/:sellerId
 */
export const getSellerFeedback = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const feedback = await Feedback.findOne({ sellerId });

    if (!feedback) {
      return res.status(200).json({
        success: true,
        feedback: {
          sellerId,
          averageRating: 0,
          totalReviews: 0,
          positiveRate: 0,
        },
        message: "No feedback found for this seller yet.",
      });
    }

    return res.status(200).json({ success: true, feedback });
  } catch (error) {
    console.error("Get seller feedback error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
