"use client";

import { useParams } from "next/navigation";
import {
  Star,
  ShoppingCart,
  BadgeDollarSign,
  MessageSquareText,
} from "lucide-react";
import { useState } from "react";
import products from "@/data/product";
import reviews from "@/data/reviews";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Importing the plugin

ChartJS.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels); // Registering the plugin

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Number(params.id);

  const product = products.find((p) => p.id === productId);
  const productReviews = reviews.filter(
    (review) => review.productId === productId
  );

  const [isReviewFormVisible, setIsReviewFormVisible] = useState(false);
  const [reviewData, setReviewData] = useState({
    user: "",
    rating: 0,
    comment: "",
  });

  const [submittedReviews, setSubmittedReviews] = useState(productReviews);

  const ratingDistribution = [0, 0, 0, 0, 0];

  submittedReviews.forEach((review) => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingDistribution[review.rating - 1] += 1;
    }
  });

  // Remove zero ratings from the pie chart data
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
          "rgba(255, 99, 132, 0.9)",  // Bright Red
          "rgba(54, 162, 235, 0.9)",  // Bright Blue
          "rgba(255, 206, 86, 0.9)",  // Bright Yellow
          "rgba(75, 192, 192, 0.9)",  // Bright Green
          "rgba(153, 102, 255, 0.9)", // Bright Purple
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
        display: false, // Hide legend as it's now inside the pie chart
      },
      title: {
        display: true,
        text: "Review Distribution",
      },
      datalabels: {
        display: true,
        color: "white",
        font: {
          weight: "bold",
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
      [name]: value,
    }));
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (reviewData.user && reviewData.rating > 0 && reviewData.comment) {
      const newReview = {
        id: submittedReviews.length + 1,
        productId: productId,
        user: reviewData.user,
        rating: Number(reviewData.rating),
        comment: reviewData.comment,
      };

      setSubmittedReviews((prevReviews) => [...prevReviews, newReview]);
      setReviewData({ user: "", rating: 0, comment: "" });
      setIsReviewFormVisible(false);
    } else {
      alert("Please fill out all fields.");
    }
  };

  const toggleReviewForm = () => {
    setIsReviewFormVisible(!isReviewFormVisible);
  };

  if (!product) {
    return (
      <h1 className="text-center text-2xl mt-10 text-red-600">
        Product Not Found
      </h1>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-6">
      {/* Product Image & Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex justify-center">
          <img
            src={product.image_links}
            alt={product.title}
            className="rounded-xl shadow-md w-80 h-80 object-cover"
          />
        </div>

        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold text-black">{product.title}</h1>

          <div className="flex items-center space-x-2 text-yellow-500">
            <Star fill="yellow" size={20} />
            <span className="text-lg font-semibold">
              {product.product_rating} / 5
            </span>
          </div>

          <div className="text-xl font-semibold text-gray-800">
            <span className="text-green-600">{product.selling_price}</span>
            <span className="text-gray-500 line-through ml-2">
              {product.mrp}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-gray-600">
            <BadgeDollarSign size={20} />
            <span className="font-medium">
              Sold by:{" "}
              <span className="text-blue-600">{product.seller_name}</span> (
              {product.seller_rating} ⭐)
            </span>
          </div>

          <p className="text-gray-700">{product.description}</p>

          <div className="flex space-x-4 mt-4">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition">
              <ShoppingCart size={20} />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="my-8 border-t border-gray-300" />

      {/* Review Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Description part */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Review Summary</h2>
          <p className="mt-2 text-gray-600">
            The review summary chart below shows the distribution of ratings given
            by customers. The number of reviews in each star category reflects the
            overall satisfaction level of customers with the product.
          </p>
        </div>

        {/* Pie chart part */}
        <div className="flex justify-center">
          <div style={{ position: "relative", width: "100%", height: "300px" }}>
            <Pie data={pieChartData} options={options} />
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="my-8 border-t border-gray-300" />

      {/* Reviews Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold flex items-center space-x-2 text-gray-800">
          <MessageSquareText size={24} />
          <span>Customer Reviews</span>
        </h2>

        {submittedReviews.length > 0 ? (
          <div className="space-y-4 mt-4">
            {submittedReviews.map((review) => (
              <div
                key={review.id}
                className="p-4 border rounded-lg shadow-sm bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-black">{review.user}</h3>
                  <div className="flex items-center text-yellow-500">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} fill="yellow" size={16} />
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mt-4">No reviews yet.</p>
        )}
      </div>

      {/* Review Form */}
      <div className="mt-8">
        <button
          onClick={toggleReviewForm}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {isReviewFormVisible ? "Cancel" : "Add a Review"}
        </button>

        {isReviewFormVisible && (
          <form className="mt-6 space-y-4" onSubmit={handleReviewSubmit}>
            <div className="bg-black p-3 rounded-lg">
              <label className="block text-gray-600" htmlFor="user">
                //Add Backend Here For Fetching Name
              </label>
              ››‹
            </div>

            <div>
              <label className="block text-gray-600" htmlFor="rating">
                Rating
              </label>
              <input
                type="number"
                id="rating"
                name="rating"
                min="1"
                max="5"
                value={reviewData.rating}
                onChange={handleInputChange}
                className="mt-2 w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-gray-600" htmlFor="comment">
                Your Review
              </label>
              <textarea
                id="comment"
                name="comment"
                value={reviewData.comment}
                onChange={handleInputChange}
                className="mt-2 w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Submit Review
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}