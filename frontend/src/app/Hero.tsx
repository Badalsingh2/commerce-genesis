"use client"
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Hero() {
  const topProducts = ["Dry Fruits", "Organic Fruits", "Local Dairy", "Fresh Vegetables"];
  const router = useRouter();

  return (
    <div className="bg-slate-200 dark:bg-slate-950 py-20 pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse md:flex-row items-center justify-between">
        <div className="text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary">
            Fast Delivery
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Optimizing Quality and Minimizing Global Footprint
          </p>
          <div className="flex flex-col justify-center items-center md:items-start">
            <SearchBar />
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {topProducts.map((product, index) => (
                <Button
                  key={index}
                  className="bg-blue-100 text-blue-500 hover:bg-blue-200 transition-colors px-3 py-1 rounded-full text-sm font-medium dark:bg-blue-800 dark:text-blue-300 dark:hover:bg-blue-900"
                  onClick={() => router.push(`/search?q=${encodeURIComponent(product)}`)}
                >
                  {product}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <Image
          src="/hero_image.png"
          width={500}
          height={500}
          alt="Hero Image"
          className="mb-6 md:mb-0"
        />
      </div>
    </div>
  );
}

