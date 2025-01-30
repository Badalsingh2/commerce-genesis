"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Product } from "@/lib/types";
import ProductCompo from "@/components/ProductCompo";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

export default function TopProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/recommend/2/", {
          withCredentials: true,
        });
        setProducts(response.data.recommended_products.slice(0, 6));
      } catch (err) {
        setError("Error fetching recommended products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6 sm:mb-8">
            Top Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-0">
                  <Skeleton className="h-40 sm:h-48 w-full" />
                  <div className="p-4">
                    <Skeleton className="h-4 w-2/3 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className={cn(
      "w-full",
      "bg-background", // Uses theme background
      "border-t", // Add subtle separation
      "dark:border-border" // Theme-aware border
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between mb-6 sm:mb-8"
        >
          <h2 className={cn(
            "text-2xl sm:text-3xl font-bold tracking-tight",
            "bg-gradient-to-r from-primary to-primary/60", // Uses theme primary color
            "dark:from-primary dark:to-primary/60", // Dark mode variant
            "bg-clip-text text-transparent"
          )}>
            Top Products
          </h2>
          <div className={cn(
            "h-1 w-20 sm:w-32",
            "bg-gradient-to-r from-primary to-primary/60",
            "dark:from-primary dark:to-primary/60",
            "rounded-full"
          )} />
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={item}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "transform transition-all duration-200",
                "hover:shadow-lg",
                "dark:hover:shadow-primary/5 dark:text-white", // Subtle glow in dark mode
                "rounded-lg",
                "bg-card", // Theme-aware background
                "border border-border" // Theme-aware border
              )}
            >
              <ProductCompo {...product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
