"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { vendors, VendorProfile, ProductCategory } from "@/data/vendor";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// Define the props for the VendorDashboard component
interface VendorDashboardProps {
  vendor: VendorProfile;
}

const VendorDashboard: React.FC<VendorDashboardProps> = ({ vendor }) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  const router = useRouter();

  // Data for the revenue bar chart
  const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Monthly Revenue ($)",
        data: vendor.revenueData,
        backgroundColor: "#36A2EB",
      },
    ],
  };

  // Data for the pie chart
  const pieData = {
    labels: vendor.productCategories.map((item) => item.category),
    datasets: [
      {
        data: vendor.productCategories.map((item) => item.totalSales),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF4364", "#2592DB", "#DDBE46"],
      },
    ],
  };

  // Handle click events on the pie chart
  const handleClick = (event: any, elements: any) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      setSelectedCategory(vendor.productCategories[index]);
    }
  };

  return (
    <div className="bg-gray-100 p-6 text-black">
      <div className="flex flex-col md:flex-row items-center justify-center min-h-screen p-6">
        {/* Vendor Profile Section */}
        <div className="bg-white p-5 rounded-2xl shadow-lg w-2/5 mb-2 md:mb-0 mr-8">
          <h2 className="text-xl font-semibold mb-4 text-center">Vendor Profile</h2>
          <p><strong>Name:</strong> {vendor.name}</p>
          <p><strong>Category:</strong> {vendor.category}</p>
          <p><strong>Email:</strong> {vendor.email}</p>

          {selectedCategory && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Products in {selectedCategory.category}:
              </h3>
              <ul className="mt-2">
                {selectedCategory.products.map((product, index) => (
                  <li key={index} className="bg-gray-100 p-3 rounded-lg mb-2 shadow">
                    <p><strong>Product:</strong> {product.name}</p>
                    <p><strong>Brand:</strong> {product.brand}</p>
                    <p><strong>Price:</strong> {product.price}</p>
                    <p><strong>Stock:</strong> {product.stock}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Pie Chart Section */}
        <div className="bg-white p-8 rounded-2xl shadow-lg w-2/5">
          <h2 className="text-xl font-semibold mb-4 text-center">Product Sales Distribution</h2>
          <Pie data={pieData} options={{ onClick: handleClick }} />
        </div>
      </div>

      {/* Revenue Graph Section */}
      <div className="bg-white p-8 rounded-2xl shadow-lg mt-6 mx-auto w-3/5">
        <h2 className="text-xl font-semibold mb-4 text-center">Revenue in Last Year</h2>
        <Bar data={revenueData} />
      </div>

      {/* Back Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => router.push("/vendor")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Vendors
        </button>
      </div>
    </div>
  );
};

export default VendorDashboard;