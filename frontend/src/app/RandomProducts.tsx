import Product from "@/components/Product"

const randomProducts = [
  { id: 1, name: "Organic Tomatoes", rating: 4.3, price: 2.49, image: "/images/organic-tomatoes.jpg" },
  { id: 2, name: "Grass-Fed Beef", rating: 4.6, price: 9.99, image: "/images/grass-fed-beef.jpg" },
  { id: 3, name: "Artisan Cheese", rating: 4.8, price: 6.99, image: "/images/artisan-cheese.jpg" },
  { id: 4, name: "Fresh Basil", rating: 4.5, price: 1.99, image: "/images/fresh-basil.jpg" },
]

export default function RandomProducts() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Random Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {randomProducts.map((product) => (
          <Product key={product.id} {...product} />
        ))}
      </div>
    </div>
  )
}

