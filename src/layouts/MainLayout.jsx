import Navbar from './components/Navbar';
import Footer from './components/Footer';
const MainLayout = ({
  children,
  theme,
  onToggleTheme,
  locale,
  onChangeLanguage
}) => {
  return <div className="app-shell">
      <div className="app-surface">
        <Navbar theme={theme} onToggleTheme={onToggleTheme} />
        <main className="app-main">{children}</main>
        <Footer locale={locale} onChangeLanguage={onChangeLanguage} />
      </div>
    </div>;
};
export default MainLayout;
