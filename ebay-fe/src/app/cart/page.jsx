"use client";
import Loading from "@/components/shared/Loading";
import React, { useEffect, useState } from "react";
import cartService from "@/services/cartService";

const Cart = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState({});
  const [cartItems, setCartItems] = useState([]);

  const summary = {
    items: 0,
    shipping: 0,
    discount: 0,
    total: 0,
  };

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
    const loadCart = async () => {
      try {
        const accessToken =
          localStorage.getItem("accessToken") ||
          sessionStorage.getItem("accessToken");
        if (accessToken) {
          const data = await cartService.getCart();
          const items = data?.items || data?.cart || [];
          setCartItems(items);
        } else {
          const items = cartService.getLocalCart();
          setCartItems(items);
        }
      } catch (err) {
        console.warn("Load cart error", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();

    const handler = async () => {
      try {
        const accessToken =
          localStorage.getItem("accessToken") ||
          sessionStorage.getItem("accessToken");
        if (accessToken) {
          const data = await cartService.getCart();
          const items = data?.items || data?.cart || [];
          setCartItems(items);
        } else {
          const items = cartService.getLocalCart();
          setCartItems(items);
        }
      } catch (err) {
        console.warn("cart_updated handler error", err);
      }
    };

    window.addEventListener("cart_updated", handler);
    return () => window.removeEventListener("cart_updated", handler);
  }, []);
  if (isLoading) return <Loading />;
  return (
    <div className="min-h-screen bg-white font-[Market Sans,Helvetica Neue,Helvetica,Arial,Roboto,sans-serif] flex flex-col items-center">
      {/* HEADER */}
      <div className="flex justify-between items-center w-[90%] max-w-[1200px] py-6 border-b border-gray-300">
        <h1 className="text-[28px] font-bold text-gray-900">Shopping cart</h1>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex justify-between w-[90%] max-w-[1200px] mt-8 gap-10">
        {/* LEFT COLUMN */}
        <div className="flex flex-col w-[68%] space-y-6">
          {cartItems.map((item, idx) => (
            <div
              key={item.productId || item.id || idx}
              className="border border-gray-200 rounded-2xl p-6 transition-all duration-200 hover:shadow-md"
            >
              {/* Seller Info */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-[14px] font-semibold">{item.seller}</p>
                  <p className="text-[12px] text-gray-500">{item.feedback}</p>
                </div>
                <a
                  href="#"
                  className="text-[#0654ba] text-sm font-medium hover:underline"
                >
                  Pay only this seller
                </a>
              </div>

              {/* Product Info */}
              <div className="flex justify-between gap-4">
                <img
                  src={
                    item.image ||
                    item.product?.image ||
                    item.productId?.image ||
                    item.product?.images?.[0]
                  }
                  alt={item.name}
                  className="w-[110px] h-[110px] object-cover rounded-lg border"
                />

                <div className="flex flex-col flex-1">
                  <span className="bg-[#e6f2ff] text-[#0053a0] text-[11px] font-semibold rounded-full px-2 py-0.5 w-fit">
                    {item.sold}
                  </span>

                  <a
                    href="#"
                    className="text-[#0654ba] font-semibold mt-1 hover:underline leading-snug"
                  >
                    {item.title || item.name || item.product?.title}
                  </a>
                  <p className="text-[13px] text-gray-700 mt-1">
                    {item.condition}
                  </p>
                  <p className="text-[13px] text-gray-600">{item.variant}</p>
                  <p className="text-[12px] text-gray-500 mt-2">
                    eBay International Shipping
                  </p>
                  <p className="text-[12px] text-gray-500">Returns accepted</p>

                  <div className="flex gap-4 text-[13px] mt-2">
                    <a href="#" className="text-[#0654ba] hover:underline">
                      Buy it now
                    </a>
                    <a href="#" className="text-[#0654ba] hover:underline">
                      Save for later
                    </a>
                    <a href="#" className="text-[#0654ba] hover:underline">
                      Remove
                    </a>
                  </div>
                </div>

                {/* Price Section */}
                <div className="text-right min-w-[180px]">
                  <div className="flex items-center justify-end gap-2">
                    <p className="text-sm text-gray-600">Qty</p>
                    <select
                      className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                      value={item.quantity}
                      onChange={(e) => {
                        const q = parseInt(e.target.value) || 1;
                        // update local or backend
                        const accessToken =
                          localStorage.getItem("accessToken") ||
                          sessionStorage.getItem("accessToken");
                        if (accessToken) {
                          cartService
                            .updateCartItem(
                              item.productId || item.id || item.product?._id,
                              q
                            )
                            .then(() => {
                              window.dispatchEvent(new Event("cart_updated"));
                            });
                        } else {
                          const items = cartService.getLocalCart();
                          const idx = items.findIndex(
                            (it) =>
                              it.productId ===
                              (item.productId || item.id || item.product?._id)
                          );
                          if (idx > -1) {
                            items[idx].quantity = q;
                            cartService.saveLocalCart(items);
                          }
                        }
                      }}
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                    </select>
                  </div>
                  <p className="font-semibold text-[15px] text-gray-900 mt-1">
                    US ${Number(item.priceUSD ?? item.price ?? 0).toFixed(2)}
                  </p>

                  <p className="text-[12px] text-gray-600">
                    (
                    {Number(
                      item.priceVND ?? (item.price ?? 0) * 23000
                    ).toLocaleString()}{" "}
                    VND)
                  </p>

                  <p className="text-[12px] text-gray-500">
                    + US ${Number(item.shippingUSD ?? 0).toFixed(2)} (
                    {Number(item.shippingVND ?? 0).toLocaleString()} VND)
                  </p>
                </div>
              </div>

              {/* Offer applied */}
              {item.hasOffer && (
                <div className="flex items-center gap-2 mt-4 border-t border-gray-100 pt-3 text-green-600 text-sm">
                  <span className="text-[18px] font-bold">✔</span>
                  <div>
                    <p className="font-semibold text-[14px]">Offer applied</p>
                    <p className="text-[12px] text-gray-700">
                      Extra 17% off with coupon
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN (sticky) */}
        <div className="w-[30%] flex flex-col space-y-4">
          <div className="sticky top-8">
            {/* Order Summary */}
            <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm">
              <div className="text-[14px] text-gray-700 space-y-2">
                <div className="flex justify-between">
                  <span>Items (4)</span>
                  <span>{summary.items.toLocaleString()} VND</span>
                </div>
                <div className="flex justify-between">
                  <span>
                    Shipping to 000084{" "}
                    <span className="text-gray-400 cursor-pointer">ⓘ</span>
                  </span>
                  <span>{summary.shipping.toLocaleString()} VND</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Discounts</span>
                  <span>-{summary.discount.toLocaleString()} VND</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-bold text-[18px]">
                  <span>Subtotal</span>
                  <span>{summary.total.toLocaleString()} VND</span>
                </div>
              </div>

              <button className="w-full bg-[#3665f3] text-white font-semibold py-3 mt-5 rounded-full hover:bg-[#2954d2] transition-all duration-200">
                Go to checkout
              </button>

              <p className="text-[12px] text-gray-500 text-center mt-3">
                Purchase protected by{" "}
                <a href="#" className="text-[#0654ba] hover:underline">
                  eBay Money Back Guarantee
                </a>
                .
              </p>
            </div>

            {/* Mastercard Offer */}
            <div className="bg-[#e7f3ff] border border-[#d0e4ff] rounded-2xl p-5 flex gap-3 items-center mt-4">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg"
                alt="eBay"
                className="w-8"
              />
              <div>
                <p className="text-[14px] text-gray-800 font-medium">
                  Earn up to 5X points with your eBay Mastercard®.
                </p>
                <a
                  href="#"
                  className="text-[#0654ba] text-[14px] hover:underline"
                >
                  See details
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
