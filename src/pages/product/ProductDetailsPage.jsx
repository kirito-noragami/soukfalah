import fieldsImage from '../../assets/images/home-fields.png';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import { findProductById, products } from '../../data/products';
import ProductDescription from './components/ProductDescription';
import ProductGallery from './components/ProductGallery';
import ProductInfoPanel from './components/ProductInfoPanel';
import './ProductDetailsPage.css';
const getProductIdFromPath = () => {
  if (typeof window === 'undefined') {
    return undefined;
  }
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const parts = path.split('/').filter(Boolean);
  if (parts[0] !== 'product') {
    return undefined;
  }
  return parts[1] ? decodeURIComponent(parts[1]) : undefined;
};
const ProductDetailsPage = ({
  productId
}) => {
  const resolvedId = productId ?? getProductIdFromPath();
  const product = findProductById(resolvedId) ?? products[0];
  const pageStyle = {
    '--product-fields-image': `url(${fieldsImage})`
  };
  const breadcrumbs = [{
    label: 'Marketplace',
    href: '/marketplace'
  }, {
    label: product.category
  }, {
    label: product.name
  }];
  return <div className="product-details" style={pageStyle}>
      <div className="product-details__breadcrumbs">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <section className="product-details__hero">
        <ProductGallery product={product} />
        <ProductInfoPanel product={product} />
      </section>

      <ProductDescription description={product.description} />
    </div>;
};
export default ProductDetailsPage;