import api from "@/services";

const cartService = {
  // ====== 🛒 SERVER CART ======
  getCart: async () => {
    try {
      const res = await api.get("/cart");
      return res.data; // { success, cart, count }
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  addToCart: async (productId, quantity = 1) => {
    try {
      const res = await api.post("/cart/add", { productId, quantity });
      // 🔔 thông báo cho Header cập nhật số lượng
      window.dispatchEvent(new Event("cart_updated"));
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateCartItem: async (productId, quantity) => {
    try {
      const res = await api.patch("/cart/update", { productId, quantity });
      window.dispatchEvent(new Event("cart_updated"));
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  removeFromCart: async (productId) => {
    try {
      const res = await api.delete(`/cart/remove/${productId}`);
      window.dispatchEvent(new Event("cart_updated"));
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  clearCart: async () => {
    try {
      const res = await api.delete("/cart/clear");
      window.dispatchEvent(new Event("cart_updated"));
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // ====== 💾 LOCAL CART (GUEST MODE) ======
  getLocalCart: () => {
    try {
      const raw = localStorage.getItem("guest_cart");
      if (!raw) return [];
      return JSON.parse(raw);
    } catch (err) {
      console.error("getLocalCart error", err);
      return [];
    }
  },

  saveLocalCart: (items) => {
    try {
      localStorage.setItem("guest_cart", JSON.stringify(items));
      // 🔔 Cập nhật icon giỏ hàng trên header
      window.dispatchEvent(new Event("cart_updated"));
    } catch (err) {
      console.error("saveLocalCart error", err);
    }
  },

  addToLocalCart: (product, quantity = 1) => {
    const items = cartService.getLocalCart();
    const productId = product._id || product.id;
    const idx = items.findIndex((it) => it.productId === productId);

    if (idx > -1) {
      items[idx].quantity = Math.max(1, items[idx].quantity + quantity);
    } else {
      items.push({
        productId,
        title: product.title || product.name,
        price: product.price || product.unitPrice || 0,
        image: product.image || product.images?.[0] || "/placeholder.png",
        categoryName: product.categoryId?.name || "Category",
        quantity,
      });
    }

    cartService.saveLocalCart(items);
    return items;
  },

  removeFromLocalCart: (productId) => {
    const items = cartService
      .getLocalCart()
      .filter((it) => it.productId !== productId);
    cartService.saveLocalCart(items);
    window.dispatchEvent(new Event("cart_updated"));
    return items;
  },

  clearLocalCart: () => {
    localStorage.removeItem("guest_cart");
    window.dispatchEvent(new Event("cart_updated"));
  },

  // ====== 🔁 MERGE LOCAL → SERVER SAU LOGIN ======
  mergeGuestCartToServer: async () => {
    try {
      const guestItems = cartService.getLocalCart().map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      if (guestItems.length === 0) return null;

      const res = await api.post("/cart/merge", { items: guestItems });

      // ✅ Sau khi merge xong, xoá local cart để tránh trùng
      cartService.clearLocalCart();
      window.dispatchEvent(new Event("cart_updated"));

      return res.data; // { success, cart, count }
    } catch (error) {
      console.error("mergeGuestCartToServer error", error);
      throw error.response?.data || error;
    }
  },
};

export default cartService;
