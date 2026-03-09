/**
 * ProductDetailsPage — loads a single product from Supabase.
 * URL: /product/:productId  (UUID)
 */
import { useEffect, useState } from 'react';
import fieldsImage  from '../../assets/images/home-fields.png';
import Breadcrumbs  from '../../components/common/Breadcrumbs';
import { supabase } from '../../services/supabase';
import { useCart }  from '../../app/providers/CartProvider';
import { useAuth }  from '../../app/providers/AuthProvider';
import { navigateTo } from '../../app/navigation';
import ProductDescription from './components/ProductDescription';
import ProductGallery     from './components/ProductGallery';
import ProductInfoPanel   from './components/ProductInfoPanel';
import './ProductDetailsPage.css';

const getProductIdFromPath = () => {
  if (typeof window === 'undefined') return undefined;
  const parts = window.location.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
  return parts[0] === 'product' && parts[1] ? decodeURIComponent(parts[1]) : undefined;
};

const ProductDetailsPage = ({ productId }) => {
  const resolvedId    = productId ?? getProductIdFromPath();
  const { addItem }   = useCart();
  const { isLoggedIn } = useAuth();

  const [product,  setProduct]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [qty,      setQty]      = useState(1);
  const [added,    setAdded]    = useState(false);

  useEffect(() => {
    if (!resolvedId) { setNotFound(true); setLoading(false); return; }
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*, farms(id, name, city, owner_id), product_images(url, position)')
        .eq('id', resolvedId)
        .single();

      if (error || !data) { setNotFound(true); setLoading(false); return; }

      /* Normalise to shape that ProductInfoPanel / ProductGallery expect */
      setProduct({
        id:          data.id,
        name:        data.name,
        price:       `${data.price_dh} DH`,
        price_dh:    data.price_dh,
        unit:        data.unit,
        category:    data.category,
        accent:      data.accent ?? '#7ea35f',
        badge:       data.badge,
        description: data.description,
        available:   data.available,
        harvestDate: data.harvest_date ?? '',
        farm_id:     data.farm_id,
        farmer: {
          name:     data.farms?.name ?? '',
          location: data.farms?.city ?? '',
          farm_id:  data.farm_id,
        },
        farmer_id: data.farms?.owner_id ?? null,
        gallery: data.product_images?.length
          ? data.product_images.sort((a, b) => a.position - b.position).map(i => i.url)
          : [data.accent ?? '#888'],
      });
      setLoading(false);
    };
    load();
  }, [resolvedId]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) { navigateTo('/login'); return; }
    if (!product) return;
    await addItem({
      id:        product.id,
      name:      product.name,
      price_dh:  product.price_dh,
      price:     product.price_dh,
      unit:      product.unit,
      accent:    product.accent,
      farmer_id: product.farmer_id,
      farmer:    { name: product.farmer.name },
    }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', opacity: 0.5 }}>
        Loading product…
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <a href="/marketplace" style={{ display: 'inline-block', marginTop: '1.5rem', textDecoration: 'underline' }}>
          ← Back to Marketplace
        </a>
      </div>
    );
  }

  const pageStyle = { '--product-fields-image': `url(${fieldsImage})` };
  const breadcrumbs = [
    { label: 'Marketplace', href: '/marketplace' },
    { label: product.category },
    { label: product.name },
  ];

  return (
    <div className="product-details" style={pageStyle}>
      <div className="product-details__breadcrumbs">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <section className="product-details__hero">
        <ProductGallery product={product} />
        <ProductInfoPanel product={product}>
          {/* Quantity + Add to Cart */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: 8, overflow: 'hidden' }}>
              <button type="button"
                style={{ padding: '0.5rem 0.9rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
                onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span style={{ padding: '0.5rem 0.8rem', fontWeight: 600 }}>{qty}</span>
              <button type="button"
                style={{ padding: '0.5rem 0.9rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
                onClick={() => setQty(q => q + 1)}>+</button>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              style={{
                padding: '0.6rem 1.4rem', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: added ? '#4f7a46' : '#2f4b31', color: '#fff', fontWeight: 700, fontSize: '0.95rem',
                transition: 'background 0.2s',
              }}
            >
              {added ? '✓ Added to Cart!' : isLoggedIn ? 'Add to Cart' : 'Login to Buy'}
            </button>
            {product.farm_id && (
              <button type="button"
                onClick={() => navigateTo(`/farm/${product.farm_id}`)}
                style={{ padding: '0.6rem 1.1rem', borderRadius: 8, border: '1px solid #ccc', background: 'none', cursor: 'pointer', fontSize: '0.88rem' }}>
                View Farm →
              </button>
            )}
          </div>
        </ProductInfoPanel>
      </section>

      <ProductDescription description={product.description} />
    </div>
  );
};

export default ProductDetailsPage;