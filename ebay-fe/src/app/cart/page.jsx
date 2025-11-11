"use client";
import Loading from "@/components/shared/Loading";
import React, { useEffect, useState } from "react";

const Cart = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState({});
  const cartItems = [
    {
      id: 1,
      seller: "UMIDIGI US Official Store",
      feedback: "96.1% positive feedback",
      image: "https://i.ebayimg.com/images/g/6qEAAOSw~oFkBlY5/s-l1600.jpg",
      name: "UMIDIGI A11 Pro Max 6.8'' Unlocked Smartphone Android International Version AT&T",
      sold: "270 SOLD",
      condition: "New",
      variant: "Mist Blue, 4GB+128GB",
      priceUSD: 115.19,
      priceVND: 3030649,
      shippingUSD: 81.17,
      shippingVND: 2135583,
      hasOffer: true,
    },
    {
      id: 2,
      seller: "C***e",
      feedback: "98.9% positive feedback",
      image: "https://i.ebayimg.com/images/g/9WkAAOSwqXpmuKU2/s-l1600.jpg",
      name: "IRIS Connect 32GB Unlocked",
      sold: "314 SOLD",
      condition: "New",
      variant: "Black 32GB",
      priceUSD: 27.99,
      priceVND: 736417,
      shippingUSD: 46.73,
      shippingVND: 1229466,
      hasOffer: false,
    },
  ];

  const summary = {
    items: 5871340,
    shipping: 6081294,
    discount: 515150,
    total: 11437484,
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
    setIsLoading(false);
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
          {cartItems.map((item) => (
            <div
              key={item.id}
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
                  src={item.image}
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
                    {item.name}
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
                    <select className="border border-gray-300 rounded-md px-2 py-1 text-sm">
                      <option>1</option>
                      <option>2</option>
                    </select>
                  </div>
                  <p className="font-semibold text-[15px] text-gray-900 mt-1">
                    US ${item.priceUSD.toFixed(2)}
                  </p>
                  <p className="text-[12px] text-gray-600">
                    ({item.priceVND.toLocaleString()} VND)
                  </p>
                  <p className="text-[12px] text-gray-500">
                    + US ${item.shippingUSD.toFixed(2)} (
                    {item.shippingVND.toLocaleString()} VND)
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
