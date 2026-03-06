import logoMark from '../../assets/images/home-fields.png';
import { navigateTo } from '../../app/navigation';
import { useCart } from '../../app/providers/CartProvider';
import { useAuth } from '../../app/providers/AuthProvider';
import './Navbar.css';

const Navbar = ({ theme = 'light', onToggleTheme }) => {
  const { count } = useCart();
  const { isLoggedIn, role, logout } = useAuth();

  const currentPath = typeof window === 'undefined' ? '/' : window.location.pathname.replace(/\/+$/, '') || '/';
  const isHome = currentPath === '/';
  const isMarketplace = currentPath === '/marketplace' || currentPath.startsWith('/product') || currentPath === '/map' || currentPath.startsWith('/farm');
  const isAbout = currentPath === '/about';
  const isContact = currentPath === '/contact';
  const isCart = currentPath === '/cart' || currentPath === '/checkout';
  const isDashboard = currentPath === '/dashboard' || currentPath === '/admin' || currentPath.startsWith('/dashboard/');
  const isDark = theme === 'dark';

  const handleLogout = () => {
    logout();
    navigateTo('/');
  };

  return (
    <header className="souk-header">
      <div className="souk-header__shell">
        <div className="souk-header__top">
          <a href="/" className="souk-logo" style={{ textDecoration: 'none' }}>
            <span className="souk-logo__mark" aria-hidden="true">
              <img src={logoMark} alt="" />
            </span>
            <span className="souk-logo__text">Souk<span>Fellah</span></span>
          </a>

          <nav className="souk-nav" aria-label="Primary navigation">
            <a className={isHome ? 'active' : undefined} href="/" aria-current={isHome ? 'page' : undefined}>Home</a>
            <a className={isMarketplace ? 'active' : undefined} href="/marketplace" aria-current={isMarketplace ? 'page' : undefined}>Marketplace</a>
            <a className={isCart ? 'active' : undefined} href="/cart" aria-current={isCart ? 'page' : undefined} style={{ position: 'relative' }}>
              Cart
              {count > 0 && (
                <span style={{ position: 'absolute', top: '-8px', right: '-12px', background: '#e53935', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}>
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </a>
            <a className={isAbout ? 'active' : undefined} href="/about" aria-current={isAbout ? 'page' : undefined}>About Us</a>
            <a className={isContact ? 'active' : undefined} href="/contact" aria-current={isContact ? 'page' : undefined}>Contact</a>
            {isLoggedIn && (
              <a className={isDashboard ? 'active' : undefined} href="/dashboard">Dashboard</a>
            )}
          </nav>

          <div className="souk-actions">
            <button className="souk-theme-toggle" type="button" onClick={onToggleTheme} aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'} aria-pressed={isDark}>
              <span className="souk-theme-toggle__icon" aria-hidden="true">
                {isDark
                  ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="4.5" /><path d="M12 2.5v2.3M12 19.2v2.3M21.5 12h-2.3M4.8 12H2.5M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6M18.7 18.7l-1.6-1.6M6.9 6.9L5.3 5.3" strokeLinecap="round" /></svg>
                  : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 14.8A8.5 8.5 0 1 1 9.2 4a7.2 7.2 0 0 0 10.8 10.8Z" strokeLinecap="round" strokeLinejoin="round" /></svg>
                }
              </span>
              <span className="souk-theme-toggle__label">{isDark ? 'Light' : 'Dark'}</span>
            </button>
            {isLoggedIn
              ? <button className="ghost" type="button" onClick={handleLogout}>Log Out</button>
              : <>
                  <a className="ghost" href="/login">Log In</a>
                  <a className="solid" href="/register">Sign Up</a>
                </>
            }
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;