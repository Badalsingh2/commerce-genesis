const categories = ["Fruits & Vegetables", "Dairy & Eggs", "Bakery", "Meat & Poultry", "Seafood", "Pantry Staples"]

export default function Categories() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div key={index} className="bg-white shadow rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{category}</h3>
              <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition duration-300">
                Shop Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

