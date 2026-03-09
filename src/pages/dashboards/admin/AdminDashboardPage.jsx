/**
 * AdminDashboardPage — 100% Supabase.
 * Real admin panel: manage users, products, orders, farms from the database.
 * Only accessible to users with role = 'admin' in profiles table.
 */
import { useCallback, useEffect, useState } from 'react';
import { useAuth }    from '../../../app/providers/AuthProvider';
import { supabase }   from '../../../services/supabase';
import { navigateTo } from '../../../app/navigation';
import heroImage      from '../../../assets/images/home-hero.png';
import fieldsImage    from '../../../assets/images/home-fields.png';
import '../dashboard-ui.css';
import './AdminDashboardPage.css';

/* ── Formatters ──────────────────────────────────────────────────────────── */
const fmtDh    = v => `${Number(v ?? 0).toLocaleString('fr-MA')} DH`;
const fmtDate  = iso => iso ? new Intl.DateTimeFormat('en-GB', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date(iso)) : '—';
const fmtStamp = iso => iso ? new Intl.DateTimeFormat('en-GB', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(iso)) : '—';

const roleBadge = r => {
  if (r === 'admin')  return 'dash-status dash-status--danger';
  if (r === 'farmer') return 'dash-status dash-status--success';
  return 'dash-status dash-status--info';
};
const statusBadge = s => {
  if (s === 'active' || s === 'delivered') return 'dash-status dash-status--success';
  if (s === 'suspended' || s === 'cancelled') return 'dash-status dash-status--danger';
  if (s === 'preparing' || s === 'in_transit') return 'dash-status dash-status--warning';
  return 'dash-status dash-status--info';
};

/* ── Nav ─────────────────────────────────────────────────────────────────── */
const NAV = [
  { key: 'dashboard', label: '📊 Dashboard'  },
  { key: 'users',     label: '👥 Users'       },
  { key: 'products',  label: '🌿 Products'    },
  { key: 'orders',    label: '📦 Orders'      },
  { key: 'farms',     label: '🏡 Farms'       },
];

/* ════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
const AdminDashboardPage = () => {
  const { profile, userId, logout } = useAuth();
  const displayName = profile?.full_name || profile?.email || 'Admin';
  const initials    = displayName.split(/\s+/).slice(0,2).map(w => w[0]?.toUpperCase() || '').join('') || 'AD';

  const pageStyle = {
    '--admin-hero-image':   `url(${heroImage})`,
    '--admin-fields-image': `url(${fieldsImage})`,
  };

  /* ── Section ─────────────────────────────────────────────────────────── */
  const [section, setSection] = useState('dashboard');

  /* ── Data ────────────────────────────────────────────────────────────── */
  const [users,    setUsers]    = useState([]);
  const [products, setProducts] = useState([]);
  const [orders,   setOrders]   = useState([]);
  const [farms,    setFarms]    = useState([]);
  const [stats,    setStats]    = useState({ users: 0, products: 0, orders: 0, revenue: 0, farms: 0 });
  const [loading,  setLoading]  = useState(true);
  const [notice,   setNotice]   = useState(null);

  /* ── Filters ─────────────────────────────────────────────────────────── */
  const [userSearch,    setUserSearch]    = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch,   setOrderSearch]   = useState('');

  /* ── Selected rows ───────────────────────────────────────────────────── */
  const [selectedUserId,    setSelectedUserId]    = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedOrderId,   setSelectedOrderId]   = useState(null);
  const [selectedFarmId,    setSelectedFarmId]    = useState(null);

  /* ── Edit modals ─────────────────────────────────────────────────────── */
  const [editUser,    setEditUser]    = useState(null);
  const [editProduct, setEditProduct] = useState(null);

  /* ── Access guard ────────────────────────────────────────────────────── */
  useEffect(() => {
    if (profile && profile.role !== 'admin') navigateTo('/');
  }, [profile]);

  /* ── Load all data ───────────────────────────────────────────────────── */
  const loadAll = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const [
        { data: usersData },
        { data: productsData },
        { data: ordersData },
        { data: farmsData },
      ] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('products').select('*, farms(name, owner_id)').order('created_at', { ascending: false }),
        supabase.from('orders').select('*, profiles(full_name, email)').order('created_at', { ascending: false }),
        supabase.from('farms').select('*, profiles(full_name, email)').order('created_at', { ascending: false }),
      ]);

      const u = usersData    || [];
      const p = productsData || [];
      const o = ordersData   || [];
      const f = farmsData    || [];

      setUsers(u);
      setProducts(p);
      setOrders(o);
      setFarms(f);
      setStats({
        users:    u.length,
        products: p.length,
        orders:   o.length,
        farms:    f.length,
        revenue:  o.filter(x => x.status !== 'cancelled').reduce((s, x) => s + Number(x.total_dh ?? 0), 0),
      });
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [userId]);

  useEffect(() => { if (userId) loadAll(); }, [userId]);

  const pushNotice = (msg, type = 'success') => setNotice({ id: Date.now(), msg, type });

  /* ════════════════════════════════════════════════════════════════════════
     USER ACTIONS
  ═══════════════════════════════════════════════════════════════════════ */
  const saveUser = async () => {
    if (!editUser) return;
    const { error } = await supabase.from('profiles')
      .update({ full_name: editUser.full_name, role: editUser.role, status: editUser.status })
      .eq('id', editUser.id);
    if (error) { pushNotice(error.message, 'danger'); return; }
    setUsers(prev => prev.map(u => u.id === editUser.id ? { ...u, ...editUser } : u));
    setEditUser(null);
    pushNotice('User updated.');
  };

  const deleteUser = async (user) => {
    if (!window.confirm(`Delete ${user.full_name || user.email}? This cannot be undone.`)) return;
    const { error } = await supabase.from('profiles').delete().eq('id', user.id);
    if (error) { pushNotice(error.message, 'danger'); return; }
    setUsers(prev => prev.filter(u => u.id !== user.id));
    if (selectedUserId === user.id) setSelectedUserId(null);
    pushNotice(`${user.full_name || user.email} deleted.`, 'danger');
  };

  const toggleUserStatus = async (user) => {
    const next = user.status === 'suspended' ? 'active' : 'suspended';
    const { error } = await supabase.from('profiles').update({ status: next }).eq('id', user.id);
    if (error) { pushNotice(error.message, 'danger'); return; }
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: next } : u));
    pushNotice(`${user.full_name || user.email} is now ${next}.`);
  };

  const makeAdmin = async (user) => {
    if (!window.confirm(`Make ${user.full_name || user.email} an admin?`)) return;
    const { error } = await supabase.from('profiles').update({ role: 'admin' }).eq('id', user.id);
    if (error) { pushNotice(error.message, 'danger'); return; }
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: 'admin' } : u));
    pushNotice(`${user.full_name || user.email} is now admin.`);
  };

  /* ════════════════════════════════════════════════════════════════════════
     PRODUCT ACTIONS
  ═══════════════════════════════════════════════════════════════════════ */
  const saveProduct = async () => {
    if (!editProduct) return;
    const { error } = await supabase.from('products')
      .update({ name: editProduct.name, price_dh: editProduct.price_dh, status: editProduct.status, available_kg: editProduct.available_kg, category: editProduct.category })
      .eq('id', editProduct.id);
    if (error) { pushNotice(error.message, 'danger'); return; }
    setProducts(prev => prev.map(p => p.id === editProduct.id ? { ...p, ...editProduct } : p));
    setEditProduct(null);
    pushNotice('Product updated.');
  };

  const deleteProduct = async (product) => {
    if (!window.confirm(`Delete product "${product.name}"?`)) return;
    const { error } = await supabase.from('products').delete().eq('id', product.id);
    if (error) { pushNotice(error.message, 'danger'); return; }
    setProducts(prev => prev.filter(p => p.id !== product.id));
    if (selectedProductId === product.id) setSelectedProductId(null);
    pushNotice(`"${product.name}" deleted.`, 'danger');
  };

  const toggleProductStatus = async (product) => {
    const next = product.status === 'active' ? 'inactive' : 'active';
    const { error } = await supabase.from('products').update({ status: next }).eq('id', product.id);
    if (error) { pushNotice(error.message, 'danger'); return; }
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, status: next } : p));
    pushNotice(`"${product.name}" is now ${next}.`);
  };

  /* ════════════════════════════════════════════════════════════════════════
     ORDER ACTIONS
  ═══════════════════════════════════════════════════════════════════════ */
  const updateOrderStatus = async (order, next) => {
    const { error } = await supabase.from('orders').update({ status: next }).eq('id', order.id);
    if (error) { pushNotice(error.message, 'danger'); return; }
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: next } : o));
    pushNotice(`Order updated to ${next}.`);
  };

  const deleteOrder = async (order) => {
    if (!window.confirm(`Delete order ${order.id.slice(0,8)}?`)) return;
    const { error } = await supabase.from('orders').delete().eq('id', order.id);
    if (error) { pushNotice(error.message, 'danger'); return; }
    setOrders(prev => prev.filter(o => o.id !== order.id));
    if (selectedOrderId === order.id) setSelectedOrderId(null);
    pushNotice('Order deleted.', 'danger');
  };

  /* ════════════════════════════════════════════════════════════════════════
     FARM ACTIONS
  ═══════════════════════════════════════════════════════════════════════ */
  const deleteFarm = async (farm) => {
    if (!window.confirm(`Delete farm "${farm.name}"? This will also remove its products.`)) return;
    const { error } = await supabase.from('farms').delete().eq('id', farm.id);
    if (error) { pushNotice(error.message, 'danger'); return; }
    setFarms(prev => prev.filter(f => f.id !== farm.id));
    if (selectedFarmId === farm.id) setSelectedFarmId(null);
    pushNotice(`Farm "${farm.name}" deleted.`, 'danger');
  };

  /* ════════════════════════════════════════════════════════════════════════
     FILTERED LISTS
  ═══════════════════════════════════════════════════════════════════════ */
  const filteredUsers = users.filter(u => {
    if (userRoleFilter !== 'all' && u.role !== userRoleFilter) return false;
    if (userSearch.trim()) {
      const q = userSearch.toLowerCase();
      return `${u.full_name} ${u.email} ${u.role}`.toLowerCase().includes(q);
    }
    return true;
  });

  const filteredProducts = products.filter(p => {
    if (!productSearch.trim()) return true;
    return `${p.name} ${p.category} ${p.farms?.name}`.toLowerCase().includes(productSearch.toLowerCase());
  });

  const filteredOrders = orders.filter(o => {
    if (!orderSearch.trim()) return true;
    return `${o.id} ${o.profiles?.full_name} ${o.profiles?.email} ${o.status}`.toLowerCase().includes(orderSearch.toLowerCase());
  });

  const selectedUser    = users.find(u => u.id === selectedUserId) ?? null;
  const selectedProduct = products.find(p => p.id === selectedProductId) ?? null;
  const selectedOrder   = orders.find(o => o.id === selectedOrderId) ?? null;
  const selectedFarm    = farms.find(f => f.id === selectedFarmId) ?? null;

  /* ════════════════════════════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════════════════════════ */
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', opacity: 0.5 }}>
      Loading admin data…
    </div>
  );

  return (
    <div className="admin-dashboard" style={pageStyle}>
      <div className="admin-dashboard__layout">

        {/* ── Sidebar ── */}
        <aside className="admin-sidebar">
          <div className="admin-sidebar__profile">
            <div className="admin-sidebar__avatar"><span>{initials}</span></div>
            <div>
              <p className="admin-sidebar__name">{displayName}</p>
              <p className="admin-sidebar__role">Administrator</p>
            </div>
          </div>
          <nav className="admin-sidebar__nav">
            {NAV.map(item => (
              <button key={item.key} type="button"
                className={section === item.key ? 'active' : undefined}
                onClick={() => setSection(item.key)}>
                {item.label}
              </button>
            ))}
          </nav>
          <div className="admin-sidebar__footer">
            <button type="button" onClick={() => { logout(); navigateTo('/'); }}>🚪 Log Out</button>
          </div>
        </aside>

        {/* ── Main content ── */}
        <div className="admin-dashboard__content">

          <header className="admin-welcome">
            <div>
              <p className="admin-welcome__kicker">Administrator Dashboard</p>
              <h1>Welcome back, {displayName}!</h1>
              <p>Full control over users, products, orders and farms.</p>
            </div>
            <div className="admin-welcome__actions">
              <span className="admin-chip">Admin</span>
              <button type="button" className="dash-btn dash-btn--compact" onClick={loadAll}>↻ Refresh</button>
            </div>
          </header>

          {/* Notice */}
          {notice && (
            <div className={`dash-alert ${notice.type === 'danger' ? 'dash-alert--danger' : notice.type === 'warning' ? 'dash-alert--warning' : 'dash-alert--success'}`}>
              <span>{notice.msg}</span>
              <button type="button" className="dash-btn dash-btn--compact" onClick={() => setNotice(null)}>✕</button>
            </div>
          )}

          {/* ── Stats ── */}
          <section className="admin-stats">
            <article onClick={() => setSection('users')} style={{ cursor: 'pointer' }}>
              <div className="admin-stats__icon">👥</div>
              <div><h3>{stats.users}</h3><p>Users</p><span>{users.filter(u => u.role === 'farmer').length} farmers</span></div>
            </article>
            <article onClick={() => setSection('products')} style={{ cursor: 'pointer' }}>
              <div className="admin-stats__icon">🌿</div>
              <div><h3>{stats.products}</h3><p>Products</p><span>{products.filter(p => p.status === 'active').length} active</span></div>
            </article>
            <article onClick={() => setSection('orders')} style={{ cursor: 'pointer' }}>
              <div className="admin-stats__icon">📦</div>
              <div><h3>{stats.orders}</h3><p>Orders</p><span>{fmtDh(stats.revenue)} total</span></div>
            </article>
            <article onClick={() => setSection('farms')} style={{ cursor: 'pointer' }}>
              <div className="admin-stats__icon">🏡</div>
              <div><h3>{stats.farms}</h3><p>Farms</p><span>on the platform</span></div>
            </article>
          </section>

          {/* ════════════════════════════════════════════════════════
              USERS SECTION
          ════════════════════════════════════════════════════════ */}
          {(section === 'dashboard' || section === 'users') && (
            <section className="admin-users">
              <div className="admin-section__header admin-section__header--stack">
                <div>
                  <h2>User Management</h2>
                  <div className="dash-toolbar__meta">{filteredUsers.length} users</div>
                </div>
                <div className="admin-users__tools">
                  <input className="dash-input" placeholder="Search users…" value={userSearch} onChange={e => setUserSearch(e.target.value)} style={{ minWidth: 180 }} />
                  <select className="dash-select" value={userRoleFilter} onChange={e => setUserRoleFilter(e.target.value)}>
                    <option value="all">All roles</option>
                    <option value="buyer">Buyer</option>
                    <option value="farmer">Farmer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="admin-table">
                <div className="admin-table__head">
                  <span>User</span><span>Role</span><span>Status</span><span>Joined</span><span>Actions</span>
                </div>
                {filteredUsers.slice(0, section === 'users' ? 999 : 8).map(user => (
                  <div key={user.id}
                    className={`admin-table__row${selectedUserId === user.id ? ' is-selected' : ''}`}
                    onClick={() => setSelectedUserId(user.id)}>
                    <div className="admin-user">
                      <span className="admin-user__avatar">{(user.full_name || user.email || '?')[0].toUpperCase()}</span>
                      <div>
                        <p className="admin-user__name">{user.full_name || '—'}</p>
                        <p className="admin-user__email">{user.email}</p>
                      </div>
                    </div>
                    <span className={roleBadge(user.role)}>{user.role}</span>
                    <span className={statusBadge(user.status ?? 'active')}>{user.status ?? 'active'}</span>
                    <span style={{ fontSize: 12, color: '#888' }}>{fmtDate(user.created_at)}</span>
                    <div className="admin-actions" onClick={e => e.stopPropagation()}>
                      <button className="primary" type="button" onClick={() => setEditUser({ ...user })}>Edit</button>
                      <button className="ghost" type="button" onClick={() => toggleUserStatus(user)}>
                        {user.status === 'suspended' ? 'Activate' : 'Suspend'}
                      </button>
                      {user.role !== 'admin' && (
                        <button className="ghost" type="button" onClick={() => makeAdmin(user)}>Make Admin</button>
                      )}
                      <button className="dash-btn dash-btn--danger dash-btn--compact" type="button" onClick={() => deleteUser(user)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* User detail panel */}
              {selectedUser && (
                <div className="dash-section" key={selectedUser.id} style={{ marginTop: 16 }}>
                  <div className="dash-toolbar">
                    <div>
                      <p className="dash-section__title">{selectedUser.full_name || selectedUser.email}</p>
                      <p className="dash-section__subtitle">{selectedUser.email} · {selectedUser.role} · joined {fmtDate(selectedUser.created_at)}</p>
                    </div>
                    <span className={roleBadge(selectedUser.role)}>{selectedUser.role}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                    <button type="button" className="dash-btn dash-btn--primary" onClick={() => setEditUser({ ...selectedUser })}>✏️ Edit User</button>
                    <button type="button" className="dash-btn" onClick={() => toggleUserStatus(selectedUser)}>
                      {selectedUser.status === 'suspended' ? '✅ Activate' : '🚫 Suspend'}
                    </button>
                    {selectedUser.role !== 'admin' && (
                      <button type="button" className="dash-btn" onClick={() => makeAdmin(selectedUser)}>⭐ Make Admin</button>
                    )}
                    <button type="button" className="dash-btn dash-btn--danger" onClick={() => deleteUser(selectedUser)}>🗑 Delete</button>
                  </div>
                </div>
              )}

              {/* Edit user modal */}
              {editUser && (
                <div className="dash-section" style={{ marginTop: 16 }}>
                  <div className="dash-toolbar">
                    <p className="dash-section__title">Edit User</p>
                    <button type="button" className="dash-btn" onClick={() => setEditUser(null)}>Close</button>
                  </div>
                  <div className="dash-field-grid dash-field-grid--3">
                    <label className="dash-label">Full Name
                      <input className="dash-input" value={editUser.full_name ?? ''} onChange={e => setEditUser(p => ({ ...p, full_name: e.target.value }))} />
                    </label>
                    <label className="dash-label">Role
                      <select className="dash-select" value={editUser.role ?? 'buyer'} onChange={e => setEditUser(p => ({ ...p, role: e.target.value }))}>
                        <option value="buyer">Buyer</option>
                        <option value="farmer">Farmer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </label>
                    <label className="dash-label">Status
                      <select className="dash-select" value={editUser.status ?? 'active'} onChange={e => setEditUser(p => ({ ...p, status: e.target.value }))}>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </label>
                  </div>
                  <div className="dash-form-actions">
                    <button type="button" className="dash-btn dash-btn--primary" onClick={saveUser}>💾 Save Changes</button>
                    <button type="button" className="dash-btn dash-btn--danger" onClick={() => deleteUser(editUser)}>🗑 Delete User</button>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* ════════════════════════════════════════════════════════
              PRODUCTS SECTION
          ════════════════════════════════════════════════════════ */}
          {section === 'products' && (
            <section className="admin-users">
              <div className="admin-section__header admin-section__header--stack">
                <div><h2>Products</h2><div className="dash-toolbar__meta">{filteredProducts.length} products</div></div>
                <input className="dash-input" placeholder="Search products…" value={productSearch} onChange={e => setProductSearch(e.target.value)} style={{ minWidth: 220 }} />
              </div>

              <div className="admin-table">
                <div className="admin-table__head">
                  <span>Product</span><span>Farm</span><span>Price</span><span>Stock</span><span>Status</span><span>Actions</span>
                </div>
                {filteredProducts.map(p => (
                  <div key={p.id}
                    className={`admin-table__row${selectedProductId === p.id ? ' is-selected' : ''}`}
                    onClick={() => setSelectedProductId(p.id)}>
                    <div>
                      <p style={{ fontWeight: 600, margin: 0 }}>{p.name}</p>
                      <p style={{ fontSize: 12, color: '#888', margin: 0 }}>{p.category}</p>
                    </div>
                    <span style={{ fontSize: 13 }}>{p.farms?.name ?? '—'}</span>
                    <span style={{ fontWeight: 600, color: '#4f7a46' }}>{p.price_dh} DH/{p.unit}</span>
                    <span style={{ fontSize: 13 }}>{p.available_kg ?? p.available ?? 0} {p.unit}</span>
                    <span className={statusBadge(p.status)}>{p.status}</span>
                    <div className="admin-actions" onClick={e => e.stopPropagation()}>
                      <button className="primary" type="button" onClick={() => setEditProduct({ ...p })}>Edit</button>
                      <button className="ghost" type="button" onClick={() => toggleProductStatus(p)}>
                        {p.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button className="dash-btn dash-btn--danger dash-btn--compact" type="button" onClick={() => deleteProduct(p)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Edit product modal */}
              {editProduct && (
                <div className="dash-section" key={editProduct.id} style={{ marginTop: 16 }}>
                  <div className="dash-toolbar">
                    <p className="dash-section__title">Edit Product — {editProduct.name}</p>
                    <button type="button" className="dash-btn" onClick={() => setEditProduct(null)}>Close</button>
                  </div>
                  <div className="dash-field-grid dash-field-grid--3">
                    <label className="dash-label">Name
                      <input className="dash-input" value={editProduct.name ?? ''} onChange={e => setEditProduct(p => ({ ...p, name: e.target.value }))} />
                    </label>
                    <label className="dash-label">Price (DH)
                      <input className="dash-input" type="number" value={editProduct.price_dh ?? ''} onChange={e => setEditProduct(p => ({ ...p, price_dh: e.target.value }))} />
                    </label>
                    <label className="dash-label">Stock (kg)
                      <input className="dash-input" type="number" value={editProduct.available_kg ?? editProduct.available ?? ''} onChange={e => setEditProduct(p => ({ ...p, available_kg: e.target.value }))} />
                    </label>
                    <label className="dash-label">Category
                      <input className="dash-input" value={editProduct.category ?? ''} onChange={e => setEditProduct(p => ({ ...p, category: e.target.value }))} />
                    </label>
                    <label className="dash-label">Status
                      <select className="dash-select" value={editProduct.status ?? 'active'} onChange={e => setEditProduct(p => ({ ...p, status: e.target.value }))}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </label>
                  </div>
                  <div className="dash-form-actions">
                    <button type="button" className="dash-btn dash-btn--primary" onClick={saveProduct}>💾 Save Changes</button>
                    <button type="button" className="dash-btn dash-btn--danger" onClick={() => deleteProduct(editProduct)}>🗑 Delete Product</button>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* ════════════════════════════════════════════════════════
              ORDERS SECTION
          ════════════════════════════════════════════════════════ */}
          {section === 'orders' && (
            <section className="admin-users">
              <div className="admin-section__header admin-section__header--stack">
                <div><h2>Orders</h2><div className="dash-toolbar__meta">{filteredOrders.length} orders</div></div>
                <input className="dash-input" placeholder="Search by buyer, status, ID…" value={orderSearch} onChange={e => setOrderSearch(e.target.value)} style={{ minWidth: 240 }} />
              </div>

              <div className="admin-table">
                <div className="admin-table__head">
                  <span>Order ID</span><span>Buyer</span><span>Total</span><span>Status</span><span>Date</span><span>Actions</span>
                </div>
                {filteredOrders.map(o => (
                  <div key={o.id}
                    className={`admin-table__row${selectedOrderId === o.id ? ' is-selected' : ''}`}
                    onClick={() => setSelectedOrderId(o.id)}>
                    <span style={{ fontFamily: 'monospace', fontSize: 12 }}>#{o.id.slice(0,8).toUpperCase()}</span>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: 13 }}>{o.profiles?.full_name ?? '—'}</p>
                      <p style={{ margin: 0, fontSize: 12, color: '#888' }}>{o.profiles?.email}</p>
                    </div>
                    <span style={{ fontWeight: 700, color: '#4f7a46' }}>{fmtDh(o.total_dh)}</span>
                    <span className={statusBadge(o.status)}>{o.status}</span>
                    <span style={{ fontSize: 12, color: '#888' }}>{fmtDate(o.created_at)}</span>
                    <div className="admin-actions" onClick={e => e.stopPropagation()}>
                      <select className="dash-select" style={{ fontSize: 12, padding: '2px 6px' }}
                        value={o.status}
                        onChange={e => updateOrderStatus(o, e.target.value)}>
                        <option value="preparing">Preparing</option>
                        <option value="in_transit">In Transit</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button className="dash-btn dash-btn--danger dash-btn--compact" type="button" onClick={() => deleteOrder(o)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>

              {selectedOrder && (
                <div className="dash-section" key={selectedOrder.id} style={{ marginTop: 16 }}>
                  <div className="dash-toolbar">
                    <div>
                      <p className="dash-section__title">Order #{selectedOrder.id.slice(0,8).toUpperCase()}</p>
                      <p className="dash-section__subtitle">
                        {selectedOrder.profiles?.full_name} · {selectedOrder.profiles?.email} · {fmtDate(selectedOrder.created_at)}
                      </p>
                    </div>
                    <span className={statusBadge(selectedOrder.status)}>{selectedOrder.status}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 10, fontSize: 13 }}>
                    <span><b>Total:</b> {fmtDh(selectedOrder.total_dh)}</span>
                    <span><b>Payment:</b> {selectedOrder.payment_method}</span>
                    <span><b>ETA:</b> {selectedOrder.eta ?? '—'}</span>
                    {selectedOrder.shipping_address && (
                      <span style={{ gridColumn: '1/-1' }}><b>Address:</b> {selectedOrder.shipping_address.address}, {selectedOrder.shipping_address.phone}</span>
                    )}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* ════════════════════════════════════════════════════════
              FARMS SECTION
          ════════════════════════════════════════════════════════ */}
          {section === 'farms' && (
            <section className="admin-users">
              <div className="admin-section__header admin-section__header--stack">
                <div><h2>Farms</h2><div className="dash-toolbar__meta">{farms.length} farms</div></div>
              </div>

              <div className="admin-table">
                <div className="admin-table__head">
                  <span>Farm</span><span>Owner</span><span>City</span><span>Created</span><span>Actions</span>
                </div>
                {farms.map(f => (
                  <div key={f.id}
                    className={`admin-table__row${selectedFarmId === f.id ? ' is-selected' : ''}`}
                    onClick={() => setSelectedFarmId(f.id)}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600 }}>{f.name}</p>
                      <p style={{ margin: 0, fontSize: 12, color: '#888' }}>{f.description?.slice(0, 60)}…</p>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 13 }}>{f.profiles?.full_name ?? '—'}</p>
                      <p style={{ margin: 0, fontSize: 12, color: '#888' }}>{f.profiles?.email}</p>
                    </div>
                    <span style={{ fontSize: 13 }}>{f.city ?? '—'}</span>
                    <span style={{ fontSize: 12, color: '#888' }}>{fmtDate(f.created_at)}</span>
                    <div className="admin-actions" onClick={e => e.stopPropagation()}>
                      <button className="dash-btn dash-btn--danger dash-btn--compact" type="button" onClick={() => deleteFarm(f)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>

              {selectedFarm && (
                <div className="dash-section" key={selectedFarm.id} style={{ marginTop: 16 }}>
                  <div className="dash-toolbar">
                    <div>
                      <p className="dash-section__title">{selectedFarm.name}</p>
                      <p className="dash-section__subtitle">{selectedFarm.city} · Owner: {selectedFarm.profiles?.full_name ?? selectedFarm.profiles?.email}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: '#6d7a6b', marginTop: 8 }}>{selectedFarm.description}</p>
                  <div style={{ marginTop: 10 }}>
                    <strong style={{ fontSize: 13 }}>Products from this farm:</strong>
                    <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {products.filter(p => p.farm_id === selectedFarm.id).map(p => (
                        <span key={p.id} style={{ background: '#f0f4ee', borderRadius: 8, padding: '3px 10px', fontSize: 12, color: '#4f7a46' }}>
                          {p.name} — {p.price_dh} DH
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <button type="button" className="dash-btn dash-btn--danger" onClick={() => deleteFarm(selectedFarm)}>🗑 Delete Farm</button>
                  </div>
                </div>
              )}
            </section>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;