"use client"
import Navbar from "@/components/Navbar";
import Hero from "./Hero";
import ProductGrid from "@/components/ProductGrid";
import Categories from "./Categories";
import RandomProducts from "./RandomProducts";
import Footer from "./Footer";
import { Chat } from "@/components/Chat";
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [inputMessage, setInputMessage] = useState('')
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <ProductGrid />
        <Categories />
        <RandomProducts />
      </main>
      <Footer />

      {/* Floating Chat Button */}
      <Button
        className="fixed bottom-5 right-5 md:bottom-10 md:right-10 z-50 p-4 rounded-full shadow-lg bg-primary text-white hover:bg-primary/90"
        onClick={() => setIsChatOpen(!isChatOpen)}
        style={{ position: 'fixed' }}
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      {/* Floating Chat UI */}
      {isChatOpen && (
        <Chat
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          isChatOpen={isChatOpen}
          setIsChatOpen={setIsChatOpen}
        />
      )}
    </div>
  );
}
