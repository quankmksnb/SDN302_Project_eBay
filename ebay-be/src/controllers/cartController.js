import { calculateCouponForCart } from "../helpers/couponHelper.js";
import Cart from "../models/Cart.js";

/**
 * GET /api/cart
 */
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    let cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    return res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Error getting cart:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while getting cart",
      error,
    });
  }
};

/**
 * POST /api/cart/add
 */
export const addToCard = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ userId });
    if (!cart)
      cart = await Cart.create({ userId, items: [{ productId, quantity }] });
    else {
      const itemIndex = cart.items.findIndex(
        (i) => i.productId.toString() === productId
      );
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
      cart.updatedAt = Date.now();
      await cart.save();
    }

    return res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Error adding product to cart: ", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding product to cart",
      error,
    });
  }
};

/**
 * PATCH /api/cart/update
 */
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
    if (!productId || quantity == null)
      return res
        .status(400)
        .json({ success: false, message: "Missing productId or quantity" });

    if (quantity < 1)
      return res
        .status(400)
        .json({ success: false, message: "Quantity must be >= 1" });
    const cart = await Cart.findOne({ userId });
    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    const item = cart.items.find((i) => i.productId.toString() === productId);
    if (!itme)
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    item.quantity = quantity;
    await cart.save();
    return res
      .status(200)
      .json({ success: true, message: "Cart updated", cart });
  } catch (error) {
    console.error("Error updating cart: ", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating cart",
      error,
    });
  }
};

/**
 * DELETE /api/cart/remove/:productId
 */

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });

    cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
    await cart.save();
    res.status(200).json({ success: true, message: "Item removed", cart });
  } catch (error) {
    console.error("Remove from cart error: ", error);
    res.status(500).json({
      success: false,
      message: "Server error while removing from cart",
      error,
    });
  }
};

/**
 * DELETE /api/cart/clear
 */

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId });
    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    cart.items = [];
    await cart.save();
    return res
      .status(200)
      .json({ success: true, message: "Cart cleared", cart });
  } catch (error) {
    console.error("Clear cart error: ", error);
    res.status(500).json({
      success: false,
      message: "Server error while clearing cart",
      error,
    });
  }
};

export const applyCoupon = async (req, res) => {
  try {
    const userId = req.user.id;
    const { code } = req.body;

    if (!code) return res.status(400).json({ message: "Coupon code required" });

    // 1. Lấy cart
    let cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    // 2. Tính toán coupon
    const result = await calculateCouponForCart(userId, cart, code);

    return res.status(200).json({
      success: true,
      message: `Coupon ${code} applied successfully (calculation only)`,
      ...result,
    });
  } catch (error) {
    console.error("Apply coupon error:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};
