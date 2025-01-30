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
  id: string;
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
              amount: 1800, 
              products: [
                  { name: "Laptop", brand: "Dell", price: "$1000", purchaseDate: "2024-01-10" },
                  { name: "Smartphone", brand: "Samsung", price: "$800", purchaseDate: "2024-03-15" },
                  { name: "Headphones", brand: "Sony", price: "$150", purchaseDate: "2024-05-20" },
                  { name: "Tablet", brand: "Apple", price: "$600", purchaseDate: "2024-07-08" },
              ]
          },
          { 
              category: "Clothing", 
              amount: 500, 
              products: [
                  { name: "T-Shirt", brand: "Nike", price: "$40", purchaseDate: "2024-02-20" },
                  { name: "Jeans", brand: "Levi's", price: "$60", purchaseDate: "2024-04-05" },
                  { name: "Shoes", brand: "Adidas", price: "$100", purchaseDate: "2024-06-15" },
                  { name: "Jacket", brand: "Puma", price: "$120", purchaseDate: "2024-09-25" },
              ]
          },
          { 
              category: "Groceries", 
              amount: 600, 
              products: [
                  { name: "Milk", brand: "Amul", price: "$5", purchaseDate: "2024-01-15" },
                  { name: "Bread", brand: "Britannia", price: "$3", purchaseDate: "2024-02-10" },
                  { name: "Eggs", brand: "Farm Fresh", price: "$8", purchaseDate: "2024-03-20" },
                  { name: "Vegetables", brand: "Local", price: "$20", purchaseDate: "2024-07-18" },
                  { name: "Fruits", brand: "Organic", price: "$25", purchaseDate: "2024-11-28" },
              ]
          },
          { 
              category: "Books", 
              amount: 250, 
              products: [
                  { name: "Programming Guide", brand: "O'Reilly", price: "$50", purchaseDate: "2024-03-12" },
                  { name: "Novel", brand: "Penguin", price: "$30", purchaseDate: "2024-05-30" },
                  { name: "Biography", brand: "HarperCollins", price: "$45", purchaseDate: "2024-08-14" },
              ]
          }
      ]
  },
  {
      id: "2",
      name: "John Doe",
      age: 28,
      email: "johndoe@gmail.com",
      purchases: [
          { 
              category: "Groceries", 
              amount: 400, 
              products: [
                  { name: "Milk", brand: "Amul", price: "$5", purchaseDate: "2024-01-02" },
                  { name: "Bread", brand: "Britannia", price: "$3", purchaseDate: "2024-02-15" },
                  { name: "Eggs", brand: "Local Farm", price: "$10", purchaseDate: "2024-06-05" },
                  { name: "Meat", brand: "Fresh Meat", price: "$50", purchaseDate: "2024-10-18" },
              ]
          },
          { 
              category: "Electronics", 
              amount: 2300, 
              products: [
                  { name: "TV", brand: "LG", price: "$1200", purchaseDate: "2024-04-10" },
                  { name: "Smartwatch", brand: "Apple", price: "$400", purchaseDate: "2024-06-25" },
                  { name: "Earbuds", brand: "Bose", price: "$300", purchaseDate: "2024-09-30" },
              ]
          },
          { 
              category: "Books", 
              amount: 200, 
              products: [
                  { name: "Science Fiction", brand: "Penguin", price: "$25", purchaseDate: "2024-02-20" },
                  { name: "Self-Help", brand: "HarperCollins", price: "$30", purchaseDate: "2024-07-14" },
              ]
          },
          { 
              category: "Furniture", 
              amount: 800, 
              products: [
                  { name: "Office Chair", brand: "Ikea", price: "$250", purchaseDate: "2024-01-30" },
                  { name: "Desk", brand: "HomeCenter", price: "$400", purchaseDate: "2024-08-12" },
              ]
          }
      ]
  }
];
