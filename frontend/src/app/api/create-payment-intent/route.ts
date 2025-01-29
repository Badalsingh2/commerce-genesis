// app/api/create-payment-intent/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 1000, // Amount in cents
        currency: 'usd',
        payment_method_types: ['card'],
        return_url: 'http://localhost:3000/success', 
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
