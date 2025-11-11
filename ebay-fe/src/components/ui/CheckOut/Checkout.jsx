import { SHIPPING_TOTAL_USD, USD_TO_VND_RATE } from "@/lib/constants";
import React, { useState } from "react";
import cartService from "@/services/cartService";

const Checkout = ({ cart = {}, coupons = [], onCartUpdate }) => {
  const cartItems = cart.items || [];
  const [couponCode, setCouponCode] = useState("");
  const totalItemsCount = cart.totalItems || 0;

  const [appliedCouponData, setAppliedCouponData] = useState(null);

  // Giá trị gốc từ cart prop
  const baseSubtotalUSD = parseFloat(cart.subtotal) || 0;
  const baseDiscountUSD = parseFloat(cart.discountTotal) || 0.0;
  const shippingUSD = SHIPPING_TOTAL_USD;

  // Tính toán các giá trị hiển thị cuối cùng (Ưu tiên appliedCouponData)
  const currentSubtotalUSD = appliedCouponData
    ? appliedCouponData.cartTotal
    : baseSubtotalUSD;

  const currentDiscountUSD = appliedCouponData
    ? appliedCouponData.discountAmount
    : baseDiscountUSD;

  // Tính tổng cuối cùng: Subtotal + Shipping - Discount
  const currentTotalUSD = currentSubtotalUSD + shippingUSD - currentDiscountUSD;
  // ---------------------------------

  const [selectedAddress, setSelectedAddress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const addresses = [
    {
      name: "Duy Anh",
      address: "Số 32, Đống Đa, Đại học Công đoàn",
      city: "Hà Nội, Việt Nam 000084",
      country: "Vietnam",
      phone: "0984432509",
    },
    {
      name: "Nguyễn Minh",
      address: "25 Nguyễn Trãi, Thanh Xuân",
      city: "Hà Nội, Việt Nam 000085",
      country: "Vietnam",
      phone: "0912345678",
    },
    {
      name: "Trần Hải",
      address: "280 Lý Thường Kiệt, Quận 10",
      city: "TP. Hồ Chí Minh, Việt Nam 700000",
      country: "Vietnam",
      phone: "0905123456",
    },
  ];

  const handleRemoveItem = async (productId) => {
    if (!window.confirm("Are you sure you want to remove this item?")) return;
    try {
      await cartService.removeFromCart(productId);

      if (onCartUpdate) {
        onCartUpdate();
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const handleUpdateQuantity = async (productId, currentQuantity, type) => {
    let newQuantity = currentQuantity;
    if (type === "increment") {
      newQuantity += 1;
    } else if (type === "decrement") {
      newQuantity -= 1;
    }

    if (newQuantity < 1) {
      handleRemoveItem(productId);
      return;
    }

    try {
      await cartService.updateCartItem(productId, newQuantity);

      if (onCartUpdate) {
        onCartUpdate();
      }
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
    }
  };

  const handleApplyCoupon = async (code) => {
    if (!code) {
      alert("Please enter a coupon code.");
      return;
    }

    try {
      const data = await cartService.applyCoupon(code);
      console.log(data);

      // CẬP NHẬT TỨC THÌ STATE CHO ORDER SUMMARY
      // Ghi đè tổng tiền và discount bằng dữ liệu từ API response
      setAppliedCouponData({
        discountAmount: data.discountAmount,
        cartTotal: data.cartTotal, // cartTotal từ response là subtotal mới
      });

      // Vẫn gọi onCartUpdate để parent component fetch lại cart data đầy đủ từ server
      if (onCartUpdate) {
        onCartUpdate();
      }

      setCouponCode("");
      alert(data.message || `Coupon "${code}" applied successfully!`);
    } catch (error) {
      console.error("Error applying coupon:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to apply coupon. Please check the code.";
      alert(errorMessage);
    }
  };

  return (
    <div className="bg-white min-h-screen text-[#111820] font-[Market Sans,Helvetica Neue,Helvetica,Arial,Roboto,sans-serif] flex flex-col items-center">
      {/* ==== HEADER và BANNER (Giữ nguyên) ==== */}
      <div className="flex justify-between items-center w-[90%] max-w-[1200px] py-6 border-b border-gray-200">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/home")}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg"
            alt="eBay"
            className="h-8"
          />
          <h1 className="text-2xl font-semibold">Checkout</h1>
        </div>
        <p className="text-sm text-gray-500">
          How do you like our checkout?{" "}
          <a href="#" className="text-[#3665f3] hover:underline font-medium">
            Give us feedback
          </a>
        </p>
      </div>

      <div className="w-full bg-[#fff8e5] py-3 flex justify-center border-b border-yellow-300">
        <div className="w-[90%] max-w-[1200px] flex justify-between items-center">
          <p className="text-[15px] text-[#111820]">
            Coupon, max. discount $120.{" "}
            <a href="#" className="text-[#3665f3] hover:underline">
              See details
            </a>
          </p>
          <button className="px-5 py-2 border border-[#111820]/20 rounded-full bg-[#fff] text-[15px] font-medium hover:bg-gray-50">
            Apply coupon
          </button>
        </div>
      </div>

      {/* ==== MAIN CONTENT (Giữ nguyên) ==== */}
      <div className="flex justify-between w-[90%] max-w-[1200px] mt-10 gap-10">
        {/* ==== LEFT SIDE (Giữ nguyên) ==== */}
        <div className="flex flex-col w-[68%] space-y-12">
          {/* PAY WITH (Giữ nguyên) */}
          <section>
            <h2 className="text-[20px] font-semibold mb-5">Pay with</h2>
            <div className="space-y-4">
              {[
                {
                  label: "PayPal",
                  icon: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg",
                },
                {
                  label: "Add new card",
                  icon: "https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg",
                },
                {
                  label: "Google Pay",
                  icon: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Google_Pay_Logo.svg",
                },
                {
                  label: "PayPal Credit",
                  icon: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg",
                },
              ].map((method, i) => (
                <label
                  key={i}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="payment"
                    className="w-5 h-5 accent-[#3665f3]"
                    defaultChecked={i === 0}
                  />
                  <img src={method.icon} alt={method.label} className="h-5" />
                  <span className="text-[15px] font-medium">
                    {method.label}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {/* ==== SHIP TO ==== */}
          <ShipTo />

          {/* REVIEW ORDER (Giữ nguyên) */}
          <section className="border-t border-gray-200 pt-6">
            <h2 className="text-[20px] font-semibold mb-6">Review order</h2>

            {cartItems.length === 0 ? (
              <p className="italic text-gray-500">Your cart is empty.</p>
            ) : (
              // Lặp qua các nhóm người bán
              cartItems.map((group) => (
                <div
                  key={group.seller._id}
                  className="border-b border-gray-200 pb-6 mb-6 last:border-b-0 last:pb-0"
                >
                  {/* Seller Header */}
                  <div className="flex items-center gap-2 text-[14px] text-gray-600 mb-1">
                    <span className="font-semibold">
                      Seller: {group.seller.username}
                    </span>
                    <span className="text-[12px] text-gray-500">
                      (99% positive feedback - mock)
                    </span>
                  </div>

                  {/* Lặp qua các sản phẩm trong nhóm */}
                  {group.products.map((item) => (
                    <div key={item._id} className="flex gap-4 pt-4">
                      <img
                        src={item.images?.[0]}
                        alt={item.description}
                        className="w-24 h-24 object-cover rounded-md border"
                      />
                      <div>
                        {/* Mock Sold/OldPrice data */}
                        <span className="bg-blue-100 text-[#0053a0] text-[11px] px-2 py-0.5 rounded-full font-semibold">
                          N/A SOLD (mock)
                        </span>

                        <p className="font-semibold text-[15px] mt-2">
                          {item.description}
                        </p>

                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-[15px] font-medium">
                            US ${item.price ? item.price.toFixed(2) : "0.00"}
                          </p>
                        </div>

                        {/* Nút + / - */}
                        <div className="flex items-center gap-3 mt-3">
                          <label className="text-[14px]">Quantity</label>
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(
                                  item._id,
                                  item.quantity,
                                  "decrement"
                                )
                              }
                              className="px-2 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-l-md disabled:opacity-50"
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="px-3 py-1 text-sm border-l border-r border-gray-300">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(
                                  item._id,
                                  item.quantity,
                                  "increment"
                                )
                              }
                              className="px-2 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-r-md"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item._id)}
                            className="text-[#3665f3] hover:underline text-[13px] bg-transparent border-none cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                        {/* Kết thúc nút */}

                        <div className="mt-3 text-[13px] text-gray-700 leading-6">
                          <p>
                            Delivery:{" "}
                            <span className="font-medium">
                              Dec 24 – Jan 16 (mock)
                            </span>
                          </p>
                          <p>eBay International Shipping</p>
                          <p>US $46.73 (mock shipping for this item)</p>
                          <p className="text-gray-500 text-[12px]">
                            Import fees may apply on delivery
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </section>

          {/* GIFT CARDS AND COUPONS (Đã sửa logic coupon) */}
          <section className="border-t border-gray-200 pt-6">
            <h2 className="text-[20px] font-semibold mb-5">Coupons</h2>
            <p className="text-[14px] mb-4">
              Apply coupons or add eBay gift cards to your account. Once added,
              gift cards can’t be removed.
            </p>
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter code"
                className="border border-gray-300 rounded-md px-3 py-2 w-[220px] focus:ring-2 focus:ring-[#3665f3] outline-none text-[14px]"
              />
              <button
                onClick={() => handleApplyCoupon(couponCode)}
                className="px-5 py-2 bg-gray-100 border border-gray-300 rounded-full text-[14px] font-medium hover:bg-gray-200"
              >
                Apply
              </button>
            </div>

            <div className="text-[14px] w-100 space-y-3 mb-[50px]">
              {Array.isArray(coupons) ? (
                <>
                  {coupons.map((coupon) => (
                    <label
                      className="flex items-center gap-2 cursor-pointer"
                      key={coupon._id}
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-[#3665f3]"
                      />
                      <span>{coupon.code ? coupon.code : ""}</span>
                      <span className="ml-auto text-gray-500 text-sm">
                        Available discount: {coupon.discountPercent}%
                      </span>
                    </label>
                  ))}
                </>
              ) : (
                <></>
              )}
            </div>
          </section>
        </div>

        {/* ==== RIGHT SIDE (Order Summary - ĐÃ CẬP NHẬT TỔNG TIỀN & DISCOUNT) ==== */}
        <div className="w-[30%]">
          <div className="sticky top-10 bg-[#f9f9f9] border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-[20px] font-semibold mb-5">Order Summary</h3>
            <div className="space-y-2 text-[15px] text-[#111820]">
              <div className="flex justify-between">
                <span>Items ({totalItemsCount})</span>
                {/* HIỂN THỊ SUB TOTAL MỚI (nếu có appliedCouponData) */}
                <span>US ${currentSubtotalUSD.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <div></div>
                <span>
                  VND{" "}
                  {(currentSubtotalUSD * USD_TO_VND_RATE).toLocaleString(
                    "vi-VN"
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping (mock)</span>
                <span>US ${shippingUSD.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <div></div>
                <span>
                  VND {(shippingUSD * USD_TO_VND_RATE).toLocaleString("vi-VN")}
                </span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Discount </span>
                {/* HIỂN THỊ DISCOUNT MỚI */}
                <span>-US ${currentDiscountUSD.toFixed(2)}</span>
              </div>
              <hr className="my-3 border-gray-300" />
              <div className="flex justify-between font-semibold text-[17px]">
                <span>Order total</span>
                {/* TỔNG TIỀN CUỐI CÙNG MỚI */}
                <span>US ${currentTotalUSD.toFixed(2)}</span>
              </div>
              <p className="text-sm text-gray-500">
                {(currentTotalUSD * USD_TO_VND_RATE).toLocaleString("vi-VN")}{" "}
                VND
              </p>
            </div>
            <p className="text-[12px] text-gray-500 mt-4 leading-5">
              With this purchase you agree to the{" "}
              <a href="#" className="text-[#3665f3] hover:underline">
                eBay International Shipping terms and conditions
              </a>
              .
            </p>
            <button className="w-full mt-6 py-3 bg-gray-300 text-gray-600 font-semibold rounded-full cursor-not-allowed">
              Confirm and pay
            </button>
            <p className="text-center text-xs text-gray-500 mt-3">
              Select a payment method
            </p>
            <p className="text-center text-xs text-gray-400 mt-4">
              Purchase protected by{" "}
              <a href="#" className="text-[#3665f3] hover:underline">
                eBay Money Back Guarantee
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* ==== MODAL ADDRESS SELECT ==== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[480px] rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-semibold mb-4">
              Select a shipping address
            </h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {addresses.map((addr, idx) => (
                <label
                  key={idx}
                  className={`block border rounded-lg p-4 cursor-pointer transition ${
                    selectedAddress === idx
                      ? "border-[#3665f3] bg-blue-50"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="address"
                      className="mt-1 w-5 h-5 accent-[#3665f3]"
                      checked={selectedAddress === idx}
                      onChange={() => setSelectedAddress(idx)}
                    />
                    <div className="text-sm">
                      <p className="font-medium">{addr.name}</p>
                      <p>{addr.address}</p>
                      <p>{addr.city}</p>
                      <p>{addr.country}</p>
                      <p>{addr.phone}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 text-sm font-medium rounded-full border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 text-sm font-medium rounded-full bg-[#3665f3] text-white hover:bg-[#2953c6]"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
