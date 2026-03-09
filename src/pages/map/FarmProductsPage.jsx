/**
 * FarmProductsPage — loads a farm and its products from Supabase.
 * URL: /farm/:farmId  (farmId is a Supabase UUID)
 */
import { useEffect, useState } from 'react';
import fieldsImage  from '../../assets/images/home-fields.png';
import { supabase } from '../../services/supabase';
import { useCart }  from '../../app/providers/CartProvider';
import { useAuth }  from '../../app/providers/AuthProvider';
import { navigateTo } from '../../app/navigation';
import './FarmProductsPage.css';

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const getFarmIdFromPath = () => {
  if (typeof window === 'undefined') return undefined;
  const parts = window.location.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
  return parts[0] === 'farm' && parts[1] ? decodeURIComponent(parts[1]) : undefined;
};

const STARS = (n) => '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n));

/* ─── Component ───────────────────────────────────────────────────────────── */
const FarmProductsPage = ({ farmId }) => {
  const resolvedId        = farmId ?? getFarmIdFromPath();
  const { isLoggedIn }    = useAuth();
  const { addItem }       = useCart();

  const [farm,      setFarm]      = useState(null);
  const [products,  setProducts]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [notFound,  setNotFound]  = useState(false);
  const [cardState, setCardState] = useState({}); // { [productId]: { qty, added } }

  /* Load farm + products from Supabase */
  useEffect(() => {
    if (!resolvedId) { setNotFound(true); setLoading(false); return; }
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('farms')
        .select(`
          id, name, city, location, accent, description, owner_id,
          profiles(id, full_name, avatar_url),
          products(id, name, price_dh, unit, category, accent, badge, available, description, status)
        `)
        .eq('id', resolvedId)
        .single();

      if (error || !data) { setNotFound(true); setLoading(false); return; }

      setFarm({
        ...data,
        farmer: data.profiles
          ? { name: data.profiles.full_name, avatar: data.profiles.avatar_url }
          : null,
      });
      setProducts((data.products || []).filter(p => p.status === 'active'));
      setLoading(false);
    };
    load();
  }, [resolvedId]);

  /* Card state helpers */
  const getCard  = (id) => cardState[id] ?? { qty: 1, added: false };
  const setQty   = (id, delta) => setCardState(prev => ({
    ...prev,
    [id]: { ...getCard(id), qty: Math.max(1, getCard(id).qty + delta), added: false },
  }));

  const handleAddToCart = async (product) => {
    if (!isLoggedIn) { navigateTo('/login'); return; }
    const state = getCard(product.id);
    await addItem({
      id:        product.id,
      name:      product.name,
      price_dh:  product.price_dh,
      price:     product.price_dh,   // numeric
      unit:      product.unit,
      accent:    product.accent ?? farm?.accent,
      farmer_id: farm?.owner_id ?? null,
      farmer:    { name: farm?.farmer?.name ?? farm?.name ?? '' },
    }, state.qty);

    setCardState(prev => ({
      ...prev,
      [product.id]: { ...state, added: true },
    }));
    setTimeout(() => {
      setCardState(prev => ({
        ...prev,
        [product.id]: { ...getCard(product.id), added: false },
      }));
    }, 2000);
  };

  /* ─── Render states ─────────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', opacity: 0.5 }}>
        Loading farm…
      </div>
    );
  }

  if (notFound || !farm) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <h2>Farm not found</h2>
        <p style={{ opacity: 0.6, marginTop: '0.5rem' }}>This farm page doesn't exist or was removed.</p>
        <a href="/map" style={{ display: 'inline-block', marginTop: '1.5rem', textDecoration: 'underline' }}>← Back to Map</a>
      </div>
    );
  }

  const pageStyle = {
    '--farm-fields-image': `url(${fieldsImage})`,
    '--farm-accent': farm.accent,
  };
  const totalStock = products.reduce((s, p) => s + (Number(p.available) || 0), 0);

  return (
    <div className="farm-page" style={pageStyle}>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <header className="farm-hero">
        <div className="farm-hero__content">
          <p className="farm-hero__kicker">Farm Profile</p>
          <h1 className="farm-hero__title">{farm.name}</h1>
          <p className="farm-hero__subtitle">{farm.city}, Morocco</p>

          {farm.description && <p className="farm-hero__desc">{farm.description}</p>}

          <div className="farm-hero__stats">
            <div><strong>{products.length}</strong><span>Products</span></div>
            <div><strong>{totalStock > 0 ? `${totalStock} kg+` : '–'}</strong><span>In stock</span></div>
            <div><strong>Local</strong><span>Verified farm</span></div>
          </div>
        </div>

        <div className="farm-hero__aside">
          {farm.farmer && (
            <div className="farm-farmer-card">
              <div className="farm-farmer-card__avatar" style={{ background: farm.accent }}>
                {(farm.farmer.name || '?').split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p className="farm-farmer-card__name">{farm.farmer.name}</p>
                <p className="farm-farmer-card__role">Farm Owner</p>
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
            <button type="button" className="farm-cart-btn" onClick={() => navigateTo('/cart')}>
              View Cart
            </button>
          </div>
        </div>

        {products.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#708070' }}>
            No products listed for this farm yet.
          </div>
        ) : (
          <div className="farm-products__grid">
            {products.map((product) => {
              const state = getCard(product.id);
              const stock = Number(product.available);
              const isLow = stock > 0 && stock < 100;

              return (
                <article key={product.id} className="farm-products__card">
                  <div
                    className="farm-products__media"
                    style={{ '--card-accent': product.accent ?? farm.accent }}
                  >
                    {product.badge && <span className="farm-product-badge">{product.badge}</span>}
                    {isLow && <span className="farm-product-badge farm-product-badge--low">Low Stock</span>}
                  </div>

                  <div className="farm-products__body">
                    <div>
                      <h3>{product.name}</h3>
                      {product.category && <span className="farm-product-cat">{product.category}</span>}
                    </div>

                    {product.description && (
                      <p className="farm-product-desc">{product.description}</p>
                    )}

                    <div className="farm-product-meta">
                      <span className="farm-product-price">{product.price_dh} DH / {product.unit}</span>
                      {stock > 0 && (
                        <span className="farm-product-stock">{stock} {product.unit ?? 'units'} available</span>
                      )}
                    </div>

                    <div className="farm-product-actions">
                      {/* Quantity stepper */}
                      <div className="farm-qty">
                        <button type="button" className="farm-qty__btn" onClick={() => setQty(product.id, -1)} disabled={state.qty <= 1}>−</button>
                        <span className="farm-qty__val">{state.qty}</span>
                        <button type="button" className="farm-qty__btn" onClick={() => setQty(product.id, 1)}>+</button>
                      </div>

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

        <div className="farm-checkout-strip">
          <p>Ready? Complete your order in one click.</p>
          <button type="button" className="farm-cart-btn farm-cart-btn--large" onClick={() => navigateTo('/cart')}>
            Go to Cart &amp; Checkout →
          </button>
        </div>
      </section>
    </div>
  );
};

export default FarmProductsPage;