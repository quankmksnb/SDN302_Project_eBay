import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ShipTo from "./Shipto";

const Checkout = () => {
  const router = useRouter();
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

  const items = [
    {
      id: 1,
      seller: "C***e",
      feedback: "98.9% positive feedback",
      sold: "314 SOLD",
      name: "IRIS Connect 32GB Unlocked",
      price: 27.99,
      oldPrice: 89.99,
      shipping: 46.73,
      delivery: "Dec 24 – Jan 16",
      image: "https://i.ebayimg.com/images/g/9WkAAOSwqXpmuKU2/s-l1600.jpg",
    },
    {
      id: 2,
      seller: "percomart",
      feedback: "97.5% positive feedback",
      sold: "265 SOLD",
      name: "BLU C5L MAX (Unlocked) Black 16GB 2GB RAM 5.7'' Quad-Core Android",
      price: 39.99,
      oldPrice: 89.95,
      shipping: 68.38,
      delivery: "Dec 23 – Jan 15",
      image: "https://i.ebayimg.com/images/g/9oEAAOSwjVVl1jWn/s-l1600.jpg",
    },
  ];

  const summary = {
    items: 223.16,
    shipping: 231.14,
    discount: 19.58,
    total: 434.72,
    totalVND: 11910137,
  };

  return (
    <div className="bg-white min-h-screen text-[#111820] font-[Market Sans,Helvetica Neue,Helvetica,Arial,Roboto,sans-serif] flex flex-col items-center">
      {/* ==== HEADER ==== */}
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

      {/* ==== BANNER ==== */}
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

      {/* ==== MAIN CONTENT ==== */}
      <div className="flex justify-between w-[90%] max-w-[1200px] mt-10 gap-10">
        {/* ==== LEFT SIDE ==== */}
        <div className="flex flex-col w-[68%] space-y-12">
          {/* ==== PAY WITH ==== */}
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

          {/* ==== REVIEW ORDER ==== */}
          <section className="border-t border-gray-200 pt-6">
            <h2 className="text-[20px] font-semibold mb-6">Review order</h2>
            {items.map((item) => (
              <div
                key={item.id}
                className="border-b border-gray-200 pb-6 mb-6 last:border-0"
              >
                <div className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-md border"
                  />
                  <div>
                    <div className="flex items-center gap-2 text-[13px] text-gray-600 mb-1">
                      <span>{item.seller}</span>
                      <span>·</span>
                      <a href="#" className="text-[#3665f3] hover:underline">
                        Add note for seller
                      </a>
                      <span>·</span>
                      <a href="#" className="text-[#3665f3] hover:underline">
                        Pay only this seller
                      </a>
                    </div>
                    <p className="text-[12px] text-gray-500">{item.feedback}</p>
                    <span className="bg-blue-100 text-[#0053a0] text-[11px] px-2 py-0.5 rounded-full font-semibold">
                      {item.sold}
                    </span>
                    <p className="font-semibold text-[15px] mt-2">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[15px] font-medium">
                        US ${item.price.toFixed(2)}
                      </p>
                      <p className="text-[13px] text-gray-500 line-through">
                        US ${item.oldPrice.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <label className="text-[14px]">Quantity</label>
                      <select className="border border-gray-300 rounded-md px-2 py-1 text-sm">
                        <option>1</option>
                      </select>
                      <a
                        href="#"
                        className="text-[#3665f3] hover:underline text-[13px]"
                      >
                        Remove
                      </a>
                    </div>
                    <div className="mt-3 text-[13px] text-gray-700 leading-6">
                      <p>
                        Delivery:{" "}
                        <span className="font-medium">{item.delivery}</span>
                      </p>
                      <p>eBay International Shipping</p>
                      <p>US ${item.shipping.toFixed(2)}</p>
                      <p className="text-gray-500 text-[12px]">
                        Import fees may apply on delivery
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* ==== GIFT CARDS AND COUPONS ==== */}
          <section className="border-t border-gray-200 pt-6">
            <h2 className="text-[20px] font-semibold mb-5">
              Gift cards and coupons
            </h2>
            <p className="text-[14px] mb-4">
              Apply coupons or add eBay gift cards to your account. Once added,
              gift cards can’t be removed.
            </p>
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                placeholder="Enter code"
                className="border border-gray-300 rounded-md px-3 py-2 w-[220px] focus:ring-2 focus:ring-[#3665f3] outline-none text-[14px]"
              />
              <button className="px-5 py-2 bg-gray-100 border border-gray-300 rounded-full text-[14px] font-medium hover:bg-gray-200">
                Apply
              </button>
            </div>
            <div className="text-[14px] space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-[#3665f3]" />
                <span>Coupon TOPFIND25</span>
                <span className="ml-auto text-gray-500 text-sm">
                  Available: US $5.00
                </span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-[#3665f3] mt-1"
                  defaultChecked
                />
                <div className="flex justify-between w-full">
                  <div>
                    <span className="block">Discount</span>
                    <span className="text-gray-700 text-sm">
                      USUMI2025SAVE15
                    </span>
                  </div>
                  <span className="text-green-600 text-sm font-medium">
                    Applied: US $19.58
                  </span>
                </div>
              </label>
            </div>
            <p className="text-[12px] text-gray-500 mt-5 flex items-start gap-1">
              <span className="text-blue-600 text-lg leading-none">ℹ</span>
              To apply a donation, you can’t be using gift cards, coupons, or
              reward points.
            </p>
          </section>
        </div>

        {/* ==== RIGHT SIDE (Order Summary) ==== */}
        <div className="w-[30%]">
          <div className="sticky top-10 bg-[#f9f9f9] border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-[20px] font-semibold mb-5">Order Summary</h3>
            <div className="space-y-2 text-[15px] text-[#111820]">
              <div className="flex justify-between">
                <span>Items (4)</span>
                <span>US ${summary.items.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>US ${summary.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-US ${summary.discount.toFixed(2)}</span>
              </div>
              <hr className="my-3 border-gray-300" />
              <div className="flex justify-between font-semibold text-[17px]">
                <span>Order total</span>
                <span>US ${summary.total.toFixed(2)}</span>
              </div>
              <p className="text-sm text-gray-500">
                {summary.totalVND.toLocaleString("vi-VN")} VND
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
