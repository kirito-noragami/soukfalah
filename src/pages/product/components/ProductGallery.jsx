import heroImage from '../../../assets/images/home-hero.png';
import './ProductGallery.css';
const ProductGallery = ({
  product
}) => {
  const galleryStyle = {
    '--product-hero-image': `url(${heroImage})`,
    '--product-accent': product.accent
  };
  return <div className="product-gallery" style={galleryStyle}>
      <div className="product-gallery__main" role="img" aria-label={product.name} />
      <div className="product-gallery__thumbs" aria-label="Product gallery">
        {product.gallery.map((accent, index) => <button key={`${product.id}-thumb-${index}`} className={`product-gallery__thumb${index === 0 ? ' is-active' : ''}`} style={{
        '--thumb-accent': accent
      }} type="button" aria-label={`${product.name} view ${index + 1}`} />)}
      </div>
    </div>;
};
export default ProductGallery;