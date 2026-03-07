import { useState } from 'react';
import { navigateTo } from '../../../app/navigation';

const QuickSearchBar = () => {
  const [city,     setCity]     = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city)     params.set('city',     city);
    if (category) params.set('category', category);
    navigateTo(params.toString() ? `/marketplace?${params}` : '/marketplace');
  };

  const chevron = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );

  return (
    <section className="home-search">
      <form className="home-search__form" aria-label="Quick search" onSubmit={handleSubmit}>

        <div className="home-search__field">
          <span className="home-search__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 22s7-4.5 7-10a7 7 0 1 0-14 0c0 5.5 7 10 7 10Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
          </span>
          <select value={city} onChange={e => setCity(e.target.value)}>
            <option value="">All Cities</option>
            <option value="Agadir">Agadir</option>
            <option value="Casablanca">Casablanca</option>
            <option value="Fes">Fes</option>
            <option value="Marrakech">Marrakech</option>
            <option value="Meknes">Meknes</option>
            <option value="Rabat">Rabat</option>
            <option value="Tangier">Tangier</option>
          </select>
          <span className="home-search__chevron" aria-hidden="true">{chevron}</span>
        </div>

        <div className="home-search__field">
          <span className="home-search__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 6h16M4 12h16M4 18h10" />
            </svg>
          </span>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            <option value="vegetables">Vegetables</option>
            <option value="fruits">Fruits</option>
            <option value="others">Others</option>
          </select>
          <span className="home-search__chevron" aria-hidden="true">{chevron}</span>
        </div>

        <button className="home-search__button" type="submit">Search</button>

      </form>
    </section>
  );
};

export default QuickSearchBar;