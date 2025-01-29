"use client"

import { useState } from "react"
import { Sidebar, SidebarContent, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import FilterSidebar from "./filter-sidebar"
import ProductGrid from "./product-grid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, SlidersHorizontalIcon as SliderHorizontal } from "lucide-react"
import { type Products } from "@/lib/types"
import SearchBar from "@/components/SearchBar"
import ProductGrid12 from "@/components/ProductGrid"

const initialProducts: Products = [
  {
    id: 1,
    category_1: "Electronics",
    category_2: "Laptops",
    category_3: "Gaming Laptops",
    title: "ASUS ROG Strix G15",
    product_rating: 4.5,
    selling_price: "1299.99",
    mrp: "1499.99",
    seller_name: "TechGadgets",
    seller_rating: 4.8,
    description: "Powerful gaming laptop with RTX 3070",
    highlights: '15.6" 300Hz Display, AMD Ryzen 9 5900HX, 32GB RAM, 1TB NVMe SSD',
    image_links: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 2,
    category_1: "Electronics",
    category_2: "Smartphones",
    category_3: "Android Phones",
    title: "Samsung Galaxy S21 Ultra",
    product_rating: 4.7,
    selling_price: "999.99",
    mrp: "1199.99",
    seller_name: "MobileWorld",
    seller_rating: 4.6,
    description: "Flagship smartphone with 108MP camera",
    highlights: '6.8" Dynamic AMOLED 2X, Exynos 2100, 12GB RAM, 256GB Storage',
    image_links: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 3,
    category_1: "Home & Kitchen",
    category_2: "Appliances",
    category_3: "Coffee Makers",
    title: "Breville Barista Express",
    product_rating: 4.6,
    selling_price: "599.99",
    mrp: "749.99",
    seller_name: "KitchenEssentials",
    seller_rating: 4.7,
    description: "Semi-automatic espresso machine",
    highlights: "Integrated conical burr grinder, PID temperature control, Steam wand",
    image_links: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 4,
    category_1: "Fashion",
    category_2: "Men's Clothing",
    category_3: "Jackets",
    title: "North Face Thermoball Eco",
    product_rating: 4.4,
    selling_price: "199.99",
    mrp: "229.99",
    seller_name: "OutdoorGear",
    seller_rating: 4.5,
    description: "Lightweight insulated jacket",
    highlights: "Recycled materials, Packable design, Water-resistant",
    image_links: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 5,
    category_1: "Books",
    category_2: "Fiction",
    category_3: "Science Fiction",
    title: "Dune by Frank Herbert",
    product_rating: 4.8,
    selling_price: "12.99",
    mrp: "17.99",
    seller_name: "BookWorm",
    seller_rating: 4.9,
    description: "Epic science fiction novel",
    highlights: "Paperback, 896 pages, Award-winning classic",
    image_links: "/placeholder.svg?height=300&width=300",
  },
]

export default function ProductSearch() {
  const [products, setProducts] = useState<Products>(initialProducts)
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    seller: "",
  })

  const applyFilters = (newFilters) => {
    setFilters(newFilters)
    filterProducts(newFilters, searchTerm)
  }


  const filterProducts = (currentFilters, currentSearchTerm) => {
    const filteredProducts = initialProducts.filter((product) => {
      const matchesSearch = product.title.toLowerCase().includes(currentSearchTerm.toLowerCase())
      const matchesCategory =
        !currentFilters.category ||
        currentFilters.category === "all" ||
        product.category_1 === currentFilters.category ||
        product.category_2 === currentFilters.category ||
        product.category_3 === currentFilters.category
      const matchesMinPrice =
        !currentFilters.minPrice ||
        Number.parseFloat(product.selling_price) >= Number.parseFloat(currentFilters.minPrice)
      const matchesMaxPrice =
        !currentFilters.maxPrice ||
        Number.parseFloat(product.selling_price) <= Number.parseFloat(currentFilters.maxPrice)
      const matchesSeller =
        !currentFilters.seller || currentFilters.seller === "all" || product.seller_name === currentFilters.seller

      return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice && matchesSeller
    })
    setProducts(filteredProducts)
  }

  return (
    <SidebarProvider>
      <div className="flex">
        <Sidebar className="w-64 border-r">
          <SidebarContent>
            <FilterSidebar filters={filters} applyFilters={applyFilters} />
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 pl-4">
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex items-center">
              <SidebarTrigger>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <SliderHorizontal className="h-4 w-4" />
                  <span className="sr-only">Toggle filters</span>
                </Button>
              </SidebarTrigger>
              <SearchBar />
            </div>
          </div>
          <ProductGrid12 products={products} />
        </div>
      </div>
    </SidebarProvider>
  )
}


