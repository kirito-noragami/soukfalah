import { useState } from 'react';
import fieldsImage from '../../assets/images/home-fields.png';
import { farms, findFarmById } from '../../data/farms';
import { products as allProducts } from '../../data/products';
import { cartAdd } from '../../app/providers/CartProvider';
import { useAuth } from '../../app/providers/AuthProvider';
import { navigateTo } from '../../app/navigation';
import './FarmProductsPage.css';

// ── Helpers ───────────────────────────────────────────────────────────────────
const getFarmIdFromPath = () => {
  if (typeof window === 'undefined') return undefined;
  const parts = window.location.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
  return parts[0] === 'farm' && parts[1] ? decodeURIComponent(parts[1]) : undefined;
};

/** Merge farm's product stub with full products.js data */
const resolveProduct = (stub) => {
  if (!stub.id) return stub;
  const full = allProducts.find(p => p.id === stub.id);
  if (!full) return stub;
  return {
    ...full,
    // prefer farm's own price/stock if set
    price:   stub.price   ?? full.price,
    unit:    stub.unit    ?? full.unit,
    stock:   stub.stock   ?? full.available ?? '?',
    accent:  stub.accent  ?? full.accent,
  };
};

const parsePrice = (price) => {
  const n = parseFloat(String(price).replace(/[^\d.]/g, ''));
  return Number.isFinite(n) ? n : 0;
};

const STARS = (n) => '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n));

// ── Component ─────────────────────────────────────────────────────────────────
const FarmProductsPage = ({ farmId }) => {
  const resolvedId = farmId ?? getFarmIdFromPath();
  const farm       = findFarmById(resolvedId) ?? farms[0];
  const { isLoggedIn } = useAuth();

  // Resolve full product details for every product in this farm
  const resolvedProducts = (farm.products ?? []).map(resolveProduct);

  // Per-card state: { [productId]: { qty, added } }
  const [cardState, setCardState] = useState({});

  const getCard = (id) => cardState[id] ?? { qty: 1, added: false };

  const setQty = (id, delta) => setCardState(prev => ({
    ...prev,
    [id]: { ...getCard(id), qty: Math.max(1, (getCard(id).qty) + delta), added: false },
  }));

  const handleAddToCart = (product) => {
    if (!isLoggedIn) {
      navigateTo('/login');
      return;
    }
    const state = getCard(product.id || product.name);
    cartAdd(
      {
        id:     product.id     || `${farm.id}-${product.name}`,
        name:   product.name,
        price:  parsePrice(product.price),
        unit:   product.unit,
        accent: product.accent ?? farm.accent,
        farmer: { name: farm.farmer?.name ?? farm.name },
      },
      state.qty
    );
    setCardState(prev => ({
      ...prev,
      [product.id || product.name]: { ...state, added: true },
    }));
    // Reset "added" badge after 2 s
    setTimeout(() => {
      setCardState(prev => ({
        ...prev,
        [product.id || product.name]: { ...getCard(product.id || product.name), added: false },
      }));
    }, 2000);
  };

  const pageStyle = {
    '--farm-fields-image': `url(${fieldsImage})`,
    '--farm-accent': farm.accent,
  };

  const totalStock = resolvedProducts.reduce((s, p) => s + (Number(p.stock ?? p.available) || 0), 0);

  return (
    <div className="farm-page" style={pageStyle}>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <header className="farm-hero">
        <div className="farm-hero__content">
          <p className="farm-hero__kicker">Farm Profile</p>
          <h1 className="farm-hero__title">{farm.name}</h1>
          <p className="farm-hero__subtitle">{farm.location}{farm.region ? `, ${farm.region}` : ''}, Morocco</p>

          {farm.description && (
            <p className="farm-hero__desc">{farm.description}</p>
          )}

          {farm.certifications?.length > 0 && (
            <div className="farm-hero__certs">
              {farm.certifications.map(c => (
                <span key={c} className="farm-cert">{c}</span>
              ))}
            </div>
          )}

          <div className="farm-hero__stats">
            <div><strong>{resolvedProducts.length}</strong><span>Products</span></div>
            <div><strong>{totalStock > 0 ? `${totalStock} kg+` : '24 h'}</strong><span>In stock</span></div>
            <div><strong>Local</strong><span>Verified farm</span></div>
            {farm.farmer?.rating && (
              <div><strong>{farm.farmer.rating}</strong><span>{STARS(farm.farmer.rating)}</span></div>
            )}
          </div>
        </div>

        <div className="farm-hero__aside">
          {farm.farmer && (
            <div className="farm-farmer-card">
              <div className="farm-farmer-card__avatar" style={{ background: farm.accent }}>
                {farm.farmer.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p className="farm-farmer-card__name">{farm.farmer.name}</p>
                <p className="farm-farmer-card__role">Farm Owner</p>
                {farm.farmer.bio && (
                  <p className="farm-farmer-card__bio">{farm.farmer.bio}</p>
                )}
                {farm.farmer.reviews && (
                  <p className="farm-farmer-card__reviews">
                    {STARS(farm.farmer.rating ?? 5)} · {farm.farmer.reviews} reviews
                  </p>
                )}
              </div>
            </div>
          )}
          <a className="farm-hero__back" href="/map">← Back to Map</a>
        </div>
      </header>

      {/* ── Products ──────────────────────────────────────────────────────── */}
      <section className="farm-products">
        <div className="farm-products__header">
          <div>
            <h2>Products from this farm</h2>
            <p>Prices set directly by the farmer. Add to cart and checkout at any time.</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="farm-products__badge">Farmer-set prices</span>
            <button
              type="button"
              className="farm-cart-btn"
              onClick={() => navigateTo('/cart')}
            >
              View Cart
            </button>
          </div>
        </div>

        {resolvedProducts.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#708070' }}>
            No products listed for this farm yet.
          </div>
        ) : (
          <div className="farm-products__grid">
            {resolvedProducts.map((product) => {
              const key   = product.id || product.name;
              const state = getCard(key);
              const stock = Number(product.stock ?? product.available);
              const isLow = stock > 0 && stock < 100;

              return (
                <article key={key} className="farm-products__card">
                  <div
                    className="farm-products__media"
                    style={{ '--card-accent': product.accent ?? farm.accent }}
                  >
                    {product.badge && (
                      <span className="farm-product-badge">{product.badge}</span>
                    )}
                    {isLow && (
                      <span className="farm-product-badge farm-product-badge--low">Low Stock</span>
                    )}
                  </div>

                  <div className="farm-products__body">
                    <div>
                      <h3>{product.name}</h3>
                      {product.category && (
                        <span className="farm-product-cat">{product.category}</span>
                      )}
                    </div>

                    {product.description && (
                      <p className="farm-product-desc">{product.description}</p>
                    )}

                    <div className="farm-product-meta">
                      <span className="farm-product-price">{product.price} / {product.unit}</span>
                      {stock > 0 && (
                        <span className="farm-product-stock">{stock} {product.unit ?? 'units'} available</span>
                      )}
                    </div>

                    <div className="farm-product-actions">
                      {/* Quantity selector */}
                      <div className="farm-qty">
                        <button
                          type="button"
                          className="farm-qty__btn"
                          onClick={() => setQty(key, -1)}
                          disabled={state.qty <= 1}
                        >−</button>
                        <span className="farm-qty__val">{state.qty}</span>
                        <button
                          type="button"
                          className="farm-qty__btn"
                          onClick={() => setQty(key, 1)}
                        >+</button>
                      </div>

                      {/* Add to cart */}
                      <button
                        type="button"
                        className={`farm-add-btn${state.added ? ' farm-add-btn--added' : ''}`}
                        onClick={() => handleAddToCart(product)}
                      >
                        {state.added ? '✓ Added!' : isLoggedIn ? 'Add to Cart' : 'Login to Buy'}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Go to checkout strip */}
        <div className="farm-checkout-strip">
          <p>Ready? Complete your order in one click.</p>
          <button type="button" className="farm-cart-btn farm-cart-btn--large" onClick={() => navigateTo('/cart')}>
            Go to Cart & Checkout →
          </button>
        </div>
      </section>
    </div>
  );
};

export default FarmProductsPage;