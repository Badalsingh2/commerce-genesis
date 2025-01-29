// src/cart/[id]/page.tsx

"use client"; // Mark this as a Client Component since we're using state and event handlers

import { useState } from "react";
import { notFound } from "next/navigation";
import { CartItem, cartItems } from "@/data/cartItems";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

interface Props {
  params: {
    id: string;
  };
}

export default function CartItemDetail({ params }: Props) {
  const item = cartItems.find((item) => item.id === params.id);

  if (!item) {
    notFound(); // Show a 404 page if the item is not found
  }

  const [quantity, setQuantity] = useState(item.quantity);

  // Function to increase the quantity
  const handleIncreaseQuantity = () => {
    if (quantity < item.stock) {
      setQuantity(quantity + 1);
    }
  };

  // Function to decrease the quantity
  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="flex justify-center p-6 max-w-4xl mx-auto">
      <Card className="hover:shadow-lg transition-shadow w-[40%]">
        <CardHeader>
          <CardTitle className="text-2xl">{item.name}</CardTitle>
          <CardDescription className="text-gray-600">
            Category: {item.category}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <img
            src={item.image || "https://via.placeholder.com/150"}
            alt={item.name}
            className="size-80 object-cover rounded-lg"
          />
          <p className="text-lg font-semibold">Price: ${item.price.toFixed(2)}</p>
          <div className="flex items-center justify-between">
            <p className="text-gray-700">Quantity: {quantity}</p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDecreaseQuantity}
                disabled={quantity === 1} // Disable if quantity is 1
                className="p-2"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleIncreaseQuantity}
                disabled={quantity === item.stock} // Disable if quantity equals stock
                className="p-2"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-gray-700">Description: {item.description}</p>
          <p className="text-gray-700">Stock: {item.stock}</p>
        </CardContent>
      </Card>
    </div>
  );
}