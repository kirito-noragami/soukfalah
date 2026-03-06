import './ProductDescription.css';
const ProductDescription = ({
  description
}) => {
  return <section className="product-description">
      <h2 className="product-description__title">Product Description</h2>
      <p className="product-description__text">{description}</p>
    </section>;
};
export default ProductDescription;