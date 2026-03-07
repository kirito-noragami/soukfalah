import './FiltersSidebar.css';

const FiltersSidebar = ({ cats, cities, city, maxPrice, onCityChange, onToggleCat, onMaxPriceChange, onReset }) => (
  <aside className="marketplace-filters" aria-label="Filters">
    <div className="marketplace-filters__header">
      <h3 className="marketplace-filters__title">Filters</h3>
      <button className="marketplace-filters__reset" type="button" onClick={onReset}>Reset</button>
    </div>

    <div className="marketplace-filters__group">
      <label className="marketplace-filters__label" htmlFor="mf-city">City</label>
      <div className="marketplace-filters__select">
        <select id="mf-city" value={city} onChange={e => onCityChange(e.target.value)}>
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <span className="marketplace-filters__chevron" aria-hidden="true">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 7l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </div>

    <div className="marketplace-filters__group">
      <span className="marketplace-filters__label">Category</span>
      <div className="marketplace-filters__options">
        {cats.map(cat => (
          <label key={cat.label} className="marketplace-filters__option">
            <input
              type="checkbox"
              checked={cat.checked}
              onChange={() => onToggleCat(cat.label)}
            />
            <span>{cat.label}</span>
          </label>
        ))}
      </div>
    </div>

    <div className="marketplace-filters__group">
      <span className="marketplace-filters__label">Max Price: {maxPrice} DH</span>
      <input
        type="range"
        min={5}
        max={50}
        step={1}
        value={maxPrice}
        onChange={e => onMaxPriceChange(Number(e.target.value))}
        style={{ width: '100%', marginTop: '0.5rem' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', opacity: 0.55 }}>
        <span>5 DH</span>
        <span>50 DH</span>
      </div>
    </div>
  </aside>
);

export default FiltersSidebar;