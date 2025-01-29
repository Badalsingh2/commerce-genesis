import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Products } from "@/lib/types"
import { Star } from "lucide-react"
import { useRouter } from "next/navigation";

export default function ProductGrid({ products }: { products: Products }) {
  const router = useRouter();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {products.map((product) => (
        <Card key={product.id} className="flex flex-col"
          onClick={() => router.push(`/product/${product.id}`)}
        >
          <CardHeader>
            <Image
              src={product.image_links || "/placeholder.svg"}
              alt={product.title}
              width={300}
              height={300}
              className="w-full h-48 object-cover rounded-t-lg"
            />
          </CardHeader>
          <CardContent className="flex-grow">
            <CardTitle className="text-lg mb-2">{product.title}</CardTitle>
            <div className="flex items-center mb-2">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              <span>{product.product_rating.toFixed(1)}</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-end">
            <div>
              <p className="text-lg font-bold">${product.selling_price}</p>
              <p className="text-sm text-gray-500 line-through">${product.mrp}</p>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}


