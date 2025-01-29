//product
//  - review summary
//    - description
//    - similar products list
//      - mostly bought together with list
//      - add to cart
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Star, ShoppingCart } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import ReviewForm from './review-form'
import Reviews from './reviews'
import { Product } from '@/lib/types'
import ReviewSummary from './review-summary'


async function getProductDetails(id: string): Promise<Product> {
  return {
    id: Number.parseInt(id),
    category_1: "Electronics",
    category_2: "Smartphones",
    category_3: "Android",
    title: "SuperPhone X1",
    product_rating: 4.5,
    selling_price: "$699.99",
    mrp: "$799.99",
    seller_name: "TechGadgets Inc.",
    seller_rating: 4.8,
    description:
      "The SuperPhone X1 is a cutting-edge smartphone with a powerful processor, stunning camera, and long-lasting battery life.",
    highlights: "6.5-inch AMOLED display, 5G capable, 128GB storage, 8GB RAM, 108MP main camera",
    image_links: "https://picsum.photos/seed/phone1/500/500,https://picsum.photos/seed/phone2/500/500",
  }
}

//async function getProductDetails(id: string): Promise<ProductDetails> {
//  const res = await fetch(`https://api.example.com/products/${id}`)
//  if (!res.ok) throw new Error('Failed to fetch product details')
//  return res.json()
//}

export default async function ProductPage({ searchParams }: { searchParams: { id: string } }) {
  console.log(searchParams.id)

  if (!productId) {
    notFound()
  }

  const product = await getProductDetails(productId)

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <Image
                src={product.image_links.split(',')[0] || "/placeholder.svg"}
                alt={product.title}
                width={500}
                height={500}
                className="rounded-lg object-cover w-full h-auto"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
              <div className="flex items-center mb-4">
                <Star className="w-5 h-5 text-yellow-400 mr-1" />
                <span className="font-semibold">{product.product_rating.toFixed(1)}</span>
              </div>
              <div className="mb-4">
                <span className="text-2xl font-bold text-primary mr-2">{product.selling_price}</span>
                <span className="text-lg text-muted-foreground line-through">{product.mrp}</span>
              </div>
              <p className="text-muted-foreground mb-4">{product.description}</p>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Highlights:</h3>
                <ul className="list-disc list-inside">
                  {product.highlights.split(',').map((highlight, index) => (
                    <li key={index}>{highlight.trim()}</li>
                  ))}
                </ul>
              </div>
              <div className="mb-4">
                <Badge variant="secondary" className="mr-2">{product.category_1}</Badge>
                <Badge variant="secondary" className="mr-2">{product.category_2}</Badge>
                <Badge variant="secondary">{product.category_3}</Badge>
              </div>
              <Button className="w-full">
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Seller Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-semibold">{product.seller_name}</p>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 mr-1" />
            <span>{product.seller_rating.toFixed(1)}</span>
          </div>
        </CardContent>
      </Card>

      <Suspense fallback={<div>Loading review summary...</div>}>
        <ReviewSummary productId={productId} />
      </Suspense>

      <Separator className="my-8" />

      <Suspense fallback={<div>Loading reviews...</div>}>
        <Reviews productId={productId} />
      </Suspense>

      <Separator className="my-8" />

      <Card>
        <CardHeader>
          <CardTitle>Add Your Review</CardTitle>
        </CardHeader>
        <CardContent>
          <ReviewForm productId={productId} />
        </CardContent>
      </Card>
    </div>
  )
}
