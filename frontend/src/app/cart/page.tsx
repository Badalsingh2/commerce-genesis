"use client"; // Mark this as a Client Component since we're using state and event handlers

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash, CheckCircle, Plus, Minus } from "lucide-react";

// Define CartItem type based on the provided data structure
interface CartItem {
  productId: number;
  productName: string;
  quantity: number;
  totalPrice: string; // This is a string, so we need to parse it when calculating totals
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]); // Initialize state as an empty array
  const [loading, setLoading] = useState<boolean>(true); // Loading state to show a loading indicator
  const [error, setError] = useState<string | null>(null); // Error state to handle any errors

  // Fetch cart data from the backend on component mount
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        setLoading(true); // Set loading to true while fetching data
        const response = await fetch("http://127.0.0.1:8000/cart/2"); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch cart data");
        }
        const data = await response.json();
        setItems(data.cartItems); // Set cartItems from the response
      } catch (err: any) {
        setError("Failed to fetch cart data. Please try again.");
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchCartData();
  }, []); // Empty dependency array means this runs only once when the component mounts

  // Function to remove an item from the cart
  const handleRemoveItem = (productId: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
  };

  // Function to increase the quantity of an item
  const handleIncreaseQuantity = (productId: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1, totalPrice: (parseFloat(item.totalPrice) / item.quantity) * (item.quantity + 1) + "" }
          : item
      )
    );
  };

  // Function to decrease the quantity of an item
  const handleDecreaseQuantity = (productId: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1, totalPrice: (parseFloat(item.totalPrice) / item.quantity) * (item.quantity - 1) + "" }
          : item
      )
    );
  };

  // Function to calculate the total price of items in the cart
  const calculateTotal = () => {
    return items
      .reduce((total, item) => total + parseFloat(item.totalPrice), 0)
      .toFixed(2); // Sum all totalPrices and round to 2 decimal places
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
        {loading ? (
          <p className="text-gray-400 text-center">Loading cart...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : items.length === 0 ? (
          <p className="text-gray-400 text-center">Your cart is empty.</p>
        ) : (
          items.map((item) => (
            <Card key={item.productId} className="hover:shadow-lg transition-shadow bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl text-blue-400">
                  <Link href={`/cart/${item.productId}`} className="hover:text-blue-300">
                    {item.productName}
                  </Link>
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Price per Item: ${(parseFloat(item.totalPrice) / item.quantity).toFixed(2)}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <p className="text-gray-200">Quantity: {item.quantity}</p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDecreaseQuantity(item.productId)}
                      disabled={item.quantity === 1} // Disable if quantity is 1
                      className="p-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleIncreaseQuantity(item.productId)}
                      className="p-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  variant="destructive"
                  onClick={() => handleRemoveItem(item.productId)}
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
