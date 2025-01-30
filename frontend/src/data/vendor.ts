// src/data.ts

export interface Product {
    name: string;
    brand: string;
    price: string;
    stock: number;
  }
  
  export interface ProductCategory {
    category: string;
    totalSales: number;
    products: Product[];
  }
  
  export interface VendorProfile {
    id: string;
    name: string;
    category: string;
    email: string;
    productCategories: ProductCategory[];
    revenueData: number[];
  }
  
  export const vendors: VendorProfile[] = [
    {
      id: "1",
      name: "JSW Technos Electronics Vendor",
      category: "Electronics",
      email: "contact@jswtechnos.com",
      productCategories: [
        {
          category: "Laptops",
          totalSales: 500,
          products: [
            { name: "Gaming Laptop", brand: "ASUS", price: "$1500", stock: 30 },
            { name: "Business Laptop", brand: "HP", price: "$1200", stock: 50 },
          ],
        },
        {
          category: "Smartphones",
          totalSales: 700,
          products: [
            { name: "Flagship Phone", brand: "Samsung", price: "$1000", stock: 40 },
            { name: "Budget Phone", brand: "Xiaomi", price: "$300", stock: 100 },
          ],
        },
        {
          category: "Accessories",
          totalSales: 300,
          products: [
            { name: "Wireless Earbuds", brand: "Sony", price: "$150", stock: 75 },
            { name: "Smartwatch", brand: "Apple", price: "$400", stock: 20 },
          ],
        },
      ],
      revenueData: [5000, 7000, 8000, 7500, 9000, 11000, 9500, 10000, 12000, 13000, 12500, 14000],
    },
  ];
  