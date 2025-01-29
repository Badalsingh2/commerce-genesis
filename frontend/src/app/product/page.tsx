import Link from "next/link";
import products from "@/data/product";

export default function ProductPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Product List</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id} className="mb-4">
            <Link href={`/product/${product.id}`} className="text-blue-600 hover:underline">
              {product.title} - {product.selling_price}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
