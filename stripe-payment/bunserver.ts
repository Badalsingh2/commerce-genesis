import { serve } from "bun";
import Stripe from "stripe";

console.log(process.env.STRIPE_SECRET_KEY);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

serve({
  port: 3001,
  fetch: async (req) => {
    const url = new URL(req.url);

    if (req.method === "POST" && url.pathname === "/create-payment-intent") {
      try {
        // Fetch cart data
        const cartResponse = await fetch("http://localhost:8000/cart/2");
        if (!cartResponse.ok) {
          throw new Error('Failed to fetch cart');
        }
        const data = await cartResponse.json();

        // Calculate amount in cents
        const totalPrice = parseFloat(data.totalPrice);
        const amount = Math.round(totalPrice * 100); // Convert dollars to cents

        if (amount < 50) { // Stripe's minimum for USD is 50 cents
          throw new Error('Amount must be at least $0.50');
        }

        // Create Stripe Payment Intent
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount,
          currency: "usd",
          automatic_payment_methods: { enabled: true }
        });

        return new Response(
          JSON.stringify({ clientSecret: paymentIntent.client_secret }),
          { headers: { "Content-Type": "application/json" }, status: 200 }
        );
      } catch (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { headers: { "Content-Type": "application/json" }, status: 500 }
        );
      }
    }

    if (req.method === "GET" && url.pathname === "/success") {
      return new Response("Payment successful!");
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log("Server running on http://localhost:3001");
