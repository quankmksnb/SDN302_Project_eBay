import Coupon from "../models/Coupon.js";
import User from "../models/User.js";

export const calculateCouponForCart = async (userId, cart, couponCode) => {
  // 1. get user & availableCoupons
  const user = await User.findById(userId).populate("availableCoupons");
  if (!user) throw new Error("User not found");

  const coupon = user.availableCoupons.find((c) => c.code === couponCode);
  if (!coupon) throw new Error("Coupon not available for this user");

  // 3. Check status, time
  if (coupon.status !== "active") throw new Error("Coupon is not active");
  if (new Date(coupon.startDate) > new Date())
    throw new Error("Coupon not yet valid");
  if (new Date(coupon.endDate) < new Date())
    throw new Error("Coupon has expired");

  // 4. Check maxUsage toàn hệ thống
  if (coupon.maxUsage) {
    const totalUsed = coupon.usedBy.reduce((sum, u) => sum + u.usedCount, 0);
    if (totalUsed >= coupon.maxUsage)
      throw new Error("Coupon max usage reached");
  }

  // 5. Check maxUsagePerUser
  const userUsed = coupon.usedBy.find((u) => u.userId.toString() === userId);
  if (userUsed && userUsed.usedCount >= coupon.maxUsagePerUser)
    throw new Error("You have already used this coupon the maximum times");

  // 6. total cart (áp dụng productIds nếu coupon type là product)
  let cartTotal = 0;
  for (const item of cart.items) {
    const productPrice = item.productId.price || 0;
    if (
      !coupon.productIds ||
      coupon.productIds.length === 0 ||
      coupon.productIds.includes(item.productId._id)
    ) {
      cartTotal += productPrice * item.quantity;
    }
  }

  if (cartTotal < (coupon.minOrderValue || 0))
    throw new Error(
      `Cart total must be at least ${coupon.minOrderValue} to apply this coupon`
    );

  // 7. caculate discount
  let discountAmount = (cartTotal * coupon.discountPercent) / 100;
  if (coupon.maxDiscountAmount)
    discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);

  const totalAfterDiscount = cartTotal - discountAmount;

  return {
    couponId: coupon._id,
    code: coupon.code,
    cartTotal,
    discountAmount,
    totalAfterDiscount,
  };
};
