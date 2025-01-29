import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const topProducts = ["Dry Fruits", "Organic Fruits", "Local Dairy", "Fresh Vegetables"]
  return (
    <div className="bg-green-50 py-20 pt-32 grid-cols-1 md:grid-cols-2">
      <Image
        src="/hero_image.png"
        width={500}
        height={500}
        alt="Picture of the author"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">Foodie</h1>
        <p className="text-xl text-center text-gray-600 mb-8">Optimizing Local Freshness Minimizing Global Footprint</p>
        <div className="flex flex-col justify-center item-center">
          <SearchBar />
          <div className="flex flex-wrap gap-2 justify-center">
            {topProducts.map((product, index) => (
              <Button key={index} className="bg-green-100 text-green-800 hover:bg-green-200 transition-colors px-3 py-1 rounded-full text-sm font-medium">
                {product}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
