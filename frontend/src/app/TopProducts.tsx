export default function TopProducts() {
  const topProducts = ["Fresh Vegetables", "Organic Fruits", "Local Dairy", "Artisan Bread"]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Top Products</h2>
      <div className="flex flex-wrap gap-2">
        {topProducts.map((product, index) => (
          <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            {product}
          </span>
        ))}
      </div>
    </div>
  )
}

