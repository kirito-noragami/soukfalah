import { useEffect, useState } from 'react';
import fieldsImage from '../../../assets/images/home-fields.png';
import heroImage from '../../../assets/images/home-hero.png';
import { products } from '../../../data/products';
import { farms } from '../../../data/farms';
import { navigateTo } from '../../../app/navigation';
import { supabase } from '../../../services/supabase';
import '../dashboard-ui.css';
import './UserDashboardPage.css';

let buyerOrderCounter = 2451;
let buyerActivityCounter = 1;

const formatDh = value => `${new Intl.NumberFormat('fr-MA').format(Math.round(value))} DH`;

const formatStamp = iso => new Intl.DateTimeFormat('en-GB', {
  month: 'short',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit'
}).format(new Date(iso));

const createOrderId = () => {
  buyerOrderCounter += 1;
  return `SO-${buyerOrderCounter}`;
};

const createActivityEntry = (text, kind = 'info') => ({
  id: `buyer-activity-${buyerActivityCounter += 1}`,
  text,
  kind,
  createdAt: new Date().toISOString()
});

const parsePriceValue = price => {
  const numeric = Number.parseFloat(String(price).replace(/[^\d.]/g, ''));
  return Number.isFinite(numeric) ? numeric : 0;
};

const initialOrders = [{
  id: 'SO-2451',
  farm: 'Atlas Farm',
  farmLocation: 'Meknes',
  product: 'Organic Tomatoes',
  quantity: 16,
  status: 'In Transit',
  payment: 'Card',
  totalDh: 240,
  createdAt: '2026-02-20T10:00:00Z',
  eta: 'Today 16:00'
}, {
  id: 'SO-2450',
  farm: 'Green Oasis',
  farmLocation: 'Agadir',
  product: 'Sweet Oranges',
  quantity: 24,
  status: 'Delivered',
  payment: 'Cash on Delivery',
  totalDh: 180,
  createdAt: '2026-02-18T14:30:00Z',
  eta: 'Delivered'
}, {
  id: 'SO-2448',
  farm: 'Sahara Harvest',
  farmLocation: 'Errachidia',
  product: 'Fresh Herbs Pack',
  quantity: 12,
  status: 'Preparing',
  payment: 'Card',
  totalDh: 95,
  createdAt: '2026-02-17T08:15:00Z',
  eta: 'Tomorrow'
}];

const initialFavorites = [{
  id: 'fav-atlas',
  name: 'Atlas Farm',
  location: 'Meknes',
  rating: 4.9,
  category: 'Vegetables',
  nextHarvest: 'Tomorrow'
}, {
  id: 'fav-green-oasis',
  name: 'Green Oasis',
  location: 'Agadir',
  rating: 4.7,
  category: 'Fruits',
  nextHarvest: 'In 2 days'
}, {
  id: 'fav-sahara-harvest',
  name: 'Sahara Harvest',
  location: 'Errachidia',
  rating: 4.8,
  category: 'Herbs',
  nextHarvest: 'Today'
}];

const initialActivity = [{
  id: 'buyer-activity-1',
  text: 'Order SO-2451 moved to In Transit',
  kind: 'info',
  createdAt: '2026-02-20T10:45:00Z'
}, {
  id: 'buyer-activity-2',
  text: 'Added Atlas Farm to favorites',
  kind: 'success',
  createdAt: '2026-02-19T17:10:00Z'
}, {
  id: 'buyer-activity-3',
  text: 'Checkout completed for SO-2450',
  kind: 'success',
  createdAt: '2026-02-18T14:40:00Z'
}];

const statusOrder = ['Preparing', 'In Transit', 'Delivered'];

const getStatusClass = status => {
  if (status === 'Delivered') return 'dash-status dash-status--success';
  if (status === 'Cancelled') return 'dash-status dash-status--danger';
  if (status === 'In Transit') return 'dash-status dash-status--info';
  return 'dash-status dash-status--warning';
};

const normalizeFavorite = farm => ({
  id: `fav-${farm.id}`,
  name: farm.name,
  location: farm.location,
  rating: Number((4.4 + Math.random() * 0.5).toFixed(1)),
  category: farm.products[0]?.name || 'Mixed Produce',
  nextHarvest: ['Today', 'Tomorrow', 'In 2 days'][Math.floor(Math.random() * 3)]
});

const UserDashboardPage = () => {
  const pageStyle = {
    '--buyer-hero-image': `url(${heroImage})`,
    '--buyer-fields-image': `url(${fieldsImage})`
  };

  const [orders, setOrders] = useState(initialOrders);
  const [favorites, setFavorites] = useState(initialFavorites);
  const [activity, setActivity] = useState(initialActivity);
  const [notice, setNotice] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(initialOrders[0]?.id || null);
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [showComposer, setShowComposer] = useState(false);
  const [showFavoriteManager, setShowFavoriteManager] = useState(false);
  const [favoriteLocationFilter, setFavoriteLocationFilter] = useState('all');
  const [farmToAdd, setFarmToAdd] = useState('');
  const [draftOrder, setDraftOrder] = useState({
    productId: products[0]?.id || '',
    quantity: '10',
    priority: 'standard',
    note: ''
  });


  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load current Supabase user (if signed in)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('orders-live')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `buyer_id=eq.${user.id}`,
      }, (payload) => {
        const toUiStatus = (dbStatus) => {
          if (!dbStatus) return undefined;
          const s = String(dbStatus).toLowerCase();
          if (s === 'preparing') return 'Preparing';
          if (s === 'in_transit') return 'In Transit';
          if (s === 'delivered') return 'Delivered';
          if (s === 'cancelled' || s === 'canceled') return 'Cancelled';
          return dbStatus;
        };

        setOrders(prev => prev.map(o =>
          o.id === payload.new.id
            ? {
                ...o,
                ...payload.new,
                status: toUiStatus(payload.new.status) ?? o.status,
                totalDh: payload.new.total_dh ?? o.totalDh,
              }
            : o
        ));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const pushNotice = (message, type = 'success') => {
    setNotice({
      id: Date.now(),
      message,
      type
    });
  };

  const pushActivity = (text, kind = 'info') => {
    setActivity(current => [createActivityEntry(text, kind), ...current].slice(0, 8));
  };

  const filteredOrders = orders.filter(order => {
    if (orderStatusFilter !== 'all' && order.status !== orderStatusFilter) {
      return false;
    }
    if (orderSearch.trim()) {
      const q = orderSearch.trim().toLowerCase();
      const haystack = `${order.id} ${order.farm} ${order.product}`.toLowerCase();
      return haystack.includes(q);
    }
    return true;
  });

  const displayedOrders = showAllOrders ? filteredOrders : filteredOrders.slice(0, 5);
  const selectedOrder = orders.find(order => order.id === selectedOrderId) || displayedOrders[0] || orders[0] || null;

  const visibleFavorites = favorites.filter(farm => favoriteLocationFilter === 'all' || farm.location === favoriteLocationFilter);
  const availableFavoriteFarms = farms.filter(farm => !favorites.some(item => item.name === farm.name));

  const activeOrders = orders.filter(order => order.status !== 'Cancelled').length;
  const pendingOrders = orders.filter(order => order.status === 'Preparing' || order.status === 'In Transit').length;
  const deliveredOrders = orders.filter(order => order.status === 'Delivered').length;
  const monthlySpendDh = orders.filter(order => order.status !== 'Cancelled').reduce((sum, order) => sum + order.totalDh, 0);

  const topFarmSpend = favorites.map(favorite => {
    const farmOrders = orders.filter(order => order.farm === favorite.name && order.status !== 'Cancelled');
    const total = farmOrders.reduce((sum, order) => sum + order.totalDh, 0);
    return {
      name: favorite.name,
      total
    };
  }).sort((a, b) => b.total - a.total).slice(0, 3);

  const handleCreateOrder = event => {
    event.preventDefault();
    const selectedProduct = products.find(item => item.id === draftOrder.productId);
    const quantity = Math.max(1, Number.parseInt(draftOrder.quantity, 10) || 0);

    if (!selectedProduct) {
      pushNotice('Select a product before creating an order.', 'warning');
      return;
    }

    const totalDh = parsePriceValue(selectedProduct.price) * quantity;
    const newOrder = {
      id: createOrderId(),
      farm: selectedProduct.farmer.name,
      farmLocation: selectedProduct.farmer.location,
      product: selectedProduct.name,
      quantity,
      status: draftOrder.priority === 'express' ? 'In Transit' : 'Preparing',
      payment: 'Card',
      totalDh: totalDh || 1,
      createdAt: new Date().toISOString(),
      eta: draftOrder.priority === 'express' ? 'Today 20:00' : 'Tomorrow'
    };

    setOrders(current => [newOrder, ...current]);
    setSelectedOrderId(newOrder.id);
    setShowAllOrders(true);
    setShowComposer(false);
    setDraftOrder(current => ({
      ...current,
      quantity: '10',
      note: ''
    }));
    pushActivity(`Created order ${newOrder.id} for ${newOrder.product}`, 'success');
    pushNotice(`Order ${newOrder.id} created successfully.`, 'success');
  };

  const handleAdvanceOrder = () => {
    if (!selectedOrder) return;
    if (selectedOrder.status === 'Delivered' || selectedOrder.status === 'Cancelled') {
      pushNotice('This order cannot be advanced further.', 'warning');
      return;
    }

    const currentIndex = statusOrder.indexOf(selectedOrder.status);
    const nextStatus = statusOrder[Math.min(currentIndex + 1, statusOrder.length - 1)];

    setOrders(current => current.map(order => order.id === selectedOrder.id ? {
      ...order,
      status: nextStatus,
      eta: nextStatus === 'Delivered' ? 'Delivered' : 'Today 18:00'
    } : order));
    pushActivity(`Order ${selectedOrder.id} moved to ${nextStatus}`, 'info');
    pushNotice(`Order ${selectedOrder.id} updated to ${nextStatus}.`, 'success');
  };

  const handleCancelOrder = () => {
    if (!selectedOrder) return;
    if (selectedOrder.status === 'Delivered' || selectedOrder.status === 'Cancelled') {
      pushNotice('Delivered or cancelled orders cannot be cancelled again.', 'warning');
      return;
    }

    setOrders(current => current.map(order => order.id === selectedOrder.id ? {
      ...order,
      status: 'Cancelled',
      eta: 'Cancelled'
    } : order));
    pushActivity(`Order ${selectedOrder.id} was cancelled`, 'danger');
    pushNotice(`Order ${selectedOrder.id} cancelled.`, 'danger');
  };

  const handleReorder = () => {
    if (!selectedOrder) return;
    const clone = {
      ...selectedOrder,
      id: createOrderId(),
      status: 'Preparing',
      eta: 'Tomorrow',
      createdAt: new Date().toISOString()
    };
    setOrders(current => [clone, ...current]);
    setSelectedOrderId(clone.id);
    setShowAllOrders(true);
    pushActivity(`Reordered ${clone.product} as ${clone.id}`, 'success');
    pushNotice(`New order ${clone.id} created from ${selectedOrder.id}.`, 'success');
  };

  const handleAddFavorite = () => {
    const farm = farms.find(item => item.id === farmToAdd);
    if (!farm) {
      pushNotice('Choose a farm to add to favorites.', 'warning');
      return;
    }
    const nextFavorite = normalizeFavorite(farm);
    setFavorites(current => [nextFavorite, ...current]);
    setFarmToAdd('');
    pushActivity(`Added ${farm.name} to favorites`, 'success');
    pushNotice(`${farm.name} added to favorites.`, 'success');
  };

  const handleRemoveFavorite = favoriteId => {
    const target = favorites.find(item => item.id === favoriteId);
    setFavorites(current => current.filter(item => item.id !== favoriteId));
    if (target) {
      pushActivity(`Removed ${target.name} from favorites`, 'info');
      pushNotice(`${target.name} removed from favorites.`, 'info');
    }
  };

  return <div className="buyer-dashboard" style={pageStyle}>
      <section className="buyer-hero">
        <div>
          <p className="buyer-hero__kicker">Buyer Dashboard</p>
          <h1>Welcome back, Samira!</h1>
          <p>
            Manage your orders end-to-end, keep favorite farms close, and create
            new purchases in a few clicks.
          </p>
        </div>
        <div className="buyer-hero__actions">
          <span className="buyer-chip">Buyer</span>
          <button type="button" className="buyer-button" onClick={() => setShowComposer(value => !value)}>
            {showComposer ? 'Close Order Form' : 'New Order'}
          </button>
          <button type="button" className="dash-btn dash-btn--soft" onClick={() => navigateTo('/marketplace')}>
            Browse Marketplace
          </button>
        </div>
      </section>

      {notice ? <div className={`dash-alert ${notice.type === 'danger' ? 'dash-alert--danger' : notice.type === 'warning' ? 'dash-alert--warning' : 'dash-alert--success'}`}>
          <span>{notice.message}</span>
          <button type="button" className="dash-btn dash-btn--compact" onClick={() => setNotice(null)}>
            Dismiss
          </button>
        </div> : null}

      <section className="buyer-stats">
        <article>
          <h3>{activeOrders}</h3>
          <p>Tracked orders</p>
          <span>{pendingOrders} active deliveries</span>
        </article>
        <article>
          <h3>{favorites.length}</h3>
          <p>Favorite farms</p>
          <span>{availableFavoriteFarms.length} more available</span>
        </article>
        <article>
          <h3>{formatDh(monthlySpendDh)}</h3>
          <p>Monthly spend</p>
          <span>{deliveredOrders} delivered orders</span>
        </article>
      </section>

      <section className="buyer-grid">
        <div className="buyer-panel">
          <div className="buyer-panel__header">
            <h2>Order Workspace</h2>
            <button type="button" onClick={() => setShowAllOrders(value => !value)}>
              {showAllOrders ? 'Show Recent' : 'View All'}
            </button>
          </div>

          <div className="dash-panel-stack">
            <div className="dash-toolbar buyer-panel__toolbar">
              <div className="dash-toolbar__group buyer-panel__toolbar-group">
                <input className="dash-input buyer-panel__search" type="search" value={orderSearch} onChange={event => setOrderSearch(event.target.value)} placeholder="Search order, farm, or product" />
                <select className="dash-select" value={orderStatusFilter} onChange={event => setOrderStatusFilter(event.target.value)}>
                  <option value="all">All statuses</option>
                  <option value="Preparing">Preparing</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <span className="dash-toolbar__meta buyer-panel__toolbar-meta">
                {filteredOrders.length} order{filteredOrders.length === 1 ? '' : 's'}
              </span>
            </div>

            <div className="buyer-table">
              <div className="buyer-table__head">
                <span>Order</span>
                <span>Farm</span>
                <span>Status</span>
                <span>Total</span>
              </div>
              {displayedOrders.length ? displayedOrders.map(order => <button className={`buyer-table__row buyer-table__row--button${selectedOrderId === order.id ? ' is-active' : ''}`} type="button" key={order.id} onClick={() => setSelectedOrderId(order.id)}>
                    <span className="buyer-table__id">{order.id}</span>
                    <span>
                      {order.farm}
                      <small className="buyer-table__sub">{order.product}</small>
                    </span>
                    <span className={getStatusClass(order.status)}>{order.status}</span>
                    <span className="buyer-table__total">{formatDh(order.totalDh)}</span>
                  </button>) : <div className="dash-empty">No orders match your filters yet.</div>}
            </div>

            {selectedOrder ? <div className="dash-section">
                <div className="dash-toolbar">
                  <div>
                    <p className="dash-section__title">{selectedOrder.id} | {selectedOrder.product}</p>
                    <p className="dash-section__subtitle">
                      {selectedOrder.farm} ({selectedOrder.farmLocation}) | {selectedOrder.quantity} units | {selectedOrder.payment}
                    </p>
                  </div>
                  <span className={getStatusClass(selectedOrder.status)}>{selectedOrder.status}</span>
                </div>
                <div className="buyer-order-detail__meta">
                  <span>Placed: {formatStamp(selectedOrder.createdAt)}</span>
                  <span>ETA: {selectedOrder.eta}</span>
                  <span>Total: {formatDh(selectedOrder.totalDh)}</span>
                </div>
                <div className="dash-form-actions">
                  <button type="button" className="dash-btn dash-btn--primary" onClick={handleAdvanceOrder}>
                    Advance Status
                  </button>
                  <button type="button" className="dash-btn" onClick={handleReorder}>
                    Reorder
                  </button>
                  <button type="button" className="dash-btn dash-btn--danger" onClick={handleCancelOrder}>
                    Cancel Order
                  </button>
                  <button type="button" className="dash-btn dash-btn--soft" onClick={() => navigateTo('/cart')}>
                    Open Cart
                  </button>
                </div>
              </div> : null}

            {showComposer ? <form className="dash-section" onSubmit={handleCreateOrder}>
                <div>
                  <p className="dash-section__title">Create New Order</p>
                  <p className="dash-section__subtitle">
                    Quick create a buyer order directly from the dashboard.
                  </p>
                </div>
                <div className="dash-field-grid">
                  <label className="dash-label">
                    Product
                    <select className="dash-select" value={draftOrder.productId} onChange={event => setDraftOrder(current => ({
                    ...current,
                    productId: event.target.value
                  }))}>
                      {products.map(product => <option key={product.id} value={product.id}>
                          {product.name} ({product.price}/{product.unit})
                        </option>)}
                    </select>
                  </label>
                  <label className="dash-label">
                    Quantity
                    <input className="dash-input" type="number" min="1" value={draftOrder.quantity} onChange={event => setDraftOrder(current => ({
                    ...current,
                    quantity: event.target.value
                  }))} />
                  </label>
                  <label className="dash-label">
                    Delivery Priority
                    <select className="dash-select" value={draftOrder.priority} onChange={event => setDraftOrder(current => ({
                    ...current,
                    priority: event.target.value
                  }))}>
                      <option value="standard">Standard</option>
                      <option value="express">Express</option>
                    </select>
                  </label>
                  <label className="dash-label">
                    Note (optional)
                    <input className="dash-input" type="text" value={draftOrder.note} placeholder="Packaging / delivery note" onChange={event => setDraftOrder(current => ({
                    ...current,
                    note: event.target.value
                  }))} />
                  </label>
                </div>
                <div className="dash-form-actions">
                  <button type="submit" className="dash-btn dash-btn--primary">
                    Create Order
                  </button>
                  <button type="button" className="dash-btn" onClick={() => setShowComposer(false)}>
                    Close
                  </button>
                </div>
              </form> : null}
          </div>
        </div>

        <div className="buyer-panel">
          <div className="buyer-panel__header">
            <h2>Favorite Farms</h2>
            <button type="button" onClick={() => setShowFavoriteManager(value => !value)}>
              {showFavoriteManager ? 'Done' : 'Manage'}
            </button>
          </div>

          <div className="dash-panel-stack">
            <div className="dash-toolbar buyer-favorites__toolbar">
              <div className="dash-toolbar__group buyer-favorites__controls">
                <select className="dash-select" value={favoriteLocationFilter} onChange={event => setFavoriteLocationFilter(event.target.value)}>
                  <option value="all">All cities</option>
                  {[...new Set(favorites.map(item => item.location))].map(city => <option key={city} value={city}>
                      {city}
                    </option>)}
                </select>
                <select className="dash-select" value={farmToAdd} onChange={event => setFarmToAdd(event.target.value)}>
                  <option value="">Add a farm...</option>
                  {availableFavoriteFarms.map(farm => <option key={farm.id} value={farm.id}>
                      {farm.name} ({farm.location})
                    </option>)}
                </select>
                <button type="button" className="dash-btn dash-btn--success" onClick={handleAddFavorite} disabled={!farmToAdd}>
                  Add
                </button>
              </div>
              <span className="dash-toolbar__meta buyer-favorites__count">
                {visibleFavorites.length} favorite{visibleFavorites.length === 1 ? '' : 's'}
              </span>
            </div>

            <div className="buyer-favorites">
              {visibleFavorites.length ? visibleFavorites.map(farm => <div className="buyer-favorites__item buyer-favorites__item--rich" key={farm.id}>
                    <div className="buyer-favorites__content">
                      <p className="buyer-favorites__name">{farm.name}</p>
                      <p className="buyer-favorites__location">{farm.location}</p>
                      <div className="buyer-favorites__meta">
                        <span className="dash-status dash-status--info">{farm.category}</span>
                        <span className="dash-toolbar__meta">Next harvest: {farm.nextHarvest}</span>
                      </div>
                    </div>
                    <div className="buyer-favorites__actions">
                      <span className="buyer-rating">{farm.rating.toFixed(1)}</span>
                      <button type="button" className="dash-btn dash-btn--compact" onClick={() => navigateTo('/map')}>
                        Open Map
                      </button>
                      {showFavoriteManager ? <button type="button" className="dash-btn dash-btn--compact dash-btn--danger" onClick={() => handleRemoveFavorite(farm.id)}>
                          Remove
                        </button> : null}
                    </div>
                  </div>) : <div className="dash-empty">No favorites in this filter.</div>}
            </div>

            <div className="dash-section">
              <p className="dash-section__title">Spending by favorite farm</p>
              <div className="dash-metric-bars">
                {topFarmSpend.length ? topFarmSpend.map(item => {
                const highest = topFarmSpend[0]?.total || 1;
                const width = Math.max(8, Math.round(item.total / highest * 100));
                return <div className="dash-metric-bars__row" key={item.name}>
                        <div className="dash-metric-bars__head">
                          <span>{item.name}</span>
                          <span>{formatDh(item.total)}</span>
                        </div>
                        <div className="dash-metric-bars__track">
                          <div className="dash-metric-bars__fill" style={{
                        width: `${width}%`
                      }} />
                        </div>
                      </div>;
              }) : <div className="dash-empty">Spend data will appear after your first order.</div>}
              </div>
            </div>

            <div className="dash-section">
              <p className="dash-section__title">Recent Activity</p>
              <div className="dash-log">
                {activity.map(entry => <div className="dash-log__item" key={entry.id}>
                    <p>{entry.text}</p>
                    <div className="dash-log__time">{formatStamp(entry.createdAt)}</div>
                  </div>)}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>;
};

export default UserDashboardPage;


