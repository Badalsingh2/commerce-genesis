"use client";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PaymentPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/payment/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: 1000 }), // Send the amount in cents (e.g., $10.00)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch payment intent.");
        }
        return response.json();
      })
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          throw new Error("No client secret returned.");
        }
      })
      .catch((err) => {
        setError(err.message);
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-10">
        <h1 className="text-4xl text-red-500">Error</h1>
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  const options = {
    clientSecret, // Pass the clientSecret here
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <main className="text-center mt-10">
        <h1 className="text-4xl text-blue-500 font-semibold">Stripe Payment Example</h1>
        <p className="text-lg text-gray-500">This is a demo of the Stripe Payment Element.</p>
        <CheckoutForm />
      </main>
    </Elements>
  );
}

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!stripe || !elements) {
    return null; // Ensure stripe and elements are loaded before rendering
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsProcessing(true);

    // Confirm payment with the provided clientSecret
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/success", // Ensure this matches your server's configuration
      },
    });

    if (error) {
      console.error(error.message);
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-5">
      <PaymentElement />
      <button
        type="submit"
        disabled={isProcessing}
        className="mt-3 px-4 py-2 bg-blue-500 text-white rounded"
      >
        {isProcessing ? "Processing..." : "Pay"}
      </button>
    </form>
  );
}
