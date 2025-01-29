"use client"
import { useState, useEffect } from "react"
import axios from "axios"  // Import Axios
import Product from "@/components/Product"

export default function RandomProducts() {
  const [products, setProducts] = useState([])  // State to store the products
  const [loading, setLoading] = useState(true)  // State to manage the loading state
  const [error, setError] = useState(null)  // State to handle errors

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Make the API call to your Django backend using Axios
        const response = await axios.get('http://127.0.0.1:8000/products')

        // Set products state if the request is successful
        setProducts(response.data.products)
      } catch (err) {
        // Handle errors in the catch block
        setError("Error fetching products")
      } finally {
        // Set loading to false after data fetching is complete
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])  // Empty dependency array so this effect runs once when the component mounts

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Random Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Product key={product.id} {...product} />
        ))}
      </div>
    </div>
  )
}
