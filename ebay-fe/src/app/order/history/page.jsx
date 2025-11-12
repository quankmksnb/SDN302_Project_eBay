"use client";
import React from "react";

const purchases = [
  {
    id: "ORD-2024-001",
    shop: "UMIDIGI US Official Store",
    feedback: "96.1% positive feedback",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300",
    name: "UMIDIGI A11 Pro Max 6.8'' Unlocked Smartphone Android",
    variant: "Mist Blue, 4GB+128GB - New",
    qty: 1,
    usd: 115.19,
    vnd: 3029497,
    shippingUSD: 81.17,
    shippingVND: 2134771,
    offer: "Extra 17% off with coupon",
    status: "Delivered",
  },
  {
    id: "ORD-2024-002",
    shop: "C***e",
    feedback: "98.9% positive feedback",
    image:
      "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=300&fit=crop",
    name: "IRIS Connect 32GB Unlocked",
    variant: "New",
    qty: 1,
    usd: 27.99,
    vnd: 736137,
    shippingUSD: 46.73,
    shippingVND: 1228999,
    offer: null,
    status: "Delivered",
  },
];

export default function PurchaseHistory() {
  return (
    <div className="bg-white min-h-screen font-[Market Sans,Helvetica Neue,Helvetica,Arial,Roboto,sans-serif] px-10 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-10">
        My eBay – Purchase History
      </h1>

      <div className="space-y-10">
        {purchases.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.05)] p-6 hover:shadow-md transition-all"
          >
            {/* Seller Info */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-semibold text-gray-800 hover:underline cursor-pointer">
                  {item.shop}
                </p>
                <p className="text-gray-500 text-sm">{item.feedback}</p>
              </div>
            </div>

            {/* Product Row */}
            <div className="flex flex-col md:flex-row justify-between gap-6">
              {/* Left: image + info */}
              <div className="flex gap-5">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-28 h-28 rounded-lg object-cover"
                />
                <div>
                  <p className="text-sm bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full w-fit mb-1">
                    {item.status}
                  </p>
                  <p className="font-medium text-black leading-tight hover:text-blue-600 cursor-pointer">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{item.variant}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Order ID: {item.id}
                  </p>
                </div>
              </div>

              {/* Right: price & details */}
              <div className="text-right">
                <p className="font-semibold text-black text-lg">
                  US ${item.usd.toFixed(2)}
                </p>
                <p className="text-gray-500 text-sm">
                  ({item.vnd.toLocaleString()} VND)
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  + US ${item.shippingUSD.toFixed(2)} shipping (
                  {item.shippingVND.toLocaleString()} VND)
                </p>
                <p className="text-gray-400 text-xs">Returns accepted</p>
                <p className="text-gray-500 text-xs mt-1">
                  Qty: <span className="font-medium">{item.qty}</span>
                </p>
              </div>
            </div>

            {/* Offer + Actions */}
            {item.offer && (
              <div className="flex items-center mt-4 text-green-600 text-sm">
                <svg
                  className="w-5 h-5 mr-1 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Offer applied · {item.offer}</span>
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="flex justify-end mt-4 gap-6 text-sm text-blue-600">
              <button className="hover:underline">Request a return</button>
              <button className="hover:underline">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
