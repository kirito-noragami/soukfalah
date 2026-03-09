import logoMark from '../../../assets/images/logo.svg';
import './FarmerPopupCard.css';

const FarmerPopupCard = ({ farm, onClose, style }) => {
  const handleClick = e => e.stopPropagation();

  return (
    <div className="farmer-popup" style={style} onClick={handleClick}>
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
          <div className="farmer-popup__location">{farm.city || farm.location}</div>
        </div>
      </div>

      <div className="farmer-popup__list">
        {(farm.products || []).slice(0, 4).map(product => (
          <div key={product.id ?? product.name} className="farmer-popup__item">
            <span className="farmer-popup__thumb" aria-hidden="true"
              style={{ background: product.accent ?? farm.accent ?? '#7ea35f' }} />
            <div>
              <div className="farmer-popup__product">{product.name}</div>
              <div className="farmer-popup__meta">{product.price_dh ?? product.price} DH / {product.unit}</div>
            </div>
          </div>
        ))}
        {(farm.products || []).length === 0 && (
          <div style={{ fontSize: 13, color: '#888', padding: '8px 0' }}>No products listed yet.</div>
        )}
      </div>

      {/* Link uses Supabase UUID */}
      <a className="farmer-popup__cta" href={`/farm/${farm.id}`}>
        View Farm &amp; Products
      </a>
    </div>
  );
};

export default FarmerPopupCard;