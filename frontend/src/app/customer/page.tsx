// src/app/page.tsx

"use client"; // Mark this as a Client Component since we're using interactivity

import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { users } from "@/data/data"; // Import user data

// Register chart elements
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Page() {
  // Combine purchases from all users
  const allPurchases = users.flatMap((user) => user.purchases);

  // Calculate total spending per category
  const categoryTotals = allPurchases.reduce((acc, purchase) => {
    acc[purchase.category] = (acc[purchase.category] || 0) + purchase.amount;
    return acc;
  }, {} as Record<string, number>);

  // Data for the Pie chart
  const pieData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9966FF"],
        hoverBackgroundColor: ["#FF4364", "#2592DB", "#DDBE46", "#3C8E40", "#7756CF"],
      },
    ],
  };

  // Data for the Bar chart (spending per user)
  const barData = {
    labels: users.map((user) => user.name),
    datasets: [
      {
        label: "Total Spending ($)",
        data: users.map((user) =>
          user.purchases.reduce((total, purchase) => total + purchase.amount, 0)
        ),
        backgroundColor: "#4CAF50",
        borderColor: "#388E3C",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="text-black bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">Combined User Analytics</h1>

      {/* Pie Chart - Spending by Category */}
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full md:w-2/3 mx-auto mb-8">
        <h2 className="text-xl font-semibold mb-4 text-center">Spending by Category</h2>
        <Pie data={pieData} />
      </div>

      {/* Bar Chart - Spending by User */}
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full md:w-2/3 mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-center">Spending by User</h2>
        <Bar data={barData} />
      </div>
    </div>
  );
}
