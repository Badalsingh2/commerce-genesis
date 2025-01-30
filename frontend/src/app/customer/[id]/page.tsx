"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { users } from "@/data/data";
import { notFound } from "next/navigation";

// Register chart elements
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Page() {
  const params = useParams();
  const userId = params.id as string;
  const user = users.find((user) => user.id === userId);

  if (!user) {
    notFound();
  }

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const pieData = {
    labels: user.purchases.map((purchase) => purchase.category),
    datasets: [
      {
        data: user.purchases.map((purchase) => purchase.amount),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9966FF"],
        hoverBackgroundColor: ["#FF4364", "#2592DB", "#DDBE46", "#3C8E40", "#7756CF"],
      },
    ],
  };

  const handlePieClick = (event: any, elements: any[]) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      setSelectedCategory(user.purchases[index].category);
    }
  };

  // ** Calculate Monthly Expenditure **
  const monthlyExpenditure = new Array(12).fill(0); // Array for 12 months (Jan - Dec)

  user.purchases.forEach((purchase) => {
    purchase.products.forEach((product) => {
      const monthIndex = new Date(product.purchaseDate).getMonth(); // Get month (0-11)
      const price = parseFloat(product.price.replace("$", "")); // Remove $ and convert to number
      monthlyExpenditure[monthIndex] += price;
    });
  });

  const barData = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
    datasets: [
      {
        label: "Monthly Spending ($)",
        data: monthlyExpenditure,
        backgroundColor: "#4CAF50",
        borderColor: "#388E3C",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="text-black bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">
        {user.name}'s Analytics
      </h1>

      {/* Pie Chart and Purchase Details (Side by Side) */}
      <div className="flex flex-col md:flex-row justify-center items-start gap-8 w-full md:w-2/3 mx-auto">
        {/* Pie Chart */}
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full md:w-1/2">
          <h2 className="text-xl font-semibold mb-4 text-center">Spending by Category</h2>
          <Pie data={pieData} options={{ onClick: handlePieClick }} />
        </div>

        {/* Purchase Details */}
        {selectedCategory && (
          <div className="bg-white p-8 rounded-2xl shadow-lg w-full md:w-1/2">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Purchases in {selectedCategory}
            </h2>
            {user.purchases
              .find((purchase) => purchase.category === selectedCategory)
              ?.products.map((product, index) => (
                <div key={index} className="bg-gray-100 p-4 rounded-lg mb-4 shadow">
                  <p>
                    <strong>Product:</strong> {product.name}
                  </p>
                  <p>
                    <strong>Brand:</strong> {product.brand}
                  </p>
                  <p>
                    <strong>Price:</strong> {product.price}
                  </p>
                  <p>
                    <strong>Purchase Date:</strong> {product.purchaseDate}
                  </p>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Monthly Expenditure Bar Chart */}
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full md:w-2/3 mx-auto mt-8">
        <h2 className="text-xl font-semibold mb-4 text-center">Monthly Expenditure</h2>
        <Bar data={barData} />
      </div>
    </div>
  );
}
