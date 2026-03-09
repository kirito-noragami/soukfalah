/**
 * UserDashboardPage — 100% Supabase.
 *
 * Reads / writes:
 *  - orders       (buyer's orders with order_items + products)
 *  - favorites    (saved farms)
 *  - activity_log (on actions)
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import fieldsImage from '../../../assets/images/home-fields.png';
import heroImage   from '../../../assets/images/home-hero.png';
import { useAuth }    from '../../../app/providers/AuthProvider';
import { useCart }    from '../../../app/providers/CartProvider';
import { supabase }   from '../../../services/supabase';
import { navigateTo } from '../../../app/navigation';
import '../dashboard-ui.css';
import './UserDashboardPage.css';

/* ─── Formatters ─────────────────────────────────────────────────────────── */
const fmtDh    = v  => `${new Intl.NumberFormat('fr-MA').format(Math.round(v))} DH`;
const fmtStamp = iso => {
  try { return new Intl.DateTimeFormat('en-GB', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(iso)); }
  catch { return iso; }
};

const statusCls = s => {
  if (s === 'delivered') return 'dash-status dash-status--success';
  if (s === 'cancelled') return 'dash-status dash-status--danger';
  if (s === 'in_transit') return 'dash-status dash-status--info';
  return 'dash-status dash-status--warning';
};

const STATUS_LABEL = { preparing: 'Preparing', in_transit: 'In Transit', delivered: 'Delivered', cancelled: 'Cancelled' };
const STATUS_FLOW  = ['preparing', 'in_transit', 'delivered'];

/* Normalise Supabase order row to UI shape */
const normaliseOrder = (o) => ({
  id:        o.id,
  status:    o.status,
  payment:   o.payment_method === 'cash' ? 'Cash on Delivery' : 'Card',
  totalDh:   Number(o.total_dh),
  createdAt: o.created_at,
  eta:       o.eta ?? 'Soon',
  farm:      o.order_items?.[0]?.products?.farms?.name ?? '—',
  product:   (o.order_items ?? []).map(i => i.products?.name).filter(Boolean).join(', ') || '—',
  quantity:  (o.order_items ?? []).reduce((s, i) => s + Number(i.quantity), 0),
  rawItemIds: (o.order_items ?? []).map(i => i.id), // order_items.id for request matching
  items:     (o.order_items ?? []).map(i => ({
    id:         i.products?.id ?? i.product_id, // product UUID — required by addItem
    product_id: i.products?.id ?? i.product_id,
    name:       i.products?.name ?? '?',
    price:      Number(i.price_per_unit),
    price_dh:   Number(i.price_per_unit),
    unit:       i.products?.unit ?? 'kg',
    accent:     i.products?.accent ?? '#888',
    quantity:   Number(i.quantity),
    farmer:   i.products?.farms?.name ?? '',
  })),
  shipping: o.shipping_address ?? {},
});

/* ─── Component ───────────────────────────────────────────────────────────── */
const UserDashboardPage = () => {
  const { fullName, username, userId } = useAuth();
  const { addItem, clearCart } = useCart();
  const displayName = fullName || username || 'there';

  const pageStyle = {
    '--buyer-hero-image':   `url(${heroImage})`,
    '--buyer-fields-image': `url(${fieldsImage})`,
  };

  /* ── State ────────────────────────────────────────────────────────────── */
  const [orders,    setOrders]    = useState([]);
  const [requests,  setRequests]  = useState([]); // farmer_requests for this buyer
  const [favorites, setFavorites] = useState([]);
  const [allFarms,  setAllFarms]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [notice,    setNotice]    = useState(null);

  const [selectedOrderId,    setSelectedOrderId]    = useState(null);
  const [orderStatusFilter,  setOrderStatusFilter]  = useState('all');
  const [orderSearch,        setOrderSearch]        = useState('');
  const [showAllOrders,      setShowAllOrders]      = useState(false);
  const [farmToAdd,          setFarmToAdd]          = useState('');
  const [showFavManager,     setShowFavManager]     = useState(false);
  const [favCityFilter,      setFavCityFilter]      = useState('all');

  /* ── Load ─────────────────────────────────────────────────────────────── */
  const loadAll = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      // Orders
      const { data: orderData } = await supabase
        .from('orders')
        .select(`
          id, status, payment_method, total_dh, priority, eta, shipping_address, created_at,
          order_items(id, quantity, price_per_unit,
            products(id, name, unit, accent, farm_id,
              farms(id, name, city)
            )
          )
        `)
        .eq('buyer_id', userId)
        .order('created_at', { ascending: false });

      if (orderData) {
        const normalised = orderData.map(normaliseOrder);
        setOrders(normalised);
        if (normalised.length) setSelectedOrderId(normalised[0].id);
      }

      // Farmer requests sent by this buyer
      const { data: reqData } = await supabase
        .from('farmer_requests')
        .select('id, order_item_id, status, product_name, farmer_id, created_at')
        .eq('buyer_id', userId);
      setRequests(reqData || []);

      // Favorites
      const { data: favData } = await supabase
        .from('favorites')
        .select('*, farms(id, name, city, accent, products(name))')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      setFavorites(favData || []);

      // All farms for "add favorite" dropdown
      const { data: farmData } = await supabase
        .from('farms')
        .select('id, name, city')
        .order('name');
      setAllFarms(farmData || []);
    } catch (e) { console.error('Load error:', e.message); }
    finally { setLoading(false); }
  }, [userId]);

  useEffect(() => { loadAll(); }, [loadAll]);

  /* ── Helpers ─────────────────────────────────────────────────────────── */
  const pushNotice = (msg, type = 'success') => setNotice({ id: Date.now(), msg, type });

  /* ── Order actions ───────────────────────────────────────────────────── */

  // Send order items to farmer as requests (one per unique farmer)
  const handleSendToFarmer = async () => {
    const order = orders.find(o => o.id === selectedOrderId);
    if (!order) return;

    // Get full order_items with farmer_id from DB
    const { data: oiRows, error: oiErr } = await supabase
      .from('order_items')
      .select('id, farmer_id, quantity, price_per_unit, products(name)')
      .eq('order_id', order.id);
    if (oiErr) { pushNotice(oiErr.message, 'danger'); return; }

    // Group by farmer — create one request per farmer
    const byFarmer = {};
    (oiRows || []).forEach(oi => {
      if (!oi.farmer_id) return;
      if (!byFarmer[oi.farmer_id]) byFarmer[oi.farmer_id] = [];
      byFarmer[oi.farmer_id].push(oi);
    });

    if (!Object.keys(byFarmer).length) {
      pushNotice('No farmer found for these products. Contact support.', 'warning');
      return;
    }

    const insertRows = Object.entries(byFarmer).map(([farmerId, items]) => ({
      order_item_id:  items[0].id,
      farmer_id:      farmerId,
      buyer_id:       userId,
      product_name:   items.map(i => i.products?.name ?? '?').join(', '),
      qty_kg:         items.reduce((s, i) => s + Number(i.quantity), 0),
      price_per_kg:   items[0].price_per_unit,
      status:         'pending',
      delivery_window: order.eta ?? 'TBD',
      note:           '',
    }));

    const { data: newReqs, error: reqErr } = await supabase
      .from('farmer_requests')
      .insert(insertRows)
      .select();
    if (reqErr) { pushNotice(reqErr.message, 'danger'); return; }

    setRequests(prev => [...prev, ...(newReqs || [])]);
    pushNotice('Request sent to farmer! Waiting for approval before payment.');
  };

  // Check request status for a given order
  const getOrderRequestStatus = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return null;
    // Find requests whose order_item_id matches any item in this order
    const itemIds = (order.rawItemIds || []);
    const orderReqs = requests.filter(r => itemIds.includes(r.order_item_id));
    if (!orderReqs.length) return 'none';
    if (orderReqs.every(r => r.status === 'accepted')) return 'accepted';
    if (orderReqs.some(r => r.status === 'declined')) return 'declined';
    return 'pending';
  };

  const handleAdvanceOrder = async () => {
    const order = orders.find(o => o.id === selectedOrderId);
    if (!order || ['delivered', 'cancelled'].includes(order.status)) return;
    const idx  = STATUS_FLOW.indexOf(order.status);
    const next = STATUS_FLOW[Math.min(idx + 1, STATUS_FLOW.length - 1)];
    const { error } = await supabase.from('orders').update({ status: next }).eq('id', order.id);
    if (error) { pushNotice(error.message, 'danger'); return; }
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: next } : o));
    pushNotice(`Order moved to ${STATUS_LABEL[next] ?? next}.`);
  };

  const handleCancelOrder = async () => {
    const order = orders.find(o => o.id === selectedOrderId);
    if (!order || ['delivered', 'cancelled'].includes(order.status)) { pushNotice('Cannot cancel this order.', 'warning'); return; }
    const { error } = await supabase.from('orders').update({ status: 'cancelled' }).eq('id', order.id);
    if (error) { pushNotice(error.message, 'danger'); return; }
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'cancelled' } : o));
    pushNotice('Order cancelled.', 'danger');
  };

  const handleReorder = async () => {
    const order = orders.find(o => o.id === selectedOrderId);
    if (!order?.items?.length) { pushNotice('Nothing to reorder.', 'warning'); return; }
    for (const item of order.items) await addItem(item, item.quantity);
    pushNotice('Items added to cart!');
  };

  /* ── Favorite actions ─────────────────────────────────────────────────── */
  const handleAddFavorite = async () => {
    if (!farmToAdd) { pushNotice('Choose a farm.', 'warning'); return; }
    if (favorites.some(f => f.farm_id === farmToAdd)) { pushNotice('Already in favorites.', 'warning'); return; }
    const { data, error } = await supabase.from('favorites')
      .insert({ user_id: userId, farm_id: farmToAdd })
      .select('*, farms(id, name, city, accent, products(name))')
      .single();
    if (error) { pushNotice(error.message, 'danger'); return; }
    setFavorites(prev => [data, ...prev]);
    setFarmToAdd('');
    pushNotice('Farm added to favorites!');
  };

  const handleRemoveFavorite = async (favId) => {
    const { error } = await supabase.from('favorites').delete().eq('id', favId);
    if (error) { pushNotice(error.message, 'danger'); return; }
    setFavorites(prev => prev.filter(f => f.id !== favId));
    pushNotice('Removed from favorites.', 'info');
  };

  /* ── Derived ─────────────────────────────────────────────────────────── */
  const filteredOrders = useMemo(() => orders.filter(o => {
    if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.trim().toLowerCase();
      return `${o.id} ${o.farm} ${o.product}`.toLowerCase().includes(q);
    }
    return true;
  }), [orders, orderStatusFilter, orderSearch]);

  const displayedOrders  = showAllOrders ? filteredOrders : filteredOrders.slice(0, 6);
  const selectedOrder    = orders.find(o => o.id === selectedOrderId) ?? displayedOrders[0] ?? null;

  const availableFarms   = allFarms.filter(f => !favorites.some(fav => fav.farm_id === f.id));
  const favCities        = [...new Set(favorites.map(f => f.farms?.city).filter(Boolean))];
  const visibleFavorites = favorites.filter(f => favCityFilter === 'all' || f.farms?.city === favCityFilter);

  const activeOrders     = orders.filter(o => o.status !== 'cancelled').length;
  const pendingOrders    = orders.filter(o => ['preparing', 'in_transit'].includes(o.status)).length;
  const deliveredOrders  = orders.filter(o => o.status === 'delivered').length;
  const totalSpend       = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.totalDh, 0);

  /* ── Render ──────────────────────────────────────────────────────────── */
  return (
    <div className="buyer-dashboard" style={pageStyle}>
      <section className="buyer-hero">
        <div>
          <p className="buyer-hero__kicker">Buyer Dashboard</p>
          <h1>Welcome back, {displayName}!</h1>
          <p>Manage your orders, track deliveries, and keep favourite farms close.</p>
        </div>
        <div className="buyer-hero__actions">
          <span className="buyer-chip">Buyer</span>
          <button type="button" className="dash-btn dash-btn--soft" onClick={() => navigateTo('/marketplace')}>
            Browse Marketplace
          </button>
        </div>
      </section>

      {notice && (
        <div className={`dash-alert ${notice.type === 'danger' ? 'dash-alert--danger' : notice.type === 'warning' ? 'dash-alert--warning' : 'dash-alert--success'}`}>
          <span>{notice.msg}</span>
          <button type="button" className="dash-btn dash-btn--compact" onClick={() => setNotice(null)}>✕</button>
        </div>
      )}

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', opacity: 0.5 }}>Loading your data…</div>
      ) : (
        <>
          {/* Stats */}
          <section className="buyer-stats">
            <article><h3>{activeOrders}</h3><p>Tracked orders</p><span>{pendingOrders} active</span></article>
            <article><h3>{favorites.length}</h3><p>Favourite farms</p><span>{availableFarms.length} more available</span></article>
            <article><h3>{fmtDh(totalSpend)}</h3><p>Total spend</p><span>{deliveredOrders} delivered</span></article>
          </section>

          <section className="buyer-grid">
            {/* ── Orders panel ── */}
            <div className="buyer-panel">
              <div className="buyer-panel__header">
                <h2>Order Workspace</h2>
                <button type="button" onClick={() => setShowAllOrders(v => !v)}>
                  {showAllOrders ? 'Show Recent' : 'View All'}
                </button>
              </div>
              <div className="dash-panel-stack">
                <div className="dash-toolbar buyer-panel__toolbar">
                  <div className="dash-toolbar__group buyer-panel__toolbar-group">
                    <input className="dash-input buyer-panel__search" type="search" value={orderSearch}
                      onChange={e => setOrderSearch(e.target.value)} placeholder="Search order, farm, product" />
                    <select className="dash-select" value={orderStatusFilter} onChange={e => setOrderStatusFilter(e.target.value)}>
                      <option value="all">All statuses</option>
                      <option value="preparing">Preparing</option>
                      <option value="in_transit">In Transit</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <span className="dash-toolbar__meta buyer-panel__toolbar-meta">
                    {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="buyer-table">
                  <div className="buyer-table__head">
                    <span>Order</span><span>Farm</span><span>Status</span><span>Total</span>
                  </div>
                  {displayedOrders.length ? displayedOrders.map(o => (
                    <button key={o.id} type="button"
                      className={`buyer-table__row buyer-table__row--button${selectedOrderId === o.id ? ' is-active' : ''}`}
                      onClick={() => setSelectedOrderId(o.id)}>
                      <span className="buyer-table__id">{o.id.slice(0, 8)}…</span>
                      <span>{o.farm}<small className="buyer-table__sub">{o.product}</small></span>
                      <span className={statusCls(o.status)}>{STATUS_LABEL[o.status] ?? o.status}</span>
                      <span className="buyer-table__total">{fmtDh(o.totalDh)}</span>
                    </button>
                  )) : (
                    <div className="dash-empty">
                      No orders yet.{' '}
                      <button type="button" style={{ textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
                        onClick={() => navigateTo('/marketplace')}>Browse the marketplace →</button>
                    </div>
                  )}
                </div>

                {selectedOrder && (() => {
                  const reqStatus = getOrderRequestStatus(selectedOrder.id);
                  const isFinal   = ['delivered', 'cancelled'].includes(selectedOrder.status);
                  return (
                    <div className="dash-section">
                      <div className="dash-toolbar">
                        <div>
                          <p className="dash-section__title">{selectedOrder.id.slice(0, 8)}… | {selectedOrder.product}</p>
                          <p className="dash-section__subtitle">{selectedOrder.farm} · {selectedOrder.quantity} units · {selectedOrder.payment}</p>
                        </div>
                        <span className={statusCls(selectedOrder.status)}>{STATUS_LABEL[selectedOrder.status] ?? selectedOrder.status}</span>
                      </div>
                      <div className="buyer-order-detail__meta">
                        <span>Placed: {fmtStamp(selectedOrder.createdAt)}</span>
                        <span>ETA: {selectedOrder.eta}</span>
                        <span>Total: {fmtDh(selectedOrder.totalDh)}</span>
                      </div>

                      {/* ── Approval flow ── */}
                      {!isFinal && (
                        <div style={{ margin: '10px 0', padding: '12px 14px', borderRadius: 10, background: 'rgba(127,163,95,0.08)', border: '1px solid rgba(127,163,95,0.25)', fontSize: 13 }}>
                          {reqStatus === 'none' && (
                            <>
                              <p style={{ margin: '0 0 6px', color: '#223223', fontWeight: 600 }}>📋 Step 1 — Request farmer approval</p>
                              <p style={{ margin: '0 0 10px', color: '#6d7a6b' }}>Send this order to the farmer. Payment is only unlocked once they accept.</p>
                              <button type="button" className="dash-btn dash-btn--primary" onClick={handleSendToFarmer}>
                                📨 Send Request to Farmer
                              </button>
                            </>
                          )}
                          {reqStatus === 'pending' && (
                            <>
                              <p style={{ margin: '0 0 4px', color: '#c08050', fontWeight: 600 }}>⏳ Waiting for farmer approval…</p>
                              <p style={{ margin: 0, color: '#6d7a6b' }}>The farmer has received your request and will accept or decline. Check back soon.</p>
                            </>
                          )}
                          {reqStatus === 'accepted' && (
                            <>
                              <p style={{ margin: '0 0 8px', color: '#4f7a46', fontWeight: 600 }}>✅ Farmer accepted! Proceed to payment.</p>
                              <button type="button" className="dash-btn dash-btn--primary" onClick={async () => {
                                if (selectedOrder.items?.length) {
                                  await clearCart();
                                  for (const item of selectedOrder.items) {
                                    if (item.id) await addItem(item, item.quantity);
                                  }
                                }
                                navigateTo('/checkout');
                              }}>
                                💳 Pay Now — {fmtDh(selectedOrder.totalDh)}
                              </button>
                            </>
                          )}
                          {reqStatus === 'declined' && (
                            <p style={{ margin: 0, color: '#c0392b', fontWeight: 600 }}>❌ Farmer declined this request. You can cancel or try reordering.</p>
                          )}
                        </div>
                      )}

                      <div className="dash-form-actions">
                        <button type="button" className="dash-btn" onClick={handleReorder}>Reorder</button>
                        {!isFinal && <button type="button" className="dash-btn dash-btn--danger" onClick={handleCancelOrder}>Cancel Order</button>}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* ── Favourites panel ── */}
            <div className="buyer-panel">
              <div className="buyer-panel__header">
                <h2>Favourite Farms</h2>
                <button type="button" onClick={() => setShowFavManager(v => !v)}>
                  {showFavManager ? 'Done' : 'Manage'}
                </button>
              </div>
              <div className="dash-panel-stack">
                <div className="dash-toolbar buyer-favorites__toolbar">
                  <div className="dash-toolbar__group buyer-favorites__controls">
                    <select className="dash-select" value={favCityFilter} onChange={e => setFavCityFilter(e.target.value)}>
                      <option value="all">All cities</option>
                      {favCities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select className="dash-select" value={farmToAdd} onChange={e => setFarmToAdd(e.target.value)}>
                      <option value="">Add a farm…</option>
                      {availableFarms.map(f => <option key={f.id} value={f.id}>{f.name} ({f.city})</option>)}
                    </select>
                    <button type="button" className="dash-btn dash-btn--success" onClick={handleAddFavorite} disabled={!farmToAdd}>Add</button>
                  </div>
                </div>

                <div className="buyer-favorites">
                  {visibleFavorites.length ? visibleFavorites.map(f => (
                    <div key={f.id} className="buyer-favorites__item buyer-favorites__item--rich">
                      <div className="buyer-favorites__content">
                        <p className="buyer-favorites__name">{f.farms?.name}</p>
                        <p className="buyer-favorites__location">{f.farms?.city}</p>
                        {f.farms?.products?.[0]?.name && (
                          <span className="dash-status dash-status--info">{f.farms.products[0].name}</span>
                        )}
                      </div>
                      <div className="buyer-favorites__actions">
                        <button type="button" className="dash-btn dash-btn--compact" onClick={() => navigateTo(`/farm/${f.farm_id}`)}>Visit</button>
                        {showFavManager && (
                          <button type="button" className="dash-btn dash-btn--compact dash-btn--danger" onClick={() => handleRemoveFavorite(f.id)}>Remove</button>
                        )}
                      </div>
                    </div>
                  )) : <div className="dash-empty">No favourites yet. Use the dropdown above to save a farm.</div>}
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default UserDashboardPage;