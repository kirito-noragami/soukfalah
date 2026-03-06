import logoMark from '../../../assets/images/logo.svg';
import './FarmerPopupCard.css';
const FarmerPopupCard = ({
  farm,
  onClose,
  style
}) => {
  const handleClick = event => {
    event.stopPropagation();
  };
  return <div className="farmer-popup" style={style} onClick={handleClick}>
      <button className="farmer-popup__close" type="button" onClick={onClose} aria-label="Close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 6l12 12M18 6l-12 12" strokeLinecap="round" />
        </svg>
      </button>
      <div className="farmer-popup__header">
        <span className="farmer-popup__avatar" aria-hidden="true">
          <img src={logoMark} alt="" />
        </span>
        <div>
          <div className="farmer-popup__name">{farm.name}</div>
          <div className="farmer-popup__location">{farm.location}</div>
        </div>
      </div>
      <div className="farmer-popup__list">
        {farm.products.map(product => <div key={product.name} className="farmer-popup__item">
            <span className="farmer-popup__thumb" aria-hidden="true" />
            <div>
              <div className="farmer-popup__product">{product.name}</div>
              <div className="farmer-popup__meta">
                {product.price} / {product.unit}
              </div>
            </div>
          </div>)}
      </div>
      <a className="farmer-popup__cta" href={`/farm/${farm.id}`}>
        View Products
      </a>
    </div>;
};
export default FarmerPopupCard;