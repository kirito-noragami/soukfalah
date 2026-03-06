import Navbar from './components/Navbar';
import Footer from './components/Footer';
const AuthLayout = ({
  children
}) => {
  return <div className="auth-shell">
      <Navbar />
      <main className="auth-main">{children}</main>
      <Footer />
    </div>;
};
export default AuthLayout;