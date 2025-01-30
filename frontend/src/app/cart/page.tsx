"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash, CheckCircle, Plus, Minus, ShoppingCart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe("pk_test_51PXp2oIxKA4SqfaM2SFwVQVZBJ9bmcWnh2HgtcYashdagjEWjDthFk8Gn8Oj7wfu0jBldTMBMiE3UnUEuKkPm3mH00uW5HX8qL");

interface CartItem {
  productId: number;
  productName: string;
  quantity: number;
  totalPrice: string;
}

function CheckoutForm({ total }: { total: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/orders",
      },
    });

    if (error) {
      console.error(error);
      // Add error handling here
    }
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <div className="flex items-center justify-between mt-4">
        <p className="text-2xl font-semibold text-foreground">
          Total: ${total}
        </p>
        <Button
          type="submit"
          size="lg"
          disabled={isProcessing || !stripe || !elements}
          className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isProcessing ? "Processing..." : (
            <>
              <CheckCircle className="h-5 w-5" />
              Pay Now
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/cart/2");
        if (!response.ok) throw new Error("Failed to fetch cart data");
        const data = await response.json();
        setItems(data.cartItems);
      } catch (err) {
        setError("Failed to load cart. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchCartData();
  }, []);

  const handleQuantityChange = (productId: number, delta: number) => {
    setItems(prev => prev.map(item =>
      item.productId === productId && item.quantity + delta > 0
        ? {
          ...item,
          quantity: item.quantity + delta,
          totalPrice: ((parseFloat(item.totalPrice) / item.quantity) * (item.quantity + delta)).toFixed(2)
        }
        : item
    ));
  };

  const calculateTotal = () =>
    items.reduce((total, item) => total + parseFloat(item.totalPrice), 0).toFixed(2);

  const handleCheckout = async () => {
    setIsProcessingCheckout(true);
    try {
      const totalAmount = parseFloat(calculateTotal()) * 100;
      const response = await fetch("http://localhost:3001/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: totalAmount }),
      });
      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error) {
      setError("Failed to initialize payment. Please try again.");
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 md:p-6 max-w-4xl mx-auto"
    >
      <div className="flex items-center gap-3 mb-6">
        <ShoppingCart className="h-7 w-7 text-primary" />
        <h1 className="text-2xl font-semibold text-foreground">Your Cart</h1>
      </div>

      <div className="space-y-4">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-[120px] w-full rounded-lg" />
          ))
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive"
          >
            {error}
          </motion.div>
        ) : items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4 p-8 text-center border rounded-lg"
          >
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">Your cart is empty</p>
            <Button asChild variant="secondary">
              <Link href="/" className="text-foreground">
                Continue Shopping
              </Link>
            </Button>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {items.map(item => (
              <motion.div
                key={item.productId}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                  exit: { opacity: 0, x: -20 }
                }}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
              >
                <Card className="bg-card hover:bg-card/90 transition-colors">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-foreground">
                      {item.productName}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      ${(parseFloat(item.totalPrice) / item.quantity).toFixed(2)} per item
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.productId, -1)}
                          disabled={item.quantity === 1}
                          className="h-8 w-8 p-0 border-muted-foreground/30 text-foreground"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </Button>
                        <span className="w-6 text-center text-foreground">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.productId, 1)}
                          className="h-8 w-8 p-0 border-muted-foreground/30 text-foreground"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setItems(prev => prev.filter(i => i.productId !== item.productId))}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash className="h-4 w-4 mr-1.5" />
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {items.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 sticky bottom-0 bg-background/95 backdrop-blur-lg rounded-lg p-4 shadow-xl border"
        >
          {clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm total={calculateTotal()} />
            </Elements>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-semibold text-foreground">
                  ${calculateTotal()}
                </p>
              </div>
              <Button
                size="lg"
                onClick={handleCheckout}
                disabled={isProcessingCheckout}
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isProcessingCheckout ? "Processing..." : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    Checkout
                  </>
                )}
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
