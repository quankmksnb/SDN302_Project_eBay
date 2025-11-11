import api from "@/services";

const cartService = {
  getCart: async () => {
    try {
      const res = await api.get("/cart");
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  addToCart: async (productId, quantity = 1) => {
    try {
      const res = await api.post("/cart/add", { productId, quantity });
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  updateCartItem: async (productId, quantity) => {
    try {
      const res = await api.patch("/cart/update", { productId, quantity });
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  removeFromCart: async (productId) => {
    try {
      const res = await api.delete(`/cart/remove/${productId}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  clearCart: async () => {
    try {
      const res = await api.delete("/cart/clear");
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default cartService;
