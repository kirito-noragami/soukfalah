import { useMemo, useState } from 'react';
import fieldsImage from '../../assets/images/home-fields.png';
import FiltersSidebar from './components/FiltersSidebar';
import ProductGrid from './components/ProductGrid';
import { products as ALL_PRODUCTS } from '../../data/products';
import './MarketplacePage.css';

const ALL_CATS   = ['Vegetables', 'Fruits', 'Grains', 'Others'];
const ALL_CITIES = ['All Cities', 'Agadir', 'Casablanca', 'Chefchaouen', 'Fes', 'Marrakech', 'Meknes', 'Rabat', 'Tangier', 'Tetouan'];

const parsePrice = (v) => {
  const n = Number.parseFloat(String(v).replace(/[^\d.]/g, ''));
  return Number.isFinite(n) ? n : 0;
};

const getURLParams = () => {
  if (typeof window === 'undefined') return {};
  const p = new URLSearchParams(window.location.search);
  return { city: p.get('city') || '', category: (p.get('category') || '').toLowerCase() };
};

const MarketplacePage = () => {
  const init = getURLParams();

  const [search,   setSearch]   = useState('');
  const [city,     setCity]     = useState(ALL_CITIES.find(c => c.toLowerCase() === init.city.toLowerCase()) || 'All Cities');
  const [cats,     setCats]     = useState(
    ALL_CATS.map(c => ({
      label:   c,
      checked: init.category ? c.toLowerCase() === init.category : true,
    }))
  );
  const [maxPrice, setMaxPrice] = useState(50);
  const [sort,     setSort]     = useState('popular');

  const toggleCat  = (label) => setCats(prev => prev.map(c => c.label === label ? { ...c, checked: !c.checked } : c));
  const resetAll   = () => {
    setSearch(''); setCity('All Cities');
    setCats(ALL_CATS.map(c => ({ label: c, checked: true })));
    setMaxPrice(50); setSort('popular');
  };

  const activeCats = cats.filter(c => c.checked).map(c => c.label);

  const filtered = useMemo(() => {
    let list = ALL_PRODUCTS.filter(p => {
      if (city !== 'All Cities' && p.location.toLowerCase() !== city.toLowerCase()) return false;
      if (activeCats.length && !activeCats.includes(p.category)) return false;
      if (parsePrice(p.price) > maxPrice) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const hay = `${p.name} ${p.location} ${p.category} ${p.farmer?.name ?? ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    if (sort === 'price-low')  list = [...list].sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    if (sort === 'price-high') list = [...list].sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    if (sort === 'fresh')      list = [...list].sort((a, b) => new Date(b.harvestDate) - new Date(a.harvestDate));
    return list;
  }, [city, activeCats, maxPrice, search, sort]);

  return (
    <div className="marketplace-page" id="marketplace" style={{ '--marketplace-fields-image': `url(${fieldsImage})` }}>

      <section className="marketplace-hero">
        <div className="marketplace-hero__content">
          <span className="marketplace-hero__kicker">Marketplace</span>
          <h1 className="marketplace-hero__title">Browse Fresh Products from Local Farmers</h1>
          <p className="marketplace-hero__subtitle">Find seasonal harvests, check distance, and shop the best produce picked this week.</p>
          <div className="marketplace-hero__stats">
            <div className="marketplace-hero__stat"><span className="marketplace-hero__stat-value">120+</span><span className="marketplace-hero__stat-label">Local farms</span></div>
            <div className="marketplace-hero__stat"><span className="marketplace-hero__stat-value">48h</span><span className="marketplace-hero__stat-label">Harvest to market</span></div>
            <div className="marketplace-hero__stat"><span className="marketplace-hero__stat-value">{ALL_PRODUCTS.length}</span><span className="marketplace-hero__stat-label">Products listed</span></div>
          </div>
        </div>
        <div className="marketplace-hero__banner" aria-hidden="true" />
      </section>

      <section className="marketplace-layout" aria-label="Marketplace content">
        <FiltersSidebar
          cats={cats}
          cities={ALL_CITIES}
          city={city}
          maxPrice={maxPrice}
          onCityChange={setCity}
          onToggleCat={toggleCat}
          onMaxPriceChange={setMaxPrice}
          onReset={resetAll}
        />

        <div className="marketplace-results">
          <div className="marketplace-results__header">
            <div>
              <p className="marketplace-results__eyebrow">Fresh picks ready today</p>
              <h2 className="marketplace-results__title">Top rated produce</h2>
              <p className="marketplace-results__count">
                Showing {filtered.length} of {ALL_PRODUCTS.length} products
              </p>
            </div>
            <div className="marketplace-results__tools">
              <input
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products or farmers…"
                style={{
                  padding: '0.45rem 0.8rem', borderRadius: '8px',
                  border: '1px solid var(--color-line-strong, #ccc)',
                  fontSize: '0.9rem', minWidth: '180px',
                  background: 'transparent', color: 'inherit',
                }}
              />
              <a className="marketplace-results__map" href="/map">View Map</a>
              <label className="marketplace-results__label">
                Sort by
                <span className="marketplace-results__select">
                  <select value={sort} onChange={e => setSort(e.target.value)}>
                    <option value="popular">Most popular</option>
                    <option value="fresh">Fresh arrivals</option>
                    <option value="price-low">Price: low → high</option>
                    <option value="price-high">Price: high → low</option>
                  </select>
                  <span className="marketplace-results__chevron" aria-hidden="true">
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 7l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </span>
              </label>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', opacity: 0.6 }}>
              No products match your filters.{' '}
              <button
                type="button"
                onClick={resetAll}
                style={{ textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
              >
                Reset filters
              </button>
            </div>
          ) : (
            <ProductGrid products={filtered} />
          )}
        </div>
      </section>
    </div>
  );
};

export default MarketplacePage;