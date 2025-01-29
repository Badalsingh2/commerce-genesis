interface Product {
  id: number
  category_1: string
  category_2: string
  category_3: string
  title: string
  product_rating: number
  selling_price: string
  mrp: string
  seller_name: string
  seller_rating: number
  description: string
  highlights: string
  image_links: string
}

type Products = Product[]

export type {
  Product,
  Products
}
