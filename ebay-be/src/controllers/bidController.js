import Product from "../models/Product.js";
import Bid from "../models/Bid.js";

// Hàm ẩn danh tên người dùng
const maskUsername = (username) => {
  if (!username || username.length < 2) return "A****";
  
  const firstChar = username[0];
  const lastChar = username[username.length - 1];
  const maskedPart = "*".repeat(Math.max(4, username.length - 2));
  
  return `${firstChar}${maskedPart}${lastChar}`;
};

export const placeBid = async (req, res) => {
  try {
    const { productId } = req.params;
    const { buyerId, bidAmount, maxAutoBid } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.isAuction)
      return res.status(400).json({ message: "Sản phẩm không đấu giá" });

    if (new Date() > product.auctionEndTime)
      return res.status(400).json({ message: "Phiên đấu giá đã kết thúc" });

    if (bidAmount <= product.currentPrice)
      return res.status(400).json({ message: "Giá phải cao hơn giá hiện tại" });

    // Tạo bid mới
    const newBid = await Bid.create({
      productId,
      buyerId,
      bidAmount,
      maxAutoBid: maxAutoBid || bidAmount,
    });

    // Tìm người đang giữ giá cao nhất trước đó
    const prevHighestBidder = product.highestBidder
      ? await Bid.findOne({ productId, buyerId: product.highestBidder })
      : null;

    // Auto-bid logic
    if (
      prevHighestBidder &&
      prevHighestBidder.maxAutoBid >= bidAmount + product.minIncrement
    ) {
      // người cũ vẫn thắng, chỉ tăng giá
      product.currentPrice = bidAmount + product.minIncrement;
    } else {
      // người mới thắng
      product.highestBidder = buyerId;
      product.currentPrice = bidAmount;
    }

    await product.save();
    res.json({ message: "Đặt giá thành công", newBid, product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// API lấy lịch sử đấu giá của sản phẩm
export const getBidHistory = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    if (!product.isAuction) {
      return res.status(400).json({ message: "Sản phẩm này không phải đấu giá" });
    }

    // Lấy danh sách bid, populate thông tin người đấu giá
    const bids = await Bid.find({ productId })
      .populate("buyerId", "username fullname email")
      .sort({ createdAt: -1 });

    const bidHistory = bids.map((bid) => {
      const buyerInfo = bid.buyerId;
      const displayName = buyerInfo?.username || buyerInfo?.fullname || buyerInfo?.email || "Anonymous";
      
      return {
        bidId: bid._id,
        bidderName: maskUsername(displayName),
        bidAmount: bid.bidAmount,
        bidTime: bid.createdAt,
      };
    });

    res.json({
      success: true,
      productId,
      productTitle: product.title,
      totalBids: bidHistory.length,
      currentPrice: product.currentPrice,
      bidHistory,
    });
  } catch (error) {
    console.error("Error fetching bid history:", error);
    res.status(500).json({ 
      success: false,
      message: "Lỗi server khi lấy lịch sử đấu giá", 
      error: error.message 
    });
  }
};