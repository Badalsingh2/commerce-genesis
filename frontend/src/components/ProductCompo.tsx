import { Product } from "@/lib/types";
import { StarIcon, ShoppingCart, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function ProductCompo({
    id,
    category_1,
    category_2,
    category_3,
    title,
    product_rating,
    selling_price,
    mrp,
    seller_name,
    seller_rating,
    description,
    highlights,
    image_links,
}: Product) {
    const [isAdding, setIsAdding] = useState(false);
    const userId = "2";
    const { toast } = useToast();

    const handleAddToCart = async () => {
        setIsAdding(true);
        try {
            const response = await fetch("http://127.0.0.1:8000/add-to-cart/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    productId: id,
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

    const discountPercentage = mrp && selling_price < mrp
        ? Math.round(((mrp - selling_price) / mrp) * 100)
        : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
        >
            <Card className="overflow-hidden group">
                <Link href={`/product/${id}`} className="block">
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
                            <Badge 
                                className="absolute top-2 right-2 bg-green-500 hover:bg-green-600"
                            >
                                {discountPercentage}% OFF
                            </Badge>
                        )}
                    </div>

                    <CardContent className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {title}
                        </h3>
                        
                        <div className="flex items-center space-x-1 mb-3">
                            <div className="flex items-center bg-green-50 px-2 py-1 rounded-full">
                                <StarIcon className="h-4 w-4 text-green-500 fill-green-500" />
                                <span className="ml-1 text-sm font-medium text-green-700">
                                    {product_rating}
                                </span>
                            </div>
                            <div className="text-sm text-gray-500">|</div>
                            <div className="flex items-center text-sm text-gray-600">
                                <span className="font-medium">{seller_name}</span>
                                <StarIcon className="h-4 w-4 text-yellow-400 ml-1" />
                                <span className="ml-1">{seller_rating}</span>
                            </div>
                        </div>

                        <div className="flex items-baseline gap-2 mb-3">
                            <span className="text-2xl font-bold text-gray-900">
                                ${selling_price}
                            </span>
                            {mrp && selling_price < mrp && (
                                <span className="text-sm text-gray-500 line-through">
                                    ${mrp}
                                </span>
                            )}
                        </div>
                    </CardContent>
                </Link>

                <CardFooter className="p-4 pt-0">
                    <Button 
                        className="w-full group relative"
                        onClick={handleAddToCart}
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
            </Card>
        </motion.div>
    );
}