import ProductCard from './ProductCard';
import './ProductGrid.css';
const ProductGrid = ({
  products
}) => {
  return <div className="product-grid" aria-live="polite">
      {products.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}
    </div>;
};
export default ProductGrid;