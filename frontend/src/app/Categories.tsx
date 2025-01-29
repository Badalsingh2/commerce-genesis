"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import ProductCompo from "@/components/ProductCompo";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);    // Store products for the selected category
  const [loading, setLoading] = useState(true);     // Loading state for categories and products
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);  // Store the selected category

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/categories/");
        setCategories(response.data.category_1); // Fetch categories
      } catch (err) {
        setError("Error fetching categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const fetchProductsByCategory = async (category) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/getproducts/?category_1=${category}`);
      setProducts(response.data.products);  // Assuming 'products' is returned in the response
    } catch (err) {
      setError("Error fetching products for this category");
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    fetchProductsByCategory(category);  // Fetch products when category is selected
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Categories</h2>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div key={index} className="bg-white shadow rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{category}</h3>
              <button
                onClick={() => handleCategoryClick(category)} // Trigger category click
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition duration-300"
              >
                Shop Now
              </button>
            </div>
          ))}
        </div>

        {/* Show Products for Selected Category */}
        {selectedCategory && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Products in {selectedCategory}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCompo key={product.id} {...product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
