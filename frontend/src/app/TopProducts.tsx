"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Product } from "@/lib/types";
import ProductCard from "./product/[id]/ProductCard";
import ProductCompo from "@/components/ProductCompo";

export default function TopProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/recommend/2/", {
          withCredentials: true, // Ensure authentication tokens are sent
        });

        // Use recommended_products instead of products
        setProducts(response.data.recommended_products.slice(0, 6));
      } catch (err) {
        setError("Error fetching recommended products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCompo key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}