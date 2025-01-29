"use client";
import { useState, useEffect } from "react";
import Product from "./ProductCompo";
import { useSearchParams } from "next/navigation";

export default function ProductGrid12() {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(urlQuery);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (query.trim()) {
      setLoading(true);
      fetch(`http://127.0.0.1:8000/search?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => {
          setProducts(data.products || []); // Ensure `products` exists in response
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching products:", err);
          setError("Failed to load products. Please try again.");
          setLoading(false);
        });
    }
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {query ? `Search results for "${query}"` : "Featured Products"}
      </h2>

      {/* Loading State */}
      {loading && <p className="text-center text-gray-600">Loading products...</p>}

      {/* Error State */}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Products Grid */}
      {!loading && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Product key={product.id} {...product} />
          ))}
        </div>
      ) : (
        !loading && <p className="text-center text-gray-500">No products found.</p>
      )}
    </div>
  );
}

