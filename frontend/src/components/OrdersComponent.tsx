import React from "react";

interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: string;
}

interface Order {
  orderId: number;
  totalPrice: string;
  date: string;
  items: OrderItem[];
}

interface OrderComponentProps {
  orders: Order[];
}

const OrderComponent: React.FC<OrderComponentProps> = ({ orders }) => {
  return (
    <div className="p-6 max-w-4xl mx-auto w-full md:w-[70%] lg:w-[50%] xl:w-[40%] bg-gray-900 text-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">Your Orders</h1>
      {orders.map((order) => (
        <div key={order.orderId} className="mb-6 border-b border-gray-700 pb-4">
          <h2 className="text-2xl text-blue-400 mb-2">Order #{order.orderId}</h2>
          <p className="text-gray-300 mb-2">Total Price: ${order.totalPrice}</p>
          <p className="text-gray-400 mb-2">Order Date: {new Date(order.date).toLocaleString()}</p>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.productId} className="flex justify-between">
                <span className="text-gray-200">{item.productName}</span>
                <span className="text-gray-300">Quantity: {item.quantity}</span>
                <span className="text-gray-400">Price: ${item.price}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderComponent;
