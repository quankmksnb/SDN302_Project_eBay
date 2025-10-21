"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`http://localhost:9999/products/${id}`);
        const data = await res.json();
        if (data.success && data.product) {
          setProduct(data.product);
          setReviews(data.reviews || []);
        } else {
          console.error("API error:", data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadProduct();
  }, [id]);

  if (loading)
    return <p className="text-center mt-20 text-gray-600">Loading...</p>;
  if (!product)
    return <p className="text-center mt-20 text-red-500">No product found</p>;

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        {/* image */}
        <div className="flex-1">
          <img
            src={selectedImage || product.images?.[0] || "/placeholder.png"}
            alt={product.title}
            className="w-full h-80 object-cover rounded-lg shadow-md transition-all duration-300"
          />

          {product.images?.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Ảnh ${i + 1}`}
                  className={`w-20 h-20 object-cover rounded-md border cursor-pointer transition 
          ${selectedImage === img ? "ring-2 ring-green-500" : "hover:scale-105"}`}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          )}

        </div>

        {/* Details */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-gray-500 mt-1">{product.categoryId?.name}</p>
          <p className="text-2xl text-green-600 mt-3 font-semibold">${product.price}</p>
          <p className="mt-4 text-gray-700 leading-relaxed">{product.description}</p>
          <div className="flex gap-4 mt-5">
            <button
              className="flex-1 bg-white border border-blue-500 hover:bg-gainsboro hover:text-blue-600 text-blue font-medium py-2 rounded-lg transition"
            >
              Add to Cart
            </button>
            <button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
            >
              Buy it Now
            </button>
          </div>
          

          {/* Seller */}
          <div className="mt-6 flex items-center gap-3">
            <img
              src={product.sellerId?.avatarURL || "/user.png"}
              alt={product.sellerId?.username}
              className="w-10 h-10 rounded-full border"
            />
            <div>
              <p className="font-medium">{product.sellerId?.username}</p>
              <p className="text-sm text-gray-500">{product.sellerId?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- Reviews --- */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Customer reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-600">There are no reviews yet.</p>
        ) : (
          <ul className="space-y-4">
            {reviews.map((r) => (
              <li key={r._id} className="border p-4 rounded-lg bg-gray-50 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={r.reviewerId?.avatarURL || "/user.png"}
                    alt={r.reviewerId?.username}
                    className="w-8 h-8 rounded-full border"
                  />
                  <div>
                    <p className="font-medium">{r.reviewerId?.username}</p>
                    <p className="text-sm text-yellow-500">
                      {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700">{r.comment}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
