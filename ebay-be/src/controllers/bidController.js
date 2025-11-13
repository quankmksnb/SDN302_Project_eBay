import Product from "../models/Product.js";
import Bid from "../models/Bid.js";

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
