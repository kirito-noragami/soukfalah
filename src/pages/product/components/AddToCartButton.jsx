import { useState } from 'react';
import { useCart } from '../../../app/providers/CartProvider';
import './AddToCartButton.css';

const AddToCartButton = ({ product, quantity = 1, label = 'Add to Cart' }) => {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    if (!product) return;
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="product-add-cart__wrap">
      <button className="product-add-cart" type="button" onClick={handleClick}>
        {added ? '✓ Added to Cart!' : label}
      </button>
    </div>
  );
};

export default AddToCartButton;