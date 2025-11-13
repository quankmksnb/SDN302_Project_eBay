"use client";
import HistoryProductDetail from "@/components/ui/HistoryProductDetail/HistoryProductDetail";
import React, { useState } from "react";

const STATUS_OPTIONS = [
  "All",
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Canceled",
  "RequestReturned",
  "Returned",
];

const formatNum = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);

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

  // TEST DATA
  {
    id: "ORD-2024-010",
    shop: "Official Xiaomi Store",
    feedback: "97.8% positive feedback",
    image:
      "https://images.unsplash.com/photo-1580910051074-7cb1e97f7d5a?w=300&fit=crop",
    name: "Xiaomi MiBand 7 Pro",
    variant: "Black - Global Version",
    qty: 1,
    usd: 48.99,
    vnd: 1287943,
    shippingUSD: 12.2,
    shippingVND: 310000,
    offer: "Summer Sale 10% off",
    status: "Pending",
  },
  {
    id: "ORD-2024-011",
    shop: "Samsung VN",
    feedback: "98.2% positive feedback",
    image:
      "https://images.unsplash.com/photo-1598327105740-c3e6d3aa8c8c?w=300&fit=crop",
    name: "Samsung Galaxy Buds 2",
    variant: "Olive Green - New",
    qty: 1,
    usd: 89.99,
    vnd: 2350000,
    shippingUSD: 9.5,
    shippingVND: 250000,
    offer: null,
    status: "Processing",
  },
  {
    id: "ORD-2024-012",
    shop: "Baseus Store",
    feedback: "95.6% positive feedback",
    image:
      "https://images.unsplash.com/photo-1606813895281-fb9caddfb9f2?w=300&fit=crop",
    name: "Baseus 65W GaN Fast Charger",
    variant: "Black - 65W",
    qty: 1,
    usd: 29.99,
    vnd: 760000,
    shippingUSD: 5.2,
    shippingVND: 130000,
    offer: null,
    status: "Shipped",
  },
  {
    id: "ORD-2024-013",
    shop: "Sony Store",
    feedback: "99.1% positive feedback",
    image:
      "https://images.unsplash.com/photo-1606041008023-472dfb5e530b?w=300&fit=crop",
    name: "Sony WH-1000XM5 Headphones",
    variant: "Silver - New",
    qty: 1,
    usd: 288.5,
    vnd: 7400000,
    shippingUSD: 20.0,
    shippingVND: 490000,
    offer: null,
    status: "Canceled",
  },
  {
    id: "ORD-2024-014",
    shop: "Anker Store",
    feedback: "97.1% positive feedback",
    image:
      "https://images.unsplash.com/photo-1612810806563-4a6b6bb33870?w=300&fit=crop",
    name: "Anker PowerCore 20,000mAh",
    variant: "Black - New",
    qty: 1,
    usd: 42.5,
    vnd: 1080000,
    shippingUSD: 8.1,
    shippingVND: 210000,
    offer: "Free cable bundle",
    status: "RequestReturned",
  },
  {
    id: "ORD-2024-015",
    shop: "Logitech Store",
    feedback: "98.5% positive feedback",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&fit=crop",
    name: "Logitech MX Keys Wireless Keyboard",
    variant: "Black - New",
    qty: 1,
    usd: 98.9,
    vnd: 2500000,
    shippingUSD: 14.0,
    shippingVND: 350000,
    offer: null,
    status: "Returned",
  },
];

export default function PurchaseHistory() {
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filtered =
    selectedStatus === "All"
      ? purchases
      : purchases.filter((p) => p.status === selectedStatus);

  return (
    <div className="bg-white min-h-screen px-10 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">
        My eBay – Purchase History
      </h1>

      {/* ===========================
          STATUS TABS LIKE EBAY
      ============================ */}
      <div className="flex items-center gap-3 overflow-x-auto pb-3 mb-10">
        {STATUS_OPTIONS.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`
              whitespace-nowrap px-5 py-2 rounded-full text-sm border transition-all
              ${
                selectedStatus === status
                  ? "bg-black text-white border-black shadow-sm"
                  : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
              }
            `}
          >
            {status}
          </button>
        ))}
      </div>

      {/* ===========================
          ORDER LIST
      ============================ */}
      <div className="space-y-10">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition"
          >
            <div className="flex justify-between mb-4">
              <div>
                <p className="font-semibold text-gray-800">{item.shop}</p>
                <p className="text-gray-500 text-sm">{item.feedback}</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex gap-5">
                <img
                  src={item.image}
                  className="w-28 h-28 rounded-lg object-cover"
                />
                <div>
                  <p className="text-sm bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full w-fit mb-1">
                    {item.status}
                  </p>
                  <p className="font-medium text-black">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.variant}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Order ID: {item.id}
                  </p>
                </div>
              </div>

              {/* PRICE AREA */}
              <div className="text-right">
                <p className="font-semibold text-black text-lg">
                  US ${item.usd.toFixed(2)}
                </p>
                <p className="text-gray-500 text-sm">
                  ({formatNum(item.vnd)} VND)
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  + US ${item.shippingUSD.toFixed(2)} shipping (
                  {formatNum(item.shippingVND)} VND)
                </p>
                <p className="text-gray-500 text-xs mt-1">Qty: {item.qty}</p>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-end gap-6 mt-4 text-blue-600 text-sm">
              <button className="hover:underline">Request a return</button>
              <button className="hover:underline">Remove</button>
            </div>
          </div>
        ))}
      </div>

      <HistoryProductDetail />
    </div>
  );
}
