"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Product, Products } from "@/lib/types";
import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge"; // Ensure this component exists
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence } from "framer-motion";

export default function Products() {
    const [products, setProducts] = useState<Products>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [predictedPrices, setPredictedPrices] = useState<Record<number, number>>({});
    const [isAdding, setIsAdding] = useState(false);
    const userId = "2";
    const { toast } = useToast();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/products/', {
                    withCredentials: true,
                });

                const fetchedProducts = response.data.products.slice(1, 12);
                setProducts(fetchedProducts);

                fetchedProducts.forEach((product: Product) => {
                    fetchPredictedPrice(product.id);
                });

            } catch (err) {
                setError("Error fetching products");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const fetchPredictedPrice = async (productId: number) => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/predict/", {
                product_id: productId,
                user_id: 1
            });

            setPredictedPrices((prevPrices) => ({
                ...prevPrices,
                [productId]: response.data.prediction?.[0] ?? "N/A"
            }));
        } catch (err) {
            console.error(`Error fetching predicted price for product ${productId}:`, err);
        }
    };

  if (loading) {
    return <div>Loading...</div>;
  }

    if (error) {
        return <div className="text-red-500 text-center mt-8">{error}</div>;
    }

    const handleAddToCart = async (productId: number) => {
        setIsAdding(true);
        try {
            const response = await fetch("http://127.0.0.1:8000/add-to-cart/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    productId: productId,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to add item to cart");
            }

            toast({
                title: "Success",
                description: "Item added to cart successfully",
                duration: 2000,
            });
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.message || "An unexpected error occurred",
                variant: "destructive",
                duration: 3000,
            });
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Random Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map(({ id, title, mrp, image_links, discountPercentage }) => (
                    <div key={id} className="p-4 border rounded-lg shadow">
                        <div className="relative">
                            <motion.div
                                className="w-full h-56 relative overflow-hidden"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Image
                                    src={image_links || "/placeholder.svg"}
                                    alt={title}
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-t-lg"
                                />
                            </motion.div>
                            {discountPercentage && (
                                <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">
                                    {discountPercentage}% OFF
                                </Badge>
                            )}
                        </div>

                        <h3 className="text-lg font-semibold mt-2">{title}</h3>
                        <p className="text-gray-700">MRP: ₹{mrp}</p>
                        <p className="text-blue-600">
                            Dynamic Pricing: {predictedPrices[id] ? `₹${predictedPrices[id]}` : "Loading..."}
                        </p>
                        <CardFooter className="p-4 pt-0">
                            <Button
                                className="w-full group relative"
                                onClick={() => handleAddToCart(id)} // Pass productId here
                                disabled={isAdding}
                                variant="default"
                            >
                                <motion.div
                                    initial={false}
                                    animate={{ x: isAdding ? 20 : 0, opacity: isAdding ? 0 : 1 }}
                                    className="flex items-center justify-center gap-2"
                                >
                                    <ShoppingCart className="h-4 w-4" />
                                    Add to Cart
                                </motion.div>
                                {isAdding && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="absolute inset-0 flex items-center justify-center"
                                    >
                                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    </motion.div>
                                )}
                            </Button>
                        </CardFooter>
                    </div>
                ))}
            </div>
        </div>
    );
}