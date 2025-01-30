import { loadStripe } from '@stripe/stripe-js';
import './App.css'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';


function App() {
  console.log("api key ", import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  const stripePromise = loadStripe("pk_test_51QmGomG8kJZPTCwvnuAg5CXLMbprsT3K6l8G4sIveH1P19sgTUedeXFAdqK1BXzLKlkPBYPDpN66ZVDcFODWEk3u003jJYqGLW")
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    fetch("http://localhost:3001/create-payment-intent", {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data)
        setClientSecret(data.clientSecret)
      })
      .catch((error) => {
        console.error("Error fetching clientSecret:", error);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false)
      });
  }, [])

  if (loading) {
    return (
      <div className='text-center mt-10 gap-4'>
        Loading...
      </div>
    )

  }

  if (error) {
    return (
      <div className='text-center mt-10 gap-4'>
        <h1 className="text-4xl text-red-500 font-semibold">Error</h1>
        <p className="text-lg text-gray-500">
          {error}
        </p>
      </div>
    )
  }

  const options = {
    clientSecret: clientSecret as string,
  }
  return (
    <Elements stripe={stripePromise} options={options}>
      <main>
        <h1 className="text-4xl text-blue-500 font-semibold">Stripe Payment Example</h1>
        <p className="text-lg text-gray-500">
          This is a demo of the Stripe Payment Element.
        </p>
        <p className="text-lg text-gray-500">
          You can use this to process payments in your app.
        </p>
        <p className="text-lg text-gray-500">
          Major code is placed in main.tsx.
        </p>
      </main>
      <CheckoutForm />
    </Elements>
  )
}

function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)

  if (!stripe || !elements) {
    return null
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsProcessing(true)
    const { error } = await stripe?.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3001/success",
      }
    })

    if (error) {
      console.error(error);
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button>{isProcessing ? "Processing..." : "Pay"}</button>
    </form>
  )
}

export default App
