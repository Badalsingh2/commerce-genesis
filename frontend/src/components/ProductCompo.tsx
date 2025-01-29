import { Product } from "@/lib/types";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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
    const [addError, setAddError] = useState<string | null>(null);
    const [addSuccess, setAddSuccess] = useState<string | null>(null);

    // Dynamically fetch user ID (if available via context or session)
    const userId = "2"; // Replace this with the actual user ID from session/context

    const handleAddToCart = async () => {
        setIsAdding(true);
        setAddError(null);
        setAddSuccess(null);

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

            const data = await response.json();
            setAddSuccess("Item successfully added to cart!");
        } catch (err: any) {
            setAddError(err.message || "An unexpected error occurred");
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div key={id} className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-all">
            <Link href={`/product/${id}`} className="block">
                <div className="w-full h-48 relative mb-4">
                    <Image
                        src={image_links || "/placeholder.svg"}
                        alt={title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                    />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <div className="flex items-center mb-2">
                    <StarIcon className="h-5 w-5 text-yellow-400" />
                    <span className="ml-1 text-sm text-gray-600">{product_rating}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold text-gray-900">
                        ${selling_price}
                    </span>
                    {mrp && selling_price < mrp && (
                        <span className="text-sm text-green-600 font-medium line-through">
                            ${mrp}
                        </span>
                    )}
                </div>
                <div className="flex items-center">
                    <span className="text-sm text-gray-600">Seller: {seller_name}</span>
                    <div className="ml-2 flex items-center">
                        <StarIcon className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm text-gray-600">{seller_rating}</span>
                    </div>
                </div>
            </Link>

            <div className="mt-4">
                <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="px-4 py-2 bg-blue-500 text-white rounded mt-2 w-full"
                >
                    {isAdding ? "Adding..." : "Add to Cart"}
                </button>

                {addError && <p className="text-red-500 text-sm mt-2">{addError}</p>}
                {addSuccess && <p className="text-green-500 text-sm mt-2">{addSuccess}</p>}
            </div>
        </div>
    );
}
