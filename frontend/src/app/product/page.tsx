"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Product } from "@/lib/types";
import ProductCompo from "@/components/ProductCompo";

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/products/', {
          withCredentials: true,  // Ensure authentication tokens are sent if needed
        });

        // Assuming the response data contains the products list
        setProducts(response.data.products);
      } catch (err) {
        setError("Error fetching products");
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
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Product List</h1>
      {/* Grid layout to display 3 items per row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id}>
            <Link href={`/product/${product.id}`} className="text-blue-600 hover:underline">
              <ProductCompo key={product.id} {...product} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
