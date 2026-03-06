import HomePage from '../pages/home/HomePage';
import MarketplacePage from '../pages/marketplace/MarketplacePage';
import MapViewPage from '../pages/map/MapViewPage';
import ProductDetailsPage from '../pages/product/ProductDetailsPage';
import CartPage from '../pages/cart/CartPage';
import CheckoutPage from '../pages/checkout/CheckoutPage';
import OrderSuccessPage from '../pages/order/OrderSuccessPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import AboutPage from '../pages/about/AboutPage';
import ContactPage from '../pages/contact/ContactPage';
import AdminDashboardPage from '../pages/dashboards/admin/AdminDashboardPage';
import UserDashboardPage from '../pages/dashboards/user/UserDashboardPage';
import FarmerDashboardPage from '../pages/dashboards/farmer/FarmerDashboardPage';
export const routes = [{
  path: '/',
  element: <HomePage />
}, {
  path: '/marketplace',
  element: <MarketplacePage />
}, {
  path: '/map',
  element: <MapViewPage />
}, {
  path: '/product/:id',
  element: <ProductDetailsPage />
}, {
  path: '/cart',
  element: <CartPage />
}, {
  path: '/checkout',
  element: <CheckoutPage />
}, {
  path: '/order-success',
  element: <OrderSuccessPage />
}, {
  path: '/login',
  element: <LoginPage />
}, {
  path: '/register',
  element: <RegisterPage />
}, {
  path: '/about',
  element: <AboutPage />
}, {
  path: '/contact',
  element: <ContactPage />
}, {
  path: '/dashboard',
  element: <UserDashboardPage />
}, {
  path: '/dashboard/farmer',
  element: <FarmerDashboardPage />
}, {
  path: '/dashboard/admin',
  element: <AdminDashboardPage />
}, {
  path: '/admin',
  element: <AdminDashboardPage />
}];