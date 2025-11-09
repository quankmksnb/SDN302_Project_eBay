"use client";
import React, { useEffect, useState } from "react";
import { getProducts } from "@/services/productService";
import { getCategories } from "@/services/categoryService";
import { useRouter } from "next/navigation";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      const params = {
        page,
        limit: 8,
        name: search,
        category: selectedCategory || undefined,
        order,
      };
      const data = await getProducts(params);
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, selectedCategory, search, order]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data.categories || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);
  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">List of products</h1>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>{cat.name}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-60"
        />

        <div className="flex items-center gap-2">
          <span>Sort by price:</span>
          <button
            onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
            className="border border-gray-300 px-3 py-2 rounded-lg"
          >
            {order === "asc" ? "high " : " low"}
          </button>
        </div>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-items-center gap-4">
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          products.map((p) => (
            <div
              key={p._id}
              className="cursor-pointer hover:scale-105 transition-transform w-56"
              onClick={() => router.push(`/products/${p._id}`)}
            >
              <div className="w-full h-60 overflow-hidden rounded-lg">
                <img
                  src={p.images?.[0] || "/placeholder.png"}
                  alt={p.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mt-2 text-center h-22 flex flex-col justify-between">
                <h3 className="font-medium text-base line-clamp-2 h-12">
                  {p.title}
                </h3>
                <div>
                  <p className="text-gray-900 font-bold text-medium">
                    ${p.price.toLocaleString()}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {p.categoryId?.name || "No category"}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>



      <div className="flex justify-center items-center mt-8 gap-3">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50"
        >
          Before
        </button>
        <span>
          Page {page}/{totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50"
        >
          After
        </button>
      </div>
    </div>
  );
}
