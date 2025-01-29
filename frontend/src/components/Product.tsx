import { StarIcon } from "lucide-react"
import Image from "next/image"

interface ProductProps {
  id: number
  name: string
  rating: number
  price: number
  discount?: number
  image: string
}

export default function Product({ id, name, rating, price, discount, image }: ProductProps) {
  return (
    <div key={id} className="bg-white shadow rounded-lg p-4">
      <div className="w-full h-48 relative mb-4">
        <Image src={image || "/placeholder.svg"} alt={name} layout="fill" objectFit="cover" className="rounded-md" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{name}</h3>
      <div className="flex items-center mb-2">
        <StarIcon className="h-5 w-5 text-yellow-400" />
        <span className="ml-1 text-sm text-gray-600">{rating}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold text-gray-900">${price.toFixed(2)}</span>
        {discount && discount > 0 && <span className="text-sm text-green-600 font-medium">{discount}% off</span>}
      </div>
    </div>
  )
}

