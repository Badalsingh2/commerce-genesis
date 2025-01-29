// src/app/[id]/page.tsx

"use client"; // Mark this as a Client Component since we're using interactivity

import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { users } from "@/data/data"; // Import user data
import { notFound } from "next/navigation";

// Register chart elements
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Page({ params }: { params: { id: string } }) {
  const user = users.find((user) => user.id === params.id);

  if (!user) {
    notFound(); // Show a 404 page if the user is not found
  }

  // Data for the Pie chart
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

  // Data for the Bar chart (spending per category)
  const barData = {
    labels: user.purchases.map((purchase) => purchase.category),
    datasets: [
      {
        label: "Spending ($)",
        data: user.purchases.map((purchase) => purchase.amount),
        backgroundColor: "#4CAF50",
        borderColor: "#388E3C",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="text-black bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">{user.name}'s Analytics</h1>

      {/* Pie Chart - Spending by Category */}
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full md:w-2/3 mx-auto mb-8">
        <h2 className="text-xl font-semibold mb-4 text-center">Spending by Category</h2>
        <Pie data={pieData} />
      </div>

      {/* Bar Chart - Spending by Category */}
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full md:w-2/3 mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-center">Spending by Category</h2>
        <Bar data={barData} />
      </div>
    </div>
  );
}