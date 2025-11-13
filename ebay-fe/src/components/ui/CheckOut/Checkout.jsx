"use client";
import { SHIPPING_TOTAL_USD, USD_TO_VND_RATE } from "@/lib/constants";
import React, { useState, useEffect } from "react";
import cartService from "@/services/cartService";
import orderService from "@/services/orderService";
import { getAddresses } from "@/services/addressService";
import ShipTo from "@/components/ui/CheckOut/ShipTo";
import { useRouter } from "next/navigation";
import { getUserFromStorage } from "@/lib/utils";
import Loading from "@/components/shared/Loading";
import useModal from "../../../../hooks/useModal";
import AlertModal from "@/components/shared/AlertModal";

const Checkout = ({ cart = {}, coupons = [], onCartUpdate }) => {
  const [user, setUser] = useState(null);
  const cartItems = cart.items || [];
  const router = useRouter();
  const [couponCode, setCouponCode] = useState("");
  const totalItemsCount = cart.totalItems || 0;
  const [isProcessing, setIsProcessing] = useState(false);

  const [appliedCouponData, setAppliedCouponData] = useState(null);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const { isOpen, modalContent, showModal, hideModal, handleConfirm } =
    useModal();

  const fetchAddresses = async () => {
    try {
      const data = await getAddresses();
      setAddresses(data);

      const defaultAddress = data.find((addr) => addr.isDefault) || data[0];
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress._id);
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  useEffect(() => {
    const storedUser = getUserFromStorage(localStorage, sessionStorage);
    setUser(storedUser);
  }, []);

  if (!user) {
    return <Loading />;
  }

  const baseSubtotalUSD = parseFloat(cart.subtotal) || 0;
  const baseDiscountUSD = parseFloat(cart.discountTotal) || 0.0;
  const shippingUSD = SHIPPING_TOTAL_USD;

  const currentSubtotalUSD = appliedCouponData
    ? appliedCouponData.cartTotal
    : baseSubtotalUSD;

  const currentDiscountUSD = appliedCouponData
    ? appliedCouponData.discountAmount
    : baseDiscountUSD;

  const currentTotalUSD = currentSubtotalUSD + shippingUSD - currentDiscountUSD;

  const isAddressSelected = selectedAddressId !== null;
  const selectedAddress = addresses.find(
    (addr) => addr._id === selectedAddressId
  );

  // handlers
  const handleRemoveItem = async (productId) => {
    showModal({
      title: "Remove Item",
      message: "Are you sure you want to remove this item?",
      type: "confirm",
      onConfirm: async () => {
        try {
          await cartService.removeFromCart(productId);
          if (onCartUpdate) {
            onCartUpdate();
          }
        } catch (error) {
          console.error("Error removing item from cart:", error);
          showModal({
            title: "Error",
            message: "Failed to remove item from cart",
            type: "error",
          });
        }
      },
    });
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
      showModal({
        title: "Error",
        message: "Failed to update item quantity",
        type: "error",
      });
    }
  };

  const handleApplyCoupon = async (code) => {
    if (!code) {
      showModal({
        title: "Invalid Coupon",
        message: "Please enter a coupon code.",
        type: "warning",
      });
      return;
    }
    try {
      const data = await cartService.applyCoupon(code);
      setAppliedCouponData({
        discountAmount: data.discountAmount,
        cartTotal: data.cartTotal,
      });
      if (onCartUpdate) {
        onCartUpdate();
      }
      setCouponCode("");
      showModal({
        title: "Success",
        message: data.message || `Coupon "${code}" applied successfully!`,
        type: "success",
      });
    } catch (error) {
      console.error("Error applying coupon:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to apply coupon. Please check the code.";
      showModal({
        title: "Error",
        message: errorMessage,
        type: "error",
      });
    }
  };

  const handlePaymentSuccess = async () => {
    if (!isAddressSelected) {
      showModal({
        title: "Address Required",
        message: "Please select a shipping address before confirming payment.",
        type: "warning",
      });
      return;
    }

    if (cartItems.length === 0) {
      showModal({
        title: "Empty Cart",
        message: "Your cart is empty. Cannot create an order.",
        type: "warning",
      });
      return;
    }

    if (isProcessing) {
      return;
    }

    setIsProcessing(true);

    try {
      const orderItems = cartItems.flatMap((group) =>
        group.products.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
          unitPrice: item.price,
        }))
      );

      const orderPayload = {
        buyerId: user.id,
        addressId: selectedAddressId,
        totalPrice: parseFloat(currentTotalUSD.toFixed(2)),
        status: "Paid",
        items: orderItems,
        couponCodeApplied: appliedCouponData ? cart.couponCode : null,
        shippingCost: SHIPPING_TOTAL_USD,
        discountAmount: parseFloat(currentDiscountUSD.toFixed(2)),
      };

      console.log("=========================================");
      console.log("✅ Creating order with payload:");
      console.log(orderPayload);
      console.log("=========================================");

      const response = await orderService.createOrder(orderPayload);

      console.log("Order created successfully:", response);
      const clearCartResponse = await cartService.clearCart();
      console.log("Clear cart successfully:", clearCartResponse);
      if (onCartUpdate) {
        onCartUpdate();
      }

      const orderId = response.order?._id || response.orderId || response._id;

      showModal({
        title: "Order Created",
        message: "Your order has been created successfully!",
        type: "success",
        onConfirm: () => {
          if (orderId) {
            router.push(`/order/${orderId}`);
          } else {
            router.push("/orders");
          }
        },
      });
    } catch (error) {
      console.error("Order creation failed:", error);
      const errorMessage =
        error.message ||
        error.response?.data?.message ||
        "Failed to create order. Please try again.";
      showModal({
        title: "Order Failed",
        message: `Order creation failed: ${errorMessage}`,
        type: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <AlertModal
        open={isOpen}
        onClose={hideModal}
        title={modalContent.title}
        message={modalContent.message}
        type={modalContent.type}
        onConfirm={handleConfirm}
      />

      <div className="bg-white min-h-screen text-[#111820] font-[Market Sans,Helvetica Neue,Helvetica,Arial,Roboto,sans-serif] flex flex-col items-center">
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
          <p className="text-sm text-gray-500"></p>
        </div>

        {/* ==== MAIN CONTENT ==== */}
        <div className="flex justify-between w-[90%] max-w-[1200px] mt-10 gap-10">
          {/* ==== LEFT SIDE ==== */}
          <div className="flex flex-col w-[68%] space-y-12">
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

            <ShipTo
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              setSelectedAddressId={setSelectedAddressId}
              onAddressChange={fetchAddresses}
            />

            <section className="border-t border-gray-200 pt-6">
              <h2 className="text-[20px] font-semibold mb-6">Review order</h2>

              {cartItems.length === 0 ? (
                <p className="italic text-gray-500">Your cart is empty.</p>
              ) : (
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

                    {group.products.map((item) => (
                      <div key={item._id} className="flex gap-4 pt-4">
                        <img
                          src={item.images?.[0]}
                          alt={item.description}
                          className="w-24 h-24 object-cover rounded-md border"
                        />
                        <div>
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

                          <div className="mt-3 text-[13px] text-gray-700 leading-6">
                            <p>
                              Delivery:{" "}
                              <span className="font-medium">
                                Dec 24 — Jan 16 (mock)
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

            <section className="border-t border-gray-200 pt-6">
              <h2 className="text-[20px] font-semibold mb-5">Coupons</h2>
              <p className="text-[14px] mb-4">
                Apply coupons or add eBay gift cards to your account. Once
                added, gift cards can't be removed.
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
                <span className="font-bold text-[18px]">Coupons:</span>
                {Array.isArray(coupons) ? (
                  <>
                    {coupons.map((coupon) => (
                      <label
                        className="flex items-center gap-2 cursor-pointer"
                        key={coupon._id}
                      >
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

          {/* ==== RIGHT SIDE (Order Summary) ==== */}
          <div className="w-[30%]">
            <div className="sticky top-10 bg-[#f9f9f9] border border-gray-200 rounded-xl shadow-sm p-6">
              <h3 className="text-[20px] font-semibold mb-5">Order Summary</h3>
              <div className="space-y-2 text-[15px] text-[#111820]">
                <div className="flex justify-between">
                  <span>Items ({totalItemsCount})</span>
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
                    VND{" "}
                    {(shippingUSD * USD_TO_VND_RATE).toLocaleString("vi-VN")}
                  </span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Discount </span>
                  <span>
                    {" "}
                    {currentDiscountUSD > 0
                      ? `-US ${currentDiscountUSD.toFixed(2)}`
                      : "-"}
                  </span>
                </div>
                <hr className="my-3 border-gray-300" />
                <div className="flex justify-between font-semibold text-[17px]">
                  <span>Order total</span>
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
              <button
                onClick={handlePaymentSuccess}
                className={`w-full mt-6 py-3 font-semibold rounded-full ${
                  isAddressSelected && !isProcessing
                    ? "bg-[#3665f3] text-white hover:bg-[#2953c6]"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
                disabled={
                  !isAddressSelected || cartItems.length === 0 || isProcessing
                }
              >
                {isProcessing ? "Processing..." : "Confirm and pay"}
              </button>
              <p className="text-center text-xs text-gray-500 mt-3">
                {isAddressSelected
                  ? `Shipping to: ${selectedAddress?.fullname || ""}`
                  : "Please select a shipping address"}
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
      </div>
    </>
  );
};

export default Checkout;
