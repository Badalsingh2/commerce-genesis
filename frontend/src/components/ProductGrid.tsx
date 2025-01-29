import Product from "./Product"

const products = [
  { id: 1, name: "Organic Apples", rating: 4.5, price: 2.99, discount: 10, image: "/images/organic-apples.jpg" },
  { id: 2, name: "Fresh Spinach", rating: 4.8, price: 1.99, discount: 0, image: "/images/fresh-spinach.jpg" },
  { id: 3, name: "Whole Grain Bread", rating: 4.2, price: 3.49, discount: 5, image: "/images/whole-grain-bread.jpg" },
  { id: 4, name: "Free-Range Eggs", rating: 4.7, price: 4.99, discount: 0, image: "/images/free-range-eggs.jpg" },
]

export default function ProductGrid() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Product key={product.id} {...product} />
        ))}
      </div>
    </div>
  )
}

