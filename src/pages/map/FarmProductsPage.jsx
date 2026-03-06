import fieldsImage from '../../assets/images/home-fields.png';
import { farms, findFarmById } from '../../data/farms';
import './FarmProductsPage.css';
const getFarmIdFromPath = () => {
  if (typeof window === 'undefined') {
    return undefined;
  }
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const parts = path.split('/').filter(Boolean);
  if (parts[0] !== 'farm') {
    return undefined;
  }
  return parts[1] ? decodeURIComponent(parts[1]) : undefined;
};
const FarmProductsPage = ({
  farmId
}) => {
  const resolvedId = farmId ?? getFarmIdFromPath();
  const farm = findFarmById(resolvedId) ?? farms[0];
  const pageStyle = {
    '--farm-fields-image': `url(${fieldsImage})`,
    '--farm-accent': farm.accent
  };
  return <div className="farm-page" style={pageStyle}>
      <header className="farm-hero">
        <div className="farm-hero__content">
          <p className="farm-hero__kicker">Farm profile</p>
          <h1 className="farm-hero__title">{farm.name}</h1>
          <p className="farm-hero__subtitle">{farm.location}, Morocco</p>
          <div className="farm-hero__stats">
            <div>
              <strong>{farm.products.length}</strong>
              <span>Products</span>
            </div>
            <div>
              <strong>24h</strong>
              <span>Fresh pickup</span>
            </div>
            <div>
              <strong>Local</strong>
              <span>Verified farm</span>
            </div>
          </div>
        </div>
        <a className="farm-hero__back" href="/map">
          Back to Map
        </a>
      </header>

      <section className="farm-products">
        <div className="farm-products__header">
          <div>
            <h2>Products from this farm</h2>
            <p>Choose items and add them to your cart for checkout.</p>
          </div>
          <span className="farm-products__badge">Prices set by the farmer</span>
        </div>
        <div className="farm-products__grid">
          {farm.products.map((product, index) => <article key={`${farm.id}-${product.name}-${index}`} className="farm-products__card">
              <div className="farm-products__media" />
              <div className="farm-products__body">
                <h3>{product.name}</h3>
                <p>
                  {product.price} / {product.unit}
                </p>
                <button type="button">Add to Cart</button>
              </div>
            </article>)}
        </div>
      </section>
    </div>;
};
export default FarmProductsPage;