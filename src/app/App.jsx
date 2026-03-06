import { startTransition, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/home/HomePage';
import MarketplacePage from '../pages/marketplace/MarketplacePage';
import ProductDetailsPage from '../pages/product/ProductDetailsPage';
import AboutPage from '../pages/about/AboutPage';
import ContactPage from '../pages/contact/ContactPage';
import AdminDashboardPage from '../pages/dashboards/admin/AdminDashboardPage';
import UserDashboardPage from '../pages/dashboards/user/UserDashboardPage';
import FarmerDashboardPage from '../pages/dashboards/farmer/FarmerDashboardPage';
import CartPage from '../pages/cart/CartPage';
import CheckoutPage from '../pages/checkout/CheckoutPage';
import MapViewPage from '../pages/map/MapViewPage';
import FarmProductsPage from '../pages/map/FarmProductsPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import { AdminOperationsPage, BuyerWorkspacePage, FarmerStudioPage, SellerOnboardingPage } from '../pages/operations/RoleWorkspaces';
import { APP_NAVIGATE_EVENT, isInternalNavigationLink, navigateTo, normalizePathname } from './navigation';
import { applyLocale, createDomTranslator, getInitialLocale, persistLocale } from './i18n';
import { applyTheme, getInitialTheme, persistTheme, toggleThemeValue } from './theme';
import { getStoredRole } from './session';

const getCurrentPathname = () => {
  if (typeof window === 'undefined') {
    return '/';
  }
  return normalizePathname(window.location.pathname);
};

const ROUTE_TRANSITION_MS = 460;
const prefersReducedMotion = () => typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const resolvePage = (path) => {
  if (path.startsWith('/product')) {
    const [, rawProductId] = path.split('/').filter(Boolean);
    const productId = rawProductId ? decodeURIComponent(rawProductId) : undefined;
    return <ProductDetailsPage productId={productId} />;
  }
  if (path.startsWith('/farm')) {
    const [, rawFarmId] = path.split('/').filter(Boolean);
    const farmId = rawFarmId ? decodeURIComponent(rawFarmId) : undefined;
    return <FarmProductsPage farmId={farmId} />;
  }
  if (path === '/sell') {
    return <SellerOnboardingPage />;
  }
  if (path === '/dashboard/buyer/workspace' || path === '/dashboard/orders' || path === '/dashboard/favorites' || path === '/dashboard/addresses') {
    return <BuyerWorkspacePage />;
  }
  if (path === '/dashboard/farmer/studio' || path === '/dashboard/farmer/products' || path === '/dashboard/farmer/orders' || path === '/dashboard/farmer/payouts') {
    return <FarmerStudioPage />;
  }
  if (path === '/dashboard/admin/operations' || path === '/dashboard/admin/reviews' || path === '/dashboard/admin/applications' || path === '/dashboard/admin/disputes' || path === '/dashboard/admin/finance') {
    return <AdminOperationsPage />;
  }
  if (path === '/marketplace') {
    return <MarketplacePage />;
  }
  if (path === '/about') {
    return <AboutPage />;
  }
  if (path === '/contact') {
    return <ContactPage />;
  }
  if (path === '/dashboard') {
    const role = getStoredRole();
    if (role === 'admin') {
      return <AdminDashboardPage />;
    }
    if (role === 'farmer') {
      return <FarmerDashboardPage />;
    }
    return <UserDashboardPage />;
  }
  if (path === '/dashboard/farmer') {
    return <FarmerDashboardPage />;
  }
  if (path === '/dashboard/admin') {
    return <AdminDashboardPage />;
  }
  if (path === '/admin') {
    return <AdminDashboardPage />;
  }
  if (path === '/cart') {
    return <CartPage />;
  }
  if (path === '/checkout') {
    return <CheckoutPage />;
  }
  if (path === '/map') {
    return <MapViewPage />;
  }
  if (path === '/login') {
    return <LoginPage />;
  }
  if (path === '/register') {
    return <RegisterPage />;
  }
  return <HomePage />;
};

const App = () => {
  const [pathname, setPathname] = useState(getCurrentPathname);
  const [theme, setTheme] = useState(getInitialTheme);
  const [locale, setLocale] = useState(getInitialLocale);
  const [routeKey, setRouteKey] = useState(0);
  const [isRouting, setIsRouting] = useState(false);
  const routeTimerRef = useRef(null);
  const pathnameRef = useRef(pathname);
  const localeRef = useRef(locale);
  const domTranslatorRef = useRef(null);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    localeRef.current = locale;
  }, [locale]);

  useEffect(() => {
    applyTheme(theme);
    persistTheme(theme);
  }, [theme]);

  useEffect(() => {
    applyLocale(locale);
    persistLocale(locale);
    domTranslatorRef.current?.setLocale(locale);
  }, [locale]);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined;
    }

    const root = document.getElementById('root');
    if (!root) {
      return undefined;
    }

    const translator = createDomTranslator(root);
    domTranslatorRef.current = translator;
    translator.setLocale(localeRef.current);

    return () => {
      translator.disconnect();
      if (domTranslatorRef.current === translator) {
        domTranslatorRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    domTranslatorRef.current?.setLocale(locale);
  }, [pathname, routeKey, locale]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const markRouting = () => {
      setIsRouting(true);
      if (routeTimerRef.current) {
        window.clearTimeout(routeTimerRef.current);
      }
      routeTimerRef.current = window.setTimeout(() => {
        setIsRouting(false);
      }, ROUTE_TRANSITION_MS);
    };

    const syncRouteFromLocation = () => {
      const nextPath = normalizePathname(window.location.pathname);
      const didPathChange = nextPath !== pathnameRef.current;

      markRouting();

      if (didPathChange) {
        const supportsViewTransition = typeof document !== 'undefined' && typeof document.startViewTransition === 'function' && !prefersReducedMotion();
        const commitRouteChange = () => {
          setRouteKey((value) => value + 1);
          setPathname(nextPath);
        };

        if (supportsViewTransition) {
          try {
            document.startViewTransition(() => {
              flushSync(() => {
                commitRouteChange();
              });
            });
          } catch {
            startTransition(() => {
              commitRouteChange();
            });
          }
        } else {
          startTransition(() => {
            commitRouteChange();
          });
        }
      }

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          if (window.location.hash) {
            const targetId = decodeURIComponent(window.location.hash.slice(1));
            const target = targetId ? document.getElementById(targetId) : null;
            if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              return;
            }
          }
          window.scrollTo({ top: 0, behavior: didPathChange ? 'auto' : 'smooth' });
        });
      });
    };

    const handlePopState = () => {
      syncRouteFromLocation();
    };

    const handleNavigateEvent = () => {
      syncRouteFromLocation();
    };

    const handleDocumentClick = (event) => {
      if (event.defaultPrevented || event.button !== 0) {
        return;
      }

      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      if (!(event.target instanceof Element)) {
        return;
      }

      const anchor = event.target.closest('a[href]');
      if (!(anchor instanceof HTMLAnchorElement)) {
        return;
      }

      if (!isInternalNavigationLink(anchor)) {
        return;
      }

      const href = anchor.getAttribute('href');
      if (!href) {
        return;
      }

      event.preventDefault();
      navigateTo(href);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener(APP_NAVIGATE_EVENT, handleNavigateEvent);
    document.addEventListener('click', handleDocumentClick);

    return () => {
      if (routeTimerRef.current) {
        window.clearTimeout(routeTimerRef.current);
      }
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener(APP_NAVIGATE_EVENT, handleNavigateEvent);
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  const handleToggleTheme = () => {
    setTheme((current) => toggleThemeValue(current));
  };

  const handleChangeLanguage = (nextLocale) => {
    setLocale(nextLocale);
  };

  return <MainLayout theme={theme} onToggleTheme={handleToggleTheme} locale={locale} onChangeLanguage={handleChangeLanguage}>
      <div className={`app-route-layer${isRouting ? ' is-routing' : ''}`} aria-busy={isRouting ? 'true' : undefined}>
        <div className="app-route-progress" aria-hidden="true" />
        <div className="app-route-glow" aria-hidden="true" />
        <div className="app-route-view" key={`${pathname}-${routeKey}`}>
          {resolvePage(pathname)}
        </div>
      </div>
    </MainLayout>;
};
export default App;
