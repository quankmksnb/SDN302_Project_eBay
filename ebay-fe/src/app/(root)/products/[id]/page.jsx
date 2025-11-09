"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProductById } from "@/services/productService";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await getProductById(id);
        if (data?.product) {
          setProduct(data.product);
          setReviews(data.reviews || []);
        } else {
          setProduct(data);
          setReviews(data.reviews || []);
        }
      } catch (err) {
        console.error(" Error fetching product:", err);
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
        {/* Image Section */}
        <div className="flex-1">
          <img
            src={
              selectedImage ||
              product.image ||
              product.images?.[0] ||
              "/placeholder.png"
            }
            alt={product.title}
            className="w-full h-80 object-cover rounded-lg shadow-md transition-all duration-300"
          />

          {/* Thumbnail list */}
          {product.images?.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Ảnh ${i + 1}`}
                  className={`w-20 h-20 object-cover rounded-md border cursor-pointer transition 
                    ${
                      selectedImage === img
                        ? "ring-2 ring-green-500"
                        : "hover:scale-105"
                    }`}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info Section */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-gray-500 mt-1">{product.categoryId?.name}</p>
          <p className="text-2xl text-black-600 mt-3 font-semibold">
            ${product.price?.toLocaleString()}
          </p>

          <div className="flex gap-4 mt-6">
            <button className="flex-1 bg-white border border-blue-500 hover:bg-gray-100 hover:text-blue-600 text-blue-600 font-medium py-2 rounded-lg transition">
              Add to cart
            </button>
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition">
              Buy now
            </button>
          </div>

          {/* Seller Info */}
          {product.sellerId && (
            <div className="mt-6 flex items-center gap-3">
              <img
                src={product.sellerId.avatarURL || "/user.png"}
                alt={product.sellerId.username}
                className="w-10 h-10 rounded-full border"
              />
              <div>
                <p className="font-medium">{product.sellerId.username}</p>
                <p className="text-sm text-gray-500">{product.sellerId.email}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-10">
        <div className="flex border-b border-gray-300 mb-6">
          <button
            onClick={() => setActiveTab("description")}
            className={`px-4 py-2 text-lg font-semibold ${
              activeTab === "description"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-4 py-2 text-lg font-semibold ${
              activeTab === "reviews"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            Customer Reviews ({reviews.length})
          </button>
        </div>

        {/* Description Tab */}
        {activeTab === "description" && (
  <section className="bg-white border border-gray-200 rounded-lg p-6">
    <div
      className="text-gray-700 leading-relaxed space-y-3 
        [&_h3]:text-lg [&_h3]:font-medium [&_h3]:mt-4 [&_h3]:mb-1
        [&_ul]:list-disc [&_ul]:ml-5 [&_li]:mb-1
        [&_strong]:font-semibold [&_strong]:text-gray-900"
      dangerouslySetInnerHTML={{ __html: product.description }}
    />
  </section>
)}


        {/* Reviews Tab */}
        {activeTab === "reviews" && (
  <section className="bg-white border border-gray-200 rounded-lg p-6">

    {reviews.length === 0 ? (
      <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
    ) : (
      <ul>
        {reviews.map((r, index) => (
          <li
            key={r._id}
            className={`py-4 ${index !== reviews.length - 1 ? "border-b border-gray-200" : ""}`}
          >
            <div className="flex items-center gap-3 mb-1">
              <img
                src={r.reviewerId?.avatarURL || "/user.png"}
                alt={r.reviewerId?.username}
                className="w-9 h-9 rounded-full border border-gray-300"
              />
              <div>
                <p className="font-medium text-gray-800">{r.reviewerId?.username}</p>
                <p className="text-sm text-yellow-500">
                  {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                </p>
              </div>
            </div>
            <p className="text-gray-700 leading-snug ml-12">{r.comment}</p>
            <p className="text-xs text-gray-400 mt-1 ml-12">
              {new Date(r.createdAt).toLocaleDateString("vi-VN")}
            </p>
          </li>
        ))}
      </ul>
    )}
  </section>
)}


      </div>
    </main>
  );
}
