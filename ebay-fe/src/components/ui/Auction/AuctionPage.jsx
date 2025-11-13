"use client";

import { useState, useEffect } from "react";

// Ẩn tên giống eBay: k***9
function maskName(name) {
  if (!name) return "";
  if (name.length <= 2) return name + "***";
  return name[0] + "***" + name[name.length - 1];
}

export default function AuctionPage() {
  // ======= FAKE PRODUCT =======
  const [product] = useState({
    _id: "TEST123",
    title: 'Apple Macbook Air 13.3" Intel Core i3 8GB 256GB SSD 2020 Gold',
    image:
      "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/macbook-air-gold-select-201810?wid=2000&hei=2000&fmt=jpeg&qlt=95&.v=1664472289053",
    shipping: "FREE Expedited Shipping",
    auctionEndTime: Date.now() + 1000 * 60 * 60 * 10,
  });

  // ======= FAKE BID HISTORY =======
  const [bids, setBids] = useState([
    {
      _id: "1",
      username: "k***9",
      bidAmount: 510,
      createdAt: new Date("2024-01-15T10:23:00"),
    },
    {
      _id: "2",
      username: "9***m",
      bidAmount: 500,
      createdAt: new Date("2024-01-14T17:12:00"),
    },
    {
      _id: "3",
      username: "t***p",
      bidAmount: 430,
      createdAt: new Date("2024-01-14T16:45:00"),
    },
  ]);

  const [bidAmount, setBidAmount] = useState("");
  const [timeLeft, setTimeLeft] = useState("");

  // Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      const diff = product.auctionEndTime - Date.now();
      if (diff <= 0) {
        setTimeLeft("Auction ended");
        clearInterval(timer);
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h} hrs ${m} mins ${s} secs`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handlePlaceBid = () => {
    if (!bidAmount) return alert("Please enter your bid.");
    const amount = Number(bidAmount);
    const highest = bids[0].bidAmount;

    if (amount <= highest)
      return alert("Your bid must be higher than the current bid.");

    const newBid = {
      _id: Date.now().toString(),
      username: "y***u",
      bidAmount: amount,
      createdAt: new Date(),
    };

    setBids([newBid, ...bids]);
    setBidAmount("");
  };

  const highestBid = bids.length ? bids[0].bidAmount : 0;

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 font-sans text-[17px]">
      {/* TITLE */}
      <h1 className="text-3xl font-semibold mb-6">Bid History</h1>

      {/* PRODUCT CARD */}
      <div className="border p-6 rounded-xl bg-white shadow-lg">
        <div className="flex gap-8">
          <img
            src={product.image}
            alt="item"
            className="w-40 h-40 object-contain rounded-lg border"
          />

          <div className="flex-1">
            <h2 className="font-semibold text-2xl mb-2">{product.title}</h2>

            <p className="text-gray-700 text-lg">
              <strong>Current bid:</strong>{" "}
              <span className="text-3xl font-bold text-gray-900">
                ${highestBid.toLocaleString()}
              </span>
            </p>

            <p className="text-gray-700 mt-2 text-lg">
              <strong>Shipping:</strong> {product.shipping}
            </p>

            <p className="text-gray-700 mt-2 text-lg">
              <strong>Bids:</strong> {bids.length}
            </p>

            <p className="text-gray-700 mt-2 text-lg">
              <strong>Time left:</strong>{" "}
              <span className="text-red-600 font-semibold">{timeLeft}</span>
            </p>
          </div>
        </div>

        {/* INPUT BID */}
        <div className="mt-6 flex gap-4">
          <input
            type="number"
            className="border rounded-lg px-4 py-3 w-72 text-lg"
            placeholder={`Enter $${highestBid + 1} or more`}
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
          />
          <button
            onClick={handlePlaceBid}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            Place bid
          </button>
        </div>
      </div>

      {/* BID TABLE */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Bid history</h2>

        <div className="border rounded-xl overflow-hidden shadow-md">
          <table className="w-full text-left text-lg">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-4">Bidder</th>
                <th className="p-4">Bid Amount</th>
                <th className="p-4">Bid Time</th>
              </tr>
            </thead>

            <tbody>
              {bids.map((b) => (
                <tr key={b._id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{maskName(b.username)}</td>
                  <td className="p-4 font-semibold text-gray-900">
                    ${b.bidAmount.toLocaleString()}
                  </td>
                  <td className="p-4 text-gray-700">
                    {new Date(b.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {bids.length === 0 && (
            <div className="p-6 text-center text-gray-500 text-lg">
              No bids placed yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
