import Navbar from "@/components/Navbar";
import Hero from "./Hero";
import ProductGrid from "@/components/ProductGrid";
import Categories from "./Categories";
import RandomProducts from "./RandomProducts";
import Footer from "./Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <ProductGrid />
        <Categories />
        <RandomProducts />
      </main>
      <Footer />
    </div>
  )
}


