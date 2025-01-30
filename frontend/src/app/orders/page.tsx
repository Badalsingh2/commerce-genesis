"use client";
import OrderComponent from "@/components/OrdersComponent";
import React, { useEffect, useState } from "react";

const OrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [trackingNumber, setTrackingNumber] = useState<string>("");
    const [trackingStatus, setTrackingStatus] = useState<any | null>(null);
    const [trackingLoading, setTrackingLoading] = useState<boolean>(false);
    const [trackingError, setTrackingError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/orders/2");
                if (!response.ok) {
                    throw new Error("Failed to fetch orders data");
                }
                const data = await response.json();
                setOrders(data.orders);
            } catch (err: any) {
                setError("Failed to fetch orders data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const fetchTrackingStatus = async () => {
        if (!trackingNumber) {
            setTrackingError("Please enter a tracking number.");
            return;
        }

        setTrackingError(null);
        setTrackingLoading(true);

        try {
            const response = await fetch("http://127.0.0.1:8000/get-tracking-status/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ tracking_number: trackingNumber }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch tracking status.");
            }

            const data = await response.json();
            setTrackingStatus(data);
        } catch (err: any) {
            setTrackingError("Failed to fetch tracking status. Please try again.");
        } finally {
            setTrackingLoading(false);
        }
    };

    if (loading) {
        return <p className="text-gray-400 text-center text-xl">Loading orders...</p>;
    }

    if (error) {
        return <p className="text-red-500 text-center text-xl">{error}</p>;
    }

    // Function to format the tracking status data
    const formatTrackingStatus = (status: any) => {
        if (!status || !status.data || status.data.length === 0) return null;

        const trackingData = status.data[0];
        const formattedData: any = {};

        // Include only the fields up to "updating"
        const fieldsToInclude = [
            "id",
            "tracking_number",
            "courier_code",
            "order_number",
            "order_date",
            "created_at",
            "update_at",
            "delivery_status",
            "archived",
            "updating",
        ];

        fieldsToInclude.forEach((field) => {
            if (trackingData[field] !== undefined) {
                formattedData[field] = trackingData[field];
            }
        });

        return formattedData;
    };

    return (
        <div className="p-6 w-full">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full">
                <OrderComponent orders={orders} />
                <h3 className="text-2xl font-semibold text-gray-800 mt-8">Track Your Order</h3>
                <div className="flex items-center space-x-4 mt-4">
                    <input
                        type="text"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="Enter Tracking Number"
                        className="border border-gray-300 p-3 rounded-md flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={fetchTrackingStatus}
                        className="bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 focus:outline-none"
                        disabled={trackingLoading}
                    >
                        {trackingLoading ? "Tracking..." : "Track"}
                    </button>
                </div>

                {trackingError && (
                    <p className="text-red-500 mt-4">{trackingError}</p>
                )}

                {trackingStatus && (
                    <div className="mt-6 p-6 bg-gray-50 border border-gray-200 rounded-lg">
                        <h4 className="text-lg font-bold text-gray-800 mb-4">Tracking Status:</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600 font-medium">ID:</span>
                                <span className="text-gray-800">{formatTrackingStatus(trackingStatus)?.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 font-medium">Tracking Number:</span>
                                <span className="text-gray-800">{formatTrackingStatus(trackingStatus)?.tracking_number}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 font-medium">Courier Code:</span>
                                <span className="text-gray-800">{formatTrackingStatus(trackingStatus)?.courier_code}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 font-medium">Order Number:</span>
                                <span className="text-gray-800">{formatTrackingStatus(trackingStatus)?.order_number}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 font-medium">Order Date:</span>
                                <span className="text-gray-800">
                                    {formatTrackingStatus(trackingStatus)?.order_date || "N/A"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 font-medium">Created At:</span>
                                <span className="text-gray-800">{formatTrackingStatus(trackingStatus)?.created_at}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 font-medium">Last Updated At:</span>
                                <span className="text-gray-800">{formatTrackingStatus(trackingStatus)?.update_at}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 font-medium">Delivery Status:</span>
                                <span className="text-gray-800">{formatTrackingStatus(trackingStatus)?.delivery_status}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 font-medium">Archived:</span>
                                <span className="text-gray-800">{formatTrackingStatus(trackingStatus)?.archived}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 font-medium">Updating:</span>
                                <span className="text-gray-800">
                                    {formatTrackingStatus(trackingStatus)?.updating ? "Yes" : "No"}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;