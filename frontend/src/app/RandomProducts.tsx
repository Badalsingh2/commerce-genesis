"use client"
import { useState, useEffect } from "react";
import axios from "axios";
import { Product, Products } from "@/lib/types";
import ProductCompo from "@/components/ProductCompo";

export default function Products() {
  const [products, setProducts] = useState<Products>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/products/', {
          withCredentials: true,  // Ensure authentication tokens are sent
        });

        // Take only the first 10 products
        setProducts(response.data.products.slice(0, 10));
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Random Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCompo key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}

// Ensure the component name matches and exists
function ProductCard({ id, title, mrp }) {
  return (
    <div className="p-4 border rounded-lg shadow">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-700">${mrp}</p>
    </div>
  );
}
