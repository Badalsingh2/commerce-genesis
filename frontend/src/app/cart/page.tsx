// src/cart/page.tsx

"use client"; // Mark this as a Client Component since we're using state and event handlers

import { useState } from "react";
import Link from "next/link";
import { CartItem, cartItems } from "@/data/cartItems";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash, CheckCircle, Plus, Minus } from "lucide-react";

export default function CartPage() {
  // Initialize state with cartItems
  const [items, setItems] = useState<CartItem[]>(cartItems);

  // Function to remove an item from the cart
  const handleRemoveItem = (itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  // Function to increase the quantity of an item
  const handleIncreaseQuantity = (itemId: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId && item.quantity < item.stock // Ensure quantity doesn't exceed stock
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Function to decrease the quantity of an item
  const handleDecreaseQuantity = (itemId: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId && item.quantity > 1 // Ensure quantity doesn't go below 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Function to calculate the total price of items in the cart
  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  // Function to confirm the order
  const handleConfirmOrder = () => {
    alert("Order confirmed! Thank you for your purchase.");
    setItems([]); // Clear the cart after confirming the order
  };

  return (
    <div className="p-6 max-w-4xl mx-auto w-full md:w-[70%] lg:w-[50%] xl:w-[40%] bg-gray-900 text-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">Your Cart</h1>
      <div className="space-y-6">
        {items.length === 0 ? (
          <p className="text-gray-400 text-center">Your cart is empty.</p>
        ) : (
          items.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl text-blue-400">
                  <Link href={`/cart/${item.id}`} className="hover:text-blue-300">
                    {item.name}
                  </Link>
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Price: ${item.price.toFixed(2)}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <p className="text-gray-200">Quantity: {item.quantity}</p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDecreaseQuantity(item.id)}
                      disabled={item.quantity === 1} // Disable if quantity is 1
                      className="p-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleIncreaseQuantity(item.id)}
                      disabled={item.quantity === item.stock} // Disable if quantity equals stock
                      className="p-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <img
                  src={item.image || "https://via.placeholder.com/150"}
                  alt={item.name}
                  className="w-48 h-48 md:h-64 object-cover rounded-lg border border-gray-700"
                />
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  variant="destructive"
                  onClick={() => handleRemoveItem(item.id)}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
                >
                  <Trash className="h-4 w-4" />
                  Remove
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
      {items.length > 0 && (
        <>
          <div className="my-6 border-t border-gray-700" /> {/* Divider */}
          <div className="mt-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-400">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-gray-200">Total: ${calculateTotal()}</p>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
                  onClick={handleConfirmOrder}
                >
                  <CheckCircle className="h-5 w-5" />
                  Confirm Order
                </Button>
              </CardFooter>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}