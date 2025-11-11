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
  // ===== Local storage helpers (for guests) =====
  getLocalCart: () => {
    try {
      const raw = localStorage.getItem("localCart");
      if (!raw) return [];
      return JSON.parse(raw);
    } catch (err) {
      console.error("getLocalCart error", err);
      return [];
    }
  },
  saveLocalCart: (items) => {
    try {
      localStorage.setItem("localCart", JSON.stringify(items));
      // notify listeners
      window.dispatchEvent(new Event("cart_updated"));
    } catch (err) {
      console.error("saveLocalCart error", err);
    }
  },
  addToLocalCart: (product, quantity = 1) => {
    const items = cartService.getLocalCart();
    const idx = items.findIndex((it) => it.productId === product._id || it.productId === product.id);
    if (idx > -1) {
      items[idx].quantity = Math.max(1, items[idx].quantity + quantity);
    } else {
      items.push({
        productId: product._id || product.id,
        title: product.title || product.name,
        price: product.price || product.unitPrice || 0,
        image: product.image || product.images?.[0] || null,
        quantity,
      });
    }
    cartService.saveLocalCart(items);
    return items;
  },
  removeFromLocalCart: (productId) => {
    const items = cartService.getLocalCart().filter((it) => it.productId !== productId);
    cartService.saveLocalCart(items);
    return items;
  },
  clearLocalCart: () => {
    localStorage.removeItem("localCart");
    window.dispatchEvent(new Event("cart_updated"));
  },
};

export default cartService;
