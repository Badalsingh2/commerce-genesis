"use client";

import { useParams } from "next/navigation";
import {
    Star,
    ShoppingCart,
    BadgeDollarSign,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

ChartJS.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels);

interface Review {
    product: number;
    user_name: string;
    user_email: string;
    rating: number;
    comment: string;
    created_at?: string;
}

interface Product {
    id: number;
    title: string;
    description: string;
    image_links: string;
    product_rating: number;
    selling_price: string;
    mrp: string;
    seller_name: string;
    seller_rating: number;
}

interface ReviewFormData {
    user_name: string;
    user_email: string;
    rating: number;
    comment: string;
}

export default function ProductDetailPage() {
    const params = useParams();
    const productId = Number(params.id);

    const [product, setProduct] = useState<Product | null>(null);
    const [productReviews, setProductReviews] = useState<Review[]>([]);
    const [isReviewFormVisible, setIsReviewFormVisible] = useState(false);
    const [reviewData, setReviewData] = useState<ReviewFormData>({
        user_name: "",
        user_email: "",
        rating: 0,
        comment: "",
    });
    const [reviewSummary, setReviewSummary] = useState<string | null>(null);
    const [isSummarizing, setIsSummarizing] = useState(false);


    useEffect(() => {
        async function fetchProductData() {
            try {
                const response = await fetch(`http://127.0.0.1:8000/product/${productId}/`);
                const data = await response.json();

                if (response.ok) {
                    setProduct(data);
                    const reviewsResponse = await fetch(`http://127.0.0.1:8000/reviews/${productId}/`);
                    const reviewsData = await reviewsResponse.json();
                    setProductReviews(reviewsData.reviews || []);

                    // Concatenate reviews with comment length > 100
                    const reviewsWithLongComments = reviewsData.reviews?.filter(
                        (review: Review) => review.comment.length > 100
                    );

                    if (reviewsWithLongComments && reviewsWithLongComments.length > 0) {
                        const concatenatedComments = reviewsWithLongComments
                            .map((review) => review.comment)
                            .join(" "); // Concatenate all comments

                        fetchReviewSummary(concatenatedComments);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchProductData();
    }, [productId]);

    const fetchReviewSummary = async (concatenatedComments: string) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/reviews-and-summary/${productId}/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ comments: concatenatedComments }), // Send concatenated comments
            });

            if (response.ok) {
                const data = await response.json();
                if (data.summarized_comments) {
                    setReviewSummary(data.summarized_comments); // Only set summarized_comments
                } else {
                    console.error('Summarized comments not found in response:', data);
                    alert('Failed to generate summary.');
                }
            } else {
                console.error('Error fetching review summary:', response.statusText);
                alert('Error fetching summary. Please try again later.');
            }
        } catch (error) {
            console.error('Error fetching review summary:', error);
            alert('An error occurred while fetching the summary.');
        } finally {
            setIsSummarizing(false); // Ensure the summarizing state is reset once done
        }
    };
    if (!product) {
        return (
            <h1 className="text-center text-2xl mt-10 text-destructive">
                Product Not Found
            </h1>
        );
    }

    const ratingDistribution = [0, 0, 0, 0, 0];
    productReviews.forEach((review) => {
        const rating = Math.round(review.rating);
        if (rating >= 1 && rating <= 5) {
            ratingDistribution[rating - 1] += 1;
        }
    });

    const filteredRatingDistribution = ratingDistribution.filter(
        (rating) => rating > 0
    );

    const pieChartData = {
        labels: ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"].filter(
            (_, index) => ratingDistribution[index] > 0
        ),
        datasets: [
            {
                data: filteredRatingDistribution,
                backgroundColor: [
                    "rgba(255, 99, 132, 0.9)",
                    "rgba(54, 162, 235, 0.9)",
                    "rgba(255, 206, 86, 0.9)",
                    "rgba(75, 192, 192, 0.9)",
                    "rgba(153, 102, 255, 0.9)",
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: "Review Distribution",
                color: "hsl(var(--foreground))",
            },
            datalabels: {
                display: true,
                color: "white",
                font: {
                    weight: "bold" as const,
                    size: 14,
                },
                formatter: (value: number, context: any) => {
                    return `${context.chart.data.labels[context.dataIndex]}: ${value}`;
                },
            },
        },
        maintainAspectRatio: false,
        layout: {
            padding: 20,
        },
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setReviewData((prevData) => ({
            ...prevData,
            [name]: name === "rating" ? Number(value) : value,
        }));
    };

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (reviewData.user_name && reviewData.rating > 0 && reviewData.comment) {
            const newReview = {
                product: productId,
                user_name: reviewData.user_name,
                user_email: reviewData.user_email,
                rating: reviewData.rating,
                comment: reviewData.comment,
            };

            try {
                const response = await fetch("http://127.0.0.1:8000/add-review/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newReview),
                });

                if (response.ok) {
                    const newReviewData = await response.json();
                    setProductReviews((prevReviews) => [...prevReviews, newReviewData]);
                    setReviewData({
                        user_name: "",
                        user_email: "",
                        rating: 0,
                        comment: "",
                    });
                    setIsReviewFormVisible(false);
                } else {
                    alert("Error submitting review. Please try again.");
                }
            } catch (error) {
                console.error("Error submitting review:", error);
            }
        } else {
            alert("Please fill out all required fields.");
        }
    };
    const handleSummarizeClick = () => {
        const reviewsWithLongComments = productReviews.filter(
            (review: Review) => review.comment.length > 100
        );

        if (reviewsWithLongComments.length > 0) {
            const concatenatedComments = reviewsWithLongComments
                .map((review) => review.comment)
                .join(" "); // Concatenate all comments

            setIsSummarizing(true);
            fetchReviewSummary(concatenatedComments);
        } else {
            alert("No comments longer than 100 characters to summarize.");
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="max-w-5xl mx-auto p-6 rounded-xl mt-6 bg-background">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex justify-center">
                    <img
                        src={product.image_links || "/default-image.jpg"}
                        alt={product.title}
                        className="rounded-xl shadow-md w-80 h-80 object-cover"
                    />
                </div>

                <div className="flex flex-col space-y-4">
                    <h1 className="text-3xl font-bold text-foreground">{product.title}</h1>

                    <div className="flex items-center space-x-2 text-yellow-500">
                        <Star fill="currentColor" size={20} />
                        <span className="text-lg font-semibold text-foreground">
                            {product.product_rating} / 5
                        </span>
                    </div>

                    <div className="text-xl font-semibold">
                        <span className="text-green-600 dark:text-green-400">
                            {product.selling_price}
                        </span>
                        <span className="text-muted-foreground line-through ml-2">
                            {product.mrp}
                        </span>
                    </div>

                    <div className="flex items-center space-x-2 text-muted-foreground">
                        <BadgeDollarSign size={20} />
                        <span className="font-medium">
                            Sold by:{" "}
                            <span className="text-primary">{product.seller_name}</span>
                            <span className="text-foreground">
                                {" "}
                                ({product.seller_rating} ⭐)
                            </span>
                        </span>
                    </div>

                    <p className="text-muted-foreground">{product.description}</p>

                    <div className="flex m-5 space-x-7">
                        <Button className="w-fit">
                            <ShoppingCart className="mr-2" size={20} />
                            Add to Cart
                        </Button>
                        <Button onClick={() => alert('ar button clicked')}
                        >
                            ar
                        </Button>
                    </div>
                </div>
            </div>

            <div className="my-8 border-t border-border" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-foreground">Review Summary</h2>
                    <p className="text-muted-foreground">
                        Click the button below to generate a review summary from comments longer than 100 characters.
                    </p>

                    <Button onClick={handleSummarizeClick} className="w-fit">
                        Summarize Reviews
                    </Button>

                    {isSummarizing && <p className="mt-2 text-muted-foreground">Summarizing...</p>}

                    {reviewSummary && (
                        <Card className="mt-4">
                            <CardContent className="p-4">
                                <h3 className="font-semibold text-card-foreground">Summary</h3>
                                <p className="mt-2 text-card-foreground">{reviewSummary}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
                <div className="flex justify-center">
                    <div style={{ position: "relative", width: "100%", height: "300px" }}>
                        <Pie data={pieChartData} options={options} />
                    </div>
                </div>
            </div>

            <div className="my-8 border-t border-border" />

            <div className="space-y-4">
                <h2 className="flex justify-between text-2xl font-semibold text-foreground">
                    <p>Customer Reviews</p>

                    <div className="flex justify-end">
                        <Button
                            onClick={() => setIsReviewFormVisible(!isReviewFormVisible)}
                            variant="outline"
                        >
                            {isReviewFormVisible ? "Cancel" : "Write a Review"}
                        </Button>
                    </div>
                </h2>
                {isReviewFormVisible && (
                    <form onSubmit={handleReviewSubmit} className="mt-6 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="user_name">Name</Label>
                            <Input
                                type="text"
                                id="user_name"
                                name="user_name"
                                value={reviewData.user_name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="user_email">Email</Label>
                            <Input
                                type="email"
                                id="user_email"
                                name="user_email"
                                value={reviewData.user_email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="rating">Rating</Label>
                            <Input
                                type="number"
                                id="rating"
                                name="rating"
                                value={reviewData.rating}
                                onChange={handleInputChange}
                                min="1"
                                max="5"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="comment">Comment</Label>
                            <Textarea
                                id="comment"
                                name="comment"
                                value={reviewData.comment}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <Button type="submit">Submit Review</Button>
                    </form>
                )}

                <div className="mt-8">
                    <h3 className="text-xl font-semibold text-foreground">All Reviews</h3>

                    {productReviews.map((review) => (
                        <div key={review.user_email} className="border-b border-border py-4">
                            <div className="flex items-center justify-between">
                                <div className="font-medium text-foreground">
                                    {review.user_name}
                                </div>
                                <div className="text-muted-foreground text-sm">
                                    {formatDate(review.created_at || "")}
                                </div>
                            </div>

                            <div className="flex items-center space-x-1 text-yellow-500">
                                <Star fill="currentColor" size={18} />
                                <span className="font-semibold text-foreground">
                                    {review.rating} / 5
                                </span>
                            </div>

                            <p className="mt-2 text-muted-foreground">{review.comment}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
