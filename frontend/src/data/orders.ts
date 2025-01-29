// @/data/orders.ts

export interface Order {
    id: string;
    customerName: string;
    amount: number;
    date: string;
    category: string;
    address: string;
    status: string;
    items: {
      id: string;
      name: string;
      quantity: number;
      price: number;
    }[];
  }
  
  export const orders: Order[] = [
    {
      id: "1",
      customerName: "John Doe",
      amount: 120.75,
      date: "2023-10-01",
      category: "Electronics",
      address: "123 Main St, Springfield, IL",
      status: "Shipped",
      items: [
        { id: "101", name: "Wireless Mouse", quantity: 1, price: 25.75 },
        { id: "102", name: "Bluetooth Headphones", quantity: 1, price: 95.00 },
      ],
    },
    {
      id: "2",
      customerName: "Jane Smith",
      amount: 45.50,
      date: "2023-10-05",
      category: "Books",
      address: "456 Elm St, Metropolis, NY",
      status: "Delivered",
      items: [
        { id: "201", name: "TypeScript Handbook", quantity: 1, price: 30.00 },
        { id: "202", name: "React Patterns", quantity: 1, price: 15.50 },
      ],
    },
    {
      id: "3",
      customerName: "Alice Johnson",
      amount: 200.00,
      date: "2023-10-10",
      category: "Home & Kitchen",
      address: "789 Oak St, Gotham, NJ",
      status: "Processing",
      items: [
        { id: "301", name: "Coffee Maker", quantity: 1, price: 150.00 },
        { id: "302", name: "Electric Kettle", quantity: 1, price: 50.00 },
      ],
    },
  ];