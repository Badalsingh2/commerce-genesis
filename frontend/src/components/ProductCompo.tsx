import { Product } from "@/lib/types"
import { StarIcon } from "lucide-react"
import Image from "next/image"


export default function ProductCompo({ id,category_1,category_2,category_3, title, product_rating, selling_price, mrp,seller_name,seller_rating,description,highlights, image_links }: Product) {
  return (
    <div key={id} className="bg-white shadow rounded-lg p-4">
      <div className="w-full h-48 relative mb-4">
        <Image src={image_links || "/placeholder.svg"} alt="" layout="fill" objectFit="cover" className="rounded-md" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <div className="flex items-center mb-2">
        <StarIcon className="h-5 w-5 text-yellow-400" />
        <span className="ml-1 text-sm text-gray-600">{product_rating}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold text-gray-900">${selling_price}</span>
        {selling_price  && <span className="text-sm text-green-600 font-medium">{mrp}</span>}
      </div>
    </div>
  )
}

