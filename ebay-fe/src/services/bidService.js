import api from "@/services";

/**
 * Lấy danh sách BID theo productId
 * GET /api/bids/product/:productId
 */
export const getBidsByProduct = async (productId) => {
  try {
    const res = await api.get(`/bids/product/${productId}`);
    return res.data.bids;
  } catch (error) {
    console.error("Error fetching bids:", error);
    throw error;
  }
};

/**
 * Đặt bid
 * POST /api/bids/place
 */
export const placeBid = async (productId, bidAmount) => {
  try {
    const res = await api.post(`/bids/place`, {
      productId,
      bidAmount,
    });
    return res.data;
  } catch (error) {
    console.error("Error placing bid:", error);
    throw error;
  }
};

/**
 * Lấy bid cao nhất của 1 sản phẩm (optional)
 * GET /api/bids/highest/:productId
 */
export const getHighestBid = async (productId) => {
  try {
    const res = await api.get(`/bids/highest/${productId}`);
    return res.data.highestBid;
  } catch (error) {
    console.error("Error fetching highest bid:", error);
    throw error;
  }
};

const bidService = {
  getBidsByProduct,
  placeBid,
  getHighestBid,
};

export default bidService;
