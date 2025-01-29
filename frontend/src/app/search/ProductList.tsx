"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarIcon, Clock, Users, ShoppingBasket } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { EnhancedPagination } from "./EnhancedPagination";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Product, Products } from "@/lib/types";

//TODO: go to line 61 and remove the - 1 from the product id
export function ProductList({ products, itemsPerPage }: { products: Products; itemsPerPage: number }) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  function handleAddToCart(product: Product) {
    const cart = JSON.parse(localStorage.getItem('cartItems') || '[]');

    // Check if the product already exists in the cart
    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex >= 0) {
      // If product already exists in cart, just update the quantity
      cart[existingProductIndex].quantity += 1;
    } else {
      // Otherwise, add the product with quantity 1
      const productWithQuantity = { ...product, quantity: 1 };
      cart.push(productWithQuantity);
    }

    // Save the updated cart back to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cart));
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <StarIcon
        key={index}
        className={`w-4 h-4 ${index < rating
          ? "text-yellow-400 fill-yellow-400"
          : "text-gray-300 fill-gray-300"
          }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">All Products</h2>
        <Badge variant="secondary">{products.length} items</Badge>
      </div>

      <EnhancedPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paginatedProducts.map((product) => (
          <Card
            key={product.id}
            className="group hover:shadow-lg transition-all duration-200 overflow-hidden"
            onClick={() => router.push(`/product/${product.id - 1}`)}
          >
            <div className="sm:flex items-start p-4 gap-6">
              {/* Image Section */}
              <div className="relative h-48 sm:h-40 sm:w-40 mb-4 sm:mb-0 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={product.image || "/api/placeholder/400/320"}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>

              {/* Content Section */}
              <div className="flex-grow gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold line-clamp-1">{product.name}</h3>
                </div>

                <div className="flex items-center pt-2 justify-between">
                  <div className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</div>
                  <Button variant="outline" className="shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product)
                    }}
                  >
                    <ShoppingBasket /> Add to Basket
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <EnhancedPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
