// components/ProductsList.tsx
import { Products } from '../../../lib/types';
import ProductCard from './ProductCard';

type ProductsListProps = {
  products: Products;
};

const ProductsList = ({ products }: ProductsListProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductsList;
