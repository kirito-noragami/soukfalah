import Navbar from './components/Navbar';
import UserMenu from './components/UserMenu';
const DashboardLayout = ({
  children
}) => {
  return <div className="dashboard-shell">
      <Navbar />
      <div className="dashboard-main">
        <UserMenu />
        <main className="dashboard-content">{children}</main>
      </div>
    </div>;
};
export default DashboardLayout;