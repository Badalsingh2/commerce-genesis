// components/ProductCard.tsx
import { Product } from '../../../lib/types';
import { Star, Package } from 'lucide-react';

type ProductCardProps = {
  product: Product;
};

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-lg">
      <img
        src={product.image_links}
        alt={product.title}
        className="w-full h-64 object-cover rounded-md"
      />
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.title}</h3>
        <div className="flex items-center text-yellow-500 mt-2">
          {[...Array(5)].map((_, index) => (
            <Star key={index} size={16} fill={index < product.product_rating ? 'currentColor' : 'none'} />
          ))}
          <span className="ml-2 text-gray-600">({product.product_rating})</span>
        </div>
        <div className="flex justify-between mt-4">
          <div className="text-lg font-bold text-green-600">{product.selling_price}</div>
          <div className="text-sm text-gray-500 line-through">{product.mrp}</div>
        </div>
        <div className="mt-2 text-sm text-gray-700">{product.description}</div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <Package size={16} />
            <span className="ml-1">{product.seller_name}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Star size={16} />
            <span className="ml-1">{product.seller_rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
