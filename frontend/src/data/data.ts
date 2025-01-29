// src/data.ts

export interface Product {
    name: string;
    brand: string;
    price: string;
    purchaseDate: string;
  }
  
  export interface PurchaseCategory {
    category: string;
    amount: number;
    products: Product[];
  }
  
  export interface UserProfile {
    id: string; // Unique identifier for each user
    name: string;
    age: number;
    email: string;
    purchases: PurchaseCategory[];
  }
  
  export const users: UserProfile[] = [
    {
      id: "1",
      name: "Veerat Dhoni",
      age: 36,
      email: "ronitnaik122@gmail.com",
      purchases: [
        {
          category: "Electronics",
          amount: 300,
          products: [
            { name: "Laptop", brand: "Dell", price: "$1000", purchaseDate: "2024-01-10" },
            { name: "Smartphone", brand: "Samsung", price: "$800", purchaseDate: "2024-03-15" },
          ],
        },
        {
          category: "Clothing",
          amount: 150,
          products: [
            { name: "T-Shirt", brand: "Nike", price: "$40", purchaseDate: "2024-02-20" },
            { name: "Jeans", brand: "Levi's", price: "$60", purchaseDate: "2024-04-05" },
          ],
        },
      ],
    },
    {
      id: "2",
      name: "John Doe",
      age: 28,
      email: "johndoe@gmail.com",
      purchases: [
        {
          category: "Groceries",
          amount: 200,
          products: [
            { name: "Milk", brand: "Amul", price: "$5", purchaseDate: "2024-05-01" },
            { name: "Bread", brand: "Britannia", price: "$3", purchaseDate: "2024-05-02" },
          ],
        },
        {
          category: "Books",
          amount: 100,
          products: [
            { name: "Fiction Novel", brand: "Penguin", price: "$15", purchaseDate: "2024-06-10" },
            { name: "Programming Guide", brand: "O'Reilly", price: "$50", purchaseDate: "2024-07-12" },
          ],
        },
      ],
    },
  ];