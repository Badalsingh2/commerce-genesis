// @/data/cartItems.ts

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    description: string;
    category: string;
    image?: string; // Optional image URL
    stock: number; // Available stock
  }
  
  export const cartItems: CartItem[] = [
    {
      id: "101",
      name: "Wireless Mouse",
      price: 25.75,
      quantity: 1,
      description: "Ergonomic wireless mouse with 2.4GHz connectivity.",
      category: "Electronics",
      image: "/assets/iphone.jpeg",
      stock: 10,
    },
    {
      id: "102",
      name: "Bluetooth Headphones",
      price: 95.0,
      quantity: 1,
      description: "Noise-cancelling Bluetooth headphones with 20-hour battery life.",
      category: "Electronics",
      image: "https://via.placeholder.com/150",
      stock: 5,
    },
    {
      id: "103",
      name: "TypeScript Handbook",
      price: 30.0,
      quantity: 1,
      description: "Comprehensive guide to TypeScript for beginners and advanced developers.",
      category: "Books",
      image: "https://via.placeholder.com/150",
      stock: 20,
    },
    {
      id: "104",
      name: "Coffee Maker",
      price: 150.0,
      quantity: 1,
      description: "Automatic coffee maker with programmable settings.",
      category: "Home & Kitchen",
      image: "https://via.placeholder.com/150",
      stock: 3,
    },
  ];