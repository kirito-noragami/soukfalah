/**
 * MarketplacePage — loads all active products from Supabase. v2 fixed.
 */
import { useEffect, useMemo, useState } from 'react';
import fieldsImage    from '../../assets/images/home-fields.png';
import FiltersSidebar from './components/FiltersSidebar';
import ProductGrid    from './components/ProductGrid';
import { supabase }   from '../../services/supabase';
import './MarketplacePage.css';

const ALL_CATS = ['Vegetables', 'Fruits', 'Herbs', 'Nuts', 'Grains', 'Others'];

const parsePrice = (v) => {
  const n = Number.parseFloat(String(v ?? 0).replace(/[^\d.]/g, ''));
  return Number.isFinite(n) ? n : 0;
};

const getURLParams = () => {
  if (typeof window === 'undefined') return {};
  const p = new URLSearchParams(window.location.search);
  return { city: p.get('city') || '', category: (p.get('category') || '').toLowerCase() };
};

const MarketplacePage = () => {
  const init = getURLParams();

  const [allProducts, setAllProducts] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [allCities,   setAllCities]   = useState(['All Cities']);

  const [search,   setSearch]   = useState('');
  const [city,     setCity]     = useState('All Cities');
  const [cats,     setCats]     = useState(
    ALL_CATS.map(c => ({
      label:   c,
      checked: init.category ? c.toLowerCase() === init.category : true,
    }))
  );
  const [maxPrice, setMaxPrice] = useState(50);
  const [sort,     setSort]     = useState('popular');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*, farms(id, name, city, owner_id)')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const normalized = data.map(p => ({
          id:          p.id,
          name:        p.name,
          price:       `${p.price_dh} DH`,
          price_dh:    parsePrice(p.price_dh),
          unit:        p.unit,
          location:    p.farms?.city ?? '',
          accent:      p.accent ?? '#7ea35f',
          badge:       p.badge ?? null,
          category:    p.category,
          available:   p.available,
          description: p.description,
          harvestDate: p.harvest_date ?? '',
          farm_id:     p.farm_id,
          farmer_id:   p.farms?.owner_id ?? null,
          farmer: {
            name:     p.farms?.name ?? '',
            location: p.farms?.city ?? '',
          },
          gallery: [p.accent ?? '#888'],
        }));
        setAllProducts(normalized);

        const cities = [...new Set(normalized.map(p => p.location).filter(Boolean))].sort();
        setAllCities(['All Cities', ...cities]);

        if (init.city) {
          const found = cities.find(c => c.toLowerCase() === init.city.toLowerCase());
          if (found) setCity(found);
        }
      }
      setLoading(false);
    };
    load();
  }, []);

  const toggleCat = (label) => setCats(prev =>
    prev.map(c => c.label === label ? { ...c, checked: !c.checked } : c)
  );

  const resetAll = () => {
    setSearch('');
    setCity('All Cities');
    setCats(ALL_CATS.map(c => ({ label: c, checked: true })));
    setMaxPrice(50);
    setSort('popular');
  };

  const activeCats = cats.filter(c => c.checked).map(c => c.label);

  const filtered = useMemo(() => {
    let list = allProducts.filter(p => {
      if (city !== 'All Cities' && (p.location || '').toLowerCase() !== city.toLowerCase()) return false;
      if (activeCats.length && !activeCats.includes(p.category)) return false;
      if (p.price_dh > maxPrice) return false;
      if (search.trim()) {
        const q   = search.trim().toLowerCase();
        const hay = `${p.name} ${p.location} ${p.category} ${p.farmer?.name ?? ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    if (sort === 'price-low')  list = [...list].sort((a, b) => a.price_dh - b.price_dh);
    if (sort === 'price-high') list = [...list].sort((a, b) => b.price_dh - a.price_dh);
    return list;
  }, [allProducts, city, activeCats, maxPrice, search, sort]);

  const pageStyle = { '--market-fields-image': `url(${fieldsImage})` };

  return (
    <div className="marketplace-page" style={pageStyle}>
      <div className="marketplace-page__header">
        <div>
          <p className="marketplace-page__kicker">Fresh from the source</p>
          <h1 className="marketplace-page__title">Marketplace</h1>
          <p className="marketplace-page__subtitle">
            Browse products listed directly by Moroccan farmers.
          </p>
        </div>
        <a className="marketplace-page__map-link" href="/map">View on Map →</a>
      </div>

      {/* Search */}
      <div style={{ padding: '0 0 1rem', maxWidth: 420 }}>
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search product, city, farmer…"
          style={{
            width: '100%', padding: '0.55rem 0.9rem', borderRadius: 10,
            border: '1px solid var(--color-line-strong, #ccc)',
            fontSize: '0.93rem', background: 'transparent', color: 'inherit',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', opacity: 0.5 }}>Loading products…</div>
      ) : (
        <div className="marketplace-page__body">
          <FiltersSidebar
            cats={cats}
            cities={allCities}
            city={city}
            maxPrice={maxPrice}
            onToggleCat={toggleCat}
            onCityChange={setCity}
            onMaxPriceChange={setMaxPrice}
            onReset={resetAll}
          />

          <div className="marketplace-page__main">
            <div className="marketplace-page__toolbar">
              <span className="marketplace-page__count">
                {filtered.length} product{filtered.length !== 1 ? 's' : ''}
              </span>
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                style={{
                  padding: '0.35rem 0.7rem', borderRadius: 8, fontSize: '0.85rem',
                  border: '1px solid var(--color-line-strong, #ccc)',
                  background: 'transparent', color: 'inherit', cursor: 'pointer',
                }}
              >
                <option value="popular">Most Recent</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
              </select>
            </div>

            {filtered.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', opacity: 0.5 }}>
                {allProducts.length === 0
                  ? 'No products yet — run the seed SQL below to populate the marketplace.'
                  : 'No products match your filters. Try resetting filters.'}
              </div>
            ) : (
              <ProductGrid products={filtered} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;