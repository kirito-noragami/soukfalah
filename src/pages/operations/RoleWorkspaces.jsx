import { useMemo, useState } from 'react';
import { navigateTo } from '../../app/navigation';
import { getRoleLabel, getStoredRole, getStoredUser } from '../../app/session';
import { farms } from '../../data/farms';
import { products } from '../../data/products';
import '../dashboards/dashboard-ui.css';
import './RoleWorkspaces.css';

const makeId = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
const nowLabel = () => new Date().toLocaleTimeString([], {
  hour: '2-digit',
  minute: '2-digit'
});
const dh = (value) => `${Number(value || 0).toLocaleString()} DH`;

const statusClass = (value) => {
  const s = String(value || '').toLowerCase();
  if (['delivered', 'approved', 'paid', 'live', 'resolved', 'done', 'accepted'].includes(s)) {
    return 'dash-status dash-status--success';
  }
  if (['pending', 'processing', 'in transit', 'submitted', 'in review', 'packed', 'shipped', 'open'].includes(s)) {
    return 'dash-status dash-status--warning';
  }
  if (['cancelled', 'rejected', 'refunded', 'needs docs', 'changes requested'].includes(s)) {
    return 'dash-status dash-status--danger';
  }
  return 'dash-status dash-status--info';
};

const logEntry = (message) => ({
  id: makeId('log'),
  message,
  time: nowLabel()
});

const Hero = ({
  kicker,
  title,
  subtitle,
  actions
}) => <section className="role-workspace-hero">
    <div className="role-workspace-hero__inner">
      <div className="role-workspace-hero__top">
        <div className="role-workspace-hero__meta">
          <p className="role-workspace-hero__kicker">{kicker}</p>
          <h1 className="role-workspace-hero__title">{title}</h1>
          <p className="role-workspace-hero__text">{subtitle}</p>
        </div>
        <div className="role-workspace-hero__actions">
          {actions.map(action => <button key={action.label} type="button" className={`dash-btn ${action.variant || ''}`.trim()} onClick={action.onClick}>
              {action.label}
            </button>)}
        </div>
      </div>
    </div>
  </section>;

const Stats = ({
  items
}) => <section className="role-workspace-stats">
    {items.map(item => <article className="role-workspace-stat" key={item.label}>
        <p className="role-workspace-stat__label">{item.label}</p>
        <p className="role-workspace-stat__value">{item.value}</p>
        <p className="role-workspace-stat__note">{item.note}</p>
      </article>)}
  </section>;

const Panel = ({
  id,
  title,
  subtitle,
  actions,
  children
}) => <section className="role-workspace-panel" id={id}>
    <div className="role-workspace-panel__header">
      <div>
        <h2 className="role-workspace-panel__title">{title}</h2>
        {subtitle ? <p className="role-workspace-panel__subtitle">{subtitle}</p> : null}
      </div>
      {actions ? <div className="role-workspace-inline">{actions}</div> : null}
    </div>
    {children}
  </section>;

const ActivityLog = ({
  items,
  title = 'Activity Log'
}) => <Panel title={title} subtitle="Recent actions in this page">
    {items.length ? <div className="dash-log">
        {items.map(item => <div className="dash-log__item" key={item.id}>
            <p>{item.message}</p>
            <div className="dash-log__time">{item.time}</div>
          </div>)}
      </div> : <div className="role-workspace-empty">No activity yet.</div>}
  </Panel>;

const BuyerWorkspacePage = () => {
  const userName = getStoredUser() || 'Buyer';
  const [orders, setOrders] = useState([{
    id: 'SO-8245',
    farm: 'Atlas Farm',
    items: 'Tomatoes + Lettuce',
    total: 240,
    status: 'In Transit',
    eta: 'Tomorrow'
  }, {
    id: 'SO-8240',
    farm: 'Green Oasis',
    items: 'Sweet Oranges',
    total: 180,
    status: 'Delivered',
    eta: 'Delivered'
  }, {
    id: 'SO-8238',
    farm: 'Rif Orchard',
    items: 'Citrus Box',
    total: 310,
    status: 'Processing',
    eta: '2 days'
  }]);
  const [favorites, setFavorites] = useState([{
    id: 'fav-1',
    name: 'Atlas Farm',
    city: 'Meknes'
  }, {
    id: 'fav-2',
    name: 'Rif Orchard',
    city: 'Tangier'
  }]);
  const [favoriteCandidate, setFavoriteCandidate] = useState(farms[0]?.id || '');
  const [addresses, setAddresses] = useState([{
    id: 'addr-1',
    label: 'Home',
    city: 'Meknes',
    line: 'Rue Atlas',
    isDefault: true
  }]);
  const [addressDraft, setAddressDraft] = useState({
    label: '',
    city: '',
    line: ''
  });
  const [tickets, setTickets] = useState([{
    id: 'T-104',
    subject: 'Delivery timing confirmation',
    status: 'Open'
  }]);
  const [ticketSubject, setTicketSubject] = useState('');
  const [activity, setActivity] = useState([logEntry('Buyer workspace opened')]);

  const pushLog = (message) => {
    setActivity((prev) => [logEntry(message), ...prev].slice(0, 8));
  };

  const spendTotal = useMemo(() => orders.reduce((sum, item) => item.status === 'Delivered' ? sum + item.total : sum, 0), [orders]);

  const createDraftOrder = () => {
    const next = {
      id: `SO-${Math.floor(8500 + Math.random() * 500)}`,
      farm: favorites[0]?.name || 'Local Farm',
      items: 'Draft basket',
      total: 120,
      status: 'Pending',
      eta: 'Awaiting checkout'
    };
    setOrders((prev) => [next, ...prev]);
    pushLog(`Created ${next.id}`);
  };

  const updateOrder = (id, status) => {
    setOrders((prev) => prev.map(order => order.id === id ? {
      ...order,
      status,
      eta: status === 'Delivered' ? 'Delivered' : order.eta
    } : order));
    pushLog(`Order ${id} -> ${status}`);
  };

  const reorderOrder = (order) => {
    const next = {
      ...order,
      id: `SO-${Math.floor(9000 + Math.random() * 600)}`,
      status: 'Pending',
      eta: 'Awaiting checkout'
    };
    setOrders((prev) => [next, ...prev]);
    pushLog(`Reordered ${order.id} as ${next.id}`);
  };

  const addFavorite = () => {
    const farm = farms.find(item => item.id === favoriteCandidate);
    if (!farm) {
      return;
    }
    if (favorites.some(item => item.name === farm.name)) {
      pushLog(`${farm.name} already in favorites`);
      return;
    }
    setFavorites((prev) => [...prev, {
      id: makeId('fav'),
      name: farm.name,
      city: farm.location
    }]);
    pushLog(`Added ${farm.name} to favorites`);
  };

  const addAddress = () => {
    if (!addressDraft.label.trim() || !addressDraft.city.trim() || !addressDraft.line.trim()) {
      pushLog('Address form needs label, city, and line');
      return;
    }
    const next = {
      id: makeId('addr'),
      label: addressDraft.label.trim(),
      city: addressDraft.city.trim(),
      line: addressDraft.line.trim(),
      isDefault: addresses.length === 0
    };
    setAddresses((prev) => [...prev, next]);
    setAddressDraft({
      label: '',
      city: '',
      line: ''
    });
    pushLog(`Added address ${next.label}`);
  };

  const setDefaultAddress = (id) => {
    setAddresses((prev) => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
    pushLog('Updated default address');
  };

  const addTicket = () => {
    const subject = ticketSubject.trim();
    if (!subject) {
      pushLog('Ticket subject is required');
      return;
    }
    const next = {
      id: `T-${Math.floor(120 + Math.random() * 900)}`,
      subject,
      status: 'Open'
    };
    setTickets((prev) => [next, ...prev]);
    setTicketSubject('');
    pushLog(`Opened ticket ${next.id}`);
  };

  const toggleTicket = (id) => {
    setTickets((prev) => prev.map(ticket => ticket.id === id ? {
      ...ticket,
      status: ticket.status === 'Open' ? 'Resolved' : 'Open'
    } : ticket));
    pushLog(`Updated ticket ${id}`);
  };

  return <div className="role-workspace-page">
      <Hero kicker={`${getRoleLabel(getStoredRole())} Workspace`} title={<>Buyer operations for <span>{userName}</span></>} subtitle="Follow orders, manage favorite farms and delivery addresses, and contact support. This page is the operational center for buyers." actions={[{
      label: 'Marketplace',
      variant: 'dash-btn--soft',
      onClick: () => navigateTo('/marketplace')
    }, {
      label: 'Cart',
      variant: 'dash-btn--soft',
      onClick: () => navigateTo('/cart')
    }, {
      label: 'New Draft Order',
      variant: 'dash-btn--primary',
      onClick: createDraftOrder
    }]} />
      <Stats items={[{
      label: 'Tracked orders',
      value: String(orders.length),
      note: `${orders.filter(item => ['Pending', 'Processing', 'In Transit'].includes(item.status)).length} active`
    }, {
      label: 'Favorite farms',
      value: String(favorites.length),
      note: 'Quick re-order sources'
    }, {
      label: 'Delivered spend',
      value: dh(spendTotal),
      note: 'Completed orders total'
    }, {
      label: 'Support tickets',
      value: String(tickets.length),
      note: `${tickets.filter(item => item.status === 'Open').length} open`
    }]} />
      <div className="role-workspace-body">
        <div className="role-workspace-stack">
          <Panel id="orders" title="Orders" subtitle="Reorder, cancel, or mark orders as delivered">
            <div className="dash-list">
              {orders.map(order => <div className="dash-list__item" key={order.id}>
                  <div>
                    <p className="dash-list__title">{order.id} | {order.farm}</p>
                    <p className="dash-list__subtitle">{order.items} | {dh(order.total)} | ETA: {order.eta}</p>
                  </div>
                  <div className="dash-list__meta">
                    <span className={statusClass(order.status)}>{order.status}</span>
                  </div>
                  <div className="dash-list__actions">
                    <button className="dash-btn dash-btn--compact" type="button" onClick={() => reorderOrder(order)}>Reorder</button>
                    <button className="dash-btn dash-btn--compact" type="button" disabled={order.status === 'Delivered'} onClick={() => updateOrder(order.id, 'Delivered')}>Received</button>
                    <button className="dash-btn dash-btn--compact dash-btn--danger" type="button" disabled={order.status === 'Delivered'} onClick={() => updateOrder(order.id, 'Cancelled')}>Cancel</button>
                  </div>
                </div>)}
            </div>
          </Panel>

          <Panel id="favorites" title="Favorite Farms" subtitle="Save nearby farms and return quickly">
            <div className="dash-toolbar">
              <div className="dash-toolbar__group">
                <select className="dash-select" value={favoriteCandidate} onChange={event => setFavoriteCandidate(event.target.value)}>
                  {farms.map(farm => <option key={farm.id} value={farm.id}>
                      {farm.name} ({farm.location})
                    </option>)}
                </select>
                <button className="dash-btn dash-btn--primary" type="button" onClick={addFavorite}>Add Favorite</button>
              </div>
            </div>
            <div className="dash-list" style={{
            marginTop: '12px'
          }}>
              {favorites.map(farm => <div className="dash-list__item" key={farm.id}>
                  <div>
                    <p className="dash-list__title">{farm.name}</p>
                    <p className="dash-list__subtitle">{farm.city}</p>
                  </div>
                  <div className="dash-list__actions">
                    <button className="dash-btn dash-btn--compact" type="button" onClick={() => navigateTo('/marketplace')}>Browse</button>
                    <button className="dash-btn dash-btn--compact dash-btn--danger" type="button" onClick={() => {
                  setFavorites(prev => prev.filter(item => item.id !== farm.id));
                  pushLog(`Removed ${farm.name} from favorites`);
                }}>Remove</button>
                  </div>
                </div>)}
            </div>
          </Panel>
        </div>
        <div className="role-workspace-stack">
          <Panel id="addresses" title="Addresses" subtitle="Maintain delivery destinations">
            <div className="dash-field-grid dash-field-grid--1">
              <input className="dash-input" value={addressDraft.label} onChange={event => setAddressDraft(prev => ({
              ...prev,
              label: event.target.value
            }))} placeholder="Label (Home / Office)" />
              <input className="dash-input" value={addressDraft.city} onChange={event => setAddressDraft(prev => ({
              ...prev,
              city: event.target.value
            }))} placeholder="City" />
              <input className="dash-input" value={addressDraft.line} onChange={event => setAddressDraft(prev => ({
              ...prev,
              line: event.target.value
            }))} placeholder="Street / district" />
            </div>
            <div className="dash-form-actions">
              <button className="dash-btn dash-btn--primary" type="button" onClick={addAddress}>Add Address</button>
            </div>
            <div className="dash-list" style={{
            marginTop: '12px'
          }}>
              {addresses.map(address => <div className="dash-list__item" key={address.id}>
                  <div>
                    <p className="dash-list__title">{address.label} {address.isDefault ? <span className="role-workspace-chip">Default</span> : null}</p>
                    <p className="dash-list__subtitle">{address.city} | {address.line}</p>
                  </div>
                  <div className="dash-list__actions">
                    <button className="dash-btn dash-btn--compact" type="button" onClick={() => setDefaultAddress(address.id)}>Set Default</button>
                  </div>
                </div>)}
            </div>
          </Panel>

          <Panel id="support" title="Support" subtitle="Open and manage support tickets">
            <div className="dash-toolbar">
              <div className="dash-toolbar__group">
                <input className="dash-input" value={ticketSubject} onChange={event => setTicketSubject(event.target.value)} placeholder="Ticket subject..." />
                <button className="dash-btn dash-btn--primary" type="button" onClick={addTicket}>Open Ticket</button>
              </div>
            </div>
            <div className="dash-list" style={{
            marginTop: '12px'
          }}>
              {tickets.map(ticket => <div className="dash-list__item" key={ticket.id}>
                  <div>
                    <p className="dash-list__title">{ticket.id}</p>
                    <p className="dash-list__subtitle">{ticket.subject}</p>
                  </div>
                  <div className="dash-list__meta">
                    <span className={statusClass(ticket.status)}>{ticket.status}</span>
                  </div>
                  <div className="dash-list__actions">
                    <button className="dash-btn dash-btn--compact" type="button" onClick={() => toggleTicket(ticket.id)}>
                      {ticket.status === 'Open' ? 'Resolve' : 'Reopen'}
                    </button>
                  </div>
                </div>)}
            </div>
          </Panel>
          <ActivityLog items={activity} />
        </div>
      </div>
    </div>;
};

const FarmerStudioPage = () => {
  const [listingDraft, setListingDraft] = useState({
    name: '',
    category: 'Vegetables',
    price: '12',
    unit: 'kg',
    stock: '80'
  });
  const [listings, setListings] = useState(() => products.slice(0, 5).map((product, index) => ({
    id: `L-${310 + index}`,
    name: product.name,
    category: product.category,
    price: Number(String(product.price).replace(/[^\d.]/g, '')) || 10,
    unit: product.unit || 'kg',
    stock: product.available || 60,
    status: index % 3 === 0 ? 'Paused' : 'Live'
  })));
  const [orders, setOrders] = useState([{
    id: 'FO-221',
    buyer: 'Samira A.',
    items: 'Tomatoes x12kg',
    total: 180,
    status: 'Pending'
  }, {
    id: 'FO-220',
    buyer: 'Hassan M.',
    items: 'Oranges x20kg',
    total: 140,
    status: 'Accepted'
  }, {
    id: 'FO-218',
    buyer: 'Rania B.',
    items: 'Peppers x8kg',
    total: 144,
    status: 'Packed'
  }]);
  const [payouts, setPayouts] = useState([{
    id: 'PO-70',
    period: 'Feb 1 - Feb 7',
    amount: 1240,
    status: 'Paid'
  }, {
    id: 'PO-71',
    period: 'Feb 8 - Feb 14',
    amount: 980,
    status: 'Pending'
  }]);
  const [harvestTasks, setHarvestTasks] = useState([{
    id: 'HT-1',
    title: 'Tomato greenhouse harvest',
    date: '2026-02-24',
    status: 'Planned'
  }]);
  const [harvestDraft, setHarvestDraft] = useState({
    title: '',
    date: ''
  });
  const [activity, setActivity] = useState([logEntry('Farmer studio opened')]);

  const pushLog = (message) => {
    setActivity((prev) => [logEntry(message), ...prev].slice(0, 8));
  };

  const addListing = () => {
    if (!listingDraft.name.trim()) {
      pushLog('Listing name is required');
      return;
    }
    const next = {
      id: `L-${Math.floor(400 + Math.random() * 500)}`,
      name: listingDraft.name.trim(),
      category: listingDraft.category,
      price: Number(listingDraft.price) || 0,
      unit: listingDraft.unit.trim() || 'kg',
      stock: Number(listingDraft.stock) || 0,
      status: 'Live'
    };
    setListings((prev) => [next, ...prev]);
    setListingDraft(prev => ({
      ...prev,
      name: '',
      stock: '80'
    }));
    pushLog(`Added listing ${next.name}`);
  };

  const updateListing = (id, updater, message) => {
    setListings((prev) => prev.map(item => item.id === id ? updater(item) : item));
    pushLog(message);
  };

  const advanceOrder = (id) => {
    const map = {
      Pending: 'Accepted',
      Accepted: 'Packed',
      Packed: 'Shipped',
      Shipped: 'Delivered'
    };
    let nextStatus = null;
    setOrders((prev) => prev.map(order => {
      if (order.id !== id) {
        return order;
      }
      nextStatus = map[order.status] || order.status;
      return {
        ...order,
        status: nextStatus
      };
    }));
    if (nextStatus) {
      pushLog(`${id} -> ${nextStatus}`);
    }
  };

  const rejectOrder = (id) => {
    setOrders((prev) => prev.map(order => order.id === id ? {
      ...order,
      status: 'Rejected'
    } : order));
    pushLog(`Rejected order ${id}`);
  };

  const requestPayout = () => {
    const next = {
      id: `PO-${Math.floor(72 + Math.random() * 50)}`,
      period: 'On-demand request',
      amount: 350 + Math.floor(Math.random() * 400),
      status: 'Pending'
    };
    setPayouts((prev) => [next, ...prev]);
    pushLog(`Requested payout ${next.id}`);
  };

  const addHarvestTask = () => {
    if (!harvestDraft.title.trim() || !harvestDraft.date) {
      pushLog('Harvest task needs title and date');
      return;
    }
    const next = {
      id: makeId('HT'),
      title: harvestDraft.title.trim(),
      date: harvestDraft.date,
      status: 'Planned'
    };
    setHarvestTasks((prev) => [next, ...prev]);
    setHarvestDraft({
      title: '',
      date: ''
    });
    pushLog(`Added harvest task "${next.title}"`);
  };

  return <div className="role-workspace-page">
      <Hero kicker="Farmer Studio" title={<>Manage products, stock, and <span>farmer operations</span></>} subtitle="This page answers the key farmer need: add products, manage listings, process orders, request payouts, and plan harvest tasks." actions={[{
      label: 'Farmer Dashboard',
      variant: 'dash-btn--soft',
      onClick: () => navigateTo('/dashboard/farmer')
    }, {
      label: 'Marketplace',
      variant: 'dash-btn--soft',
      onClick: () => navigateTo('/marketplace')
    }, {
      label: 'Request Payout',
      variant: 'dash-btn--primary',
      onClick: requestPayout
    }]} />
      <Stats items={[{
      label: 'Listings',
      value: String(listings.length),
      note: `${listings.filter(item => item.status === 'Live').length} live`
    }, {
      label: 'Low stock',
      value: String(listings.filter(item => item.stock <= 25).length),
      note: 'Needs restock'
    }, {
      label: 'Open orders',
      value: String(orders.filter(item => !['Delivered', 'Rejected'].includes(item.status)).length),
      note: 'Fulfillment queue'
    }, {
      label: 'Pending payouts',
      value: dh(payouts.filter(item => item.status !== 'Paid').reduce((sum, item) => sum + item.amount, 0)),
      note: 'Awaiting transfer'
    }]} />

      <div className="role-workspace-body">
        <div className="role-workspace-stack">
          <Panel id="catalog" title="Product Catalog" subtitle="Add new products and maintain listing availability">
            <div className="dash-field-grid dash-field-grid--3">
              <input className="dash-input" value={listingDraft.name} onChange={event => setListingDraft(prev => ({
              ...prev,
              name: event.target.value
            }))} placeholder="Product name" />
              <select className="dash-select" value={listingDraft.category} onChange={event => setListingDraft(prev => ({
              ...prev,
              category: event.target.value
            }))}>
                <option>Vegetables</option>
                <option>Fruits</option>
                <option>Others</option>
              </select>
              <input className="dash-input" type="number" min="0" value={listingDraft.price} onChange={event => setListingDraft(prev => ({
              ...prev,
              price: event.target.value
            }))} placeholder="Price DH" />
              <input className="dash-input" value={listingDraft.unit} onChange={event => setListingDraft(prev => ({
              ...prev,
              unit: event.target.value
            }))} placeholder="kg / bunch" />
              <input className="dash-input" type="number" min="0" value={listingDraft.stock} onChange={event => setListingDraft(prev => ({
              ...prev,
              stock: event.target.value
            }))} placeholder="Stock" />
              <button className="dash-btn dash-btn--primary" type="button" onClick={addListing}>Add Listing</button>
            </div>
            <div className="dash-list" style={{
            marginTop: '12px'
          }}>
              {listings.map(listing => <div className="dash-list__item" key={listing.id}>
                  <div>
                    <p className="dash-list__title">{listing.name}</p>
                    <p className="dash-list__subtitle">{listing.category} | {dh(listing.price)}/{listing.unit} | Stock: {listing.stock}</p>
                  </div>
                  <div className="dash-list__meta">
                    <span className={statusClass(listing.status)}>{listing.status}</span>
                  </div>
                  <div className="dash-list__actions">
                    <button className="dash-btn dash-btn--compact" type="button" onClick={() => updateListing(listing.id, item => ({
                    ...item,
                    stock: item.stock + 25
                  }), `Restocked ${listing.name}`)}>Restock +25</button>
                    <button className="dash-btn dash-btn--compact" type="button" onClick={() => updateListing(listing.id, item => ({
                    ...item,
                    price: Math.max(1, item.price + 1)
                  }), `Price increased for ${listing.name}`)}>+1 DH</button>
                    <button className="dash-btn dash-btn--compact dash-btn--soft" type="button" onClick={() => updateListing(listing.id, item => ({
                    ...item,
                    status: item.status === 'Live' ? 'Paused' : 'Live'
                  }), `${listing.name} ${listing.status === 'Live' ? 'paused' : 'resumed'}`)}>
                      {listing.status === 'Live' ? 'Pause' : 'Resume'}
                    </button>
                  </div>
                </div>)}
            </div>
          </Panel>

          <Panel id="orders" title="Farmer Orders" subtitle="Accept, prepare, ship, and complete incoming orders">
            <div className="dash-list">
              {orders.map(order => <div className="dash-list__item" key={order.id}>
                  <div>
                    <p className="dash-list__title">{order.id} | {order.buyer}</p>
                    <p className="dash-list__subtitle">{order.items} | {dh(order.total)}</p>
                  </div>
                  <div className="dash-list__meta">
                    <span className={statusClass(order.status)}>{order.status}</span>
                  </div>
                  <div className="dash-list__actions">
                    <button className="dash-btn dash-btn--compact" type="button" disabled={['Delivered', 'Rejected'].includes(order.status)} onClick={() => advanceOrder(order.id)}>Advance</button>
                    <button className="dash-btn dash-btn--compact dash-btn--danger" type="button" disabled={['Delivered', 'Rejected'].includes(order.status)} onClick={() => rejectOrder(order.id)}>Reject</button>
                  </div>
                </div>)}
            </div>
          </Panel>
        </div>

        <div className="role-workspace-stack">
          <Panel id="payouts" title="Payout Center" subtitle="Track payout requests and settlement status">
            <div className="dash-form-actions">
              <button className="dash-btn dash-btn--primary" type="button" onClick={requestPayout}>Create Payout Request</button>
            </div>
            <div className="dash-list" style={{
            marginTop: '12px'
          }}>
              {payouts.map(payout => <div className="dash-list__item" key={payout.id}>
                  <div>
                    <p className="dash-list__title">{payout.id}</p>
                    <p className="dash-list__subtitle">{payout.period}</p>
                  </div>
                  <div className="dash-list__meta">
                    <span className="role-workspace-chip">{dh(payout.amount)}</span>
                    <span className={statusClass(payout.status)}>{payout.status}</span>
                  </div>
                  <div className="dash-list__actions">
                    <button className="dash-btn dash-btn--compact" type="button" disabled={payout.status === 'Paid'} onClick={() => {
                  setPayouts(prev => prev.map(item => item.id === payout.id ? {
                    ...item,
                    status: 'Paid'
                  } : item));
                  pushLog(`Marked payout ${payout.id} as paid`);
                }}>Mark Paid</button>
                  </div>
                </div>)}
            </div>
          </Panel>

          <Panel id="calendar" title="Harvest Calendar" subtitle="Plan harvest and packing tasks">
            <div className="dash-toolbar">
              <div className="dash-toolbar__group">
                <input className="dash-input" value={harvestDraft.title} onChange={event => setHarvestDraft(prev => ({
                ...prev,
                title: event.target.value
              }))} placeholder="Task title" />
                <input className="dash-input" type="date" value={harvestDraft.date} onChange={event => setHarvestDraft(prev => ({
                ...prev,
                date: event.target.value
              }))} />
                <button className="dash-btn dash-btn--primary" type="button" onClick={addHarvestTask}>Add Task</button>
              </div>
            </div>
            <div className="dash-list" style={{
            marginTop: '12px'
          }}>
              {harvestTasks.map(task => <div className="dash-list__item" key={task.id}>
                  <div>
                    <p className="dash-list__title">{task.title}</p>
                    <p className="dash-list__subtitle">{task.date}</p>
                  </div>
                  <div className="dash-list__meta">
                    <span className={statusClass(task.status)}>{task.status}</span>
                  </div>
                  <div className="dash-list__actions">
                    <button className="dash-btn dash-btn--compact" type="button" onClick={() => {
                  setHarvestTasks(prev => prev.map(item => item.id === task.id ? {
                    ...item,
                    status: item.status === 'Done' ? 'Planned' : 'Done'
                  } : item));
                  pushLog(`Updated harvest task ${task.id}`);
                }}>
                      {task.status === 'Done' ? 'Reopen' : 'Mark Done'}
                    </button>
                  </div>
                </div>)}
            </div>
          </Panel>
          <ActivityLog items={activity} />
        </div>
      </div>
    </div>;
};

const AdminOperationsPage = () => {
  const [moderationQueue, setModerationQueue] = useState(() => products.slice(0, 6).map((product, index) => ({
    id: `MQ-${index + 1}`,
    name: product.name,
    farmer: product.farmer.name,
    status: 'Pending',
    note: index % 2 ? 'Check pricing consistency' : 'Freshness proof needed'
  })));
  const [applications, setApplications] = useState([{
    id: 'APP-12',
    farmName: 'Souss Green House',
    owner: 'Amina Idrissi',
    status: 'In Review'
  }, {
    id: 'APP-13',
    farmName: 'Rif Citrus Hub',
    owner: 'Karim B.',
    status: 'Needs Docs'
  }]);
  const [disputes, setDisputes] = useState([{
    id: 'DSP-41',
    orderId: 'SO-8238',
    issue: 'Late delivery claim',
    amount: 90,
    status: 'Open'
  }, {
    id: 'DSP-42',
    orderId: 'FO-218',
    issue: 'Damaged packaging',
    amount: 65,
    status: 'Investigating'
  }]);
  const [settings, setSettings] = useState({
    commissionRate: '8.5',
    payoutDay: 'Tuesday',
    escrowEnabled: true,
    autoRiskHold: true
  });
  const [activity, setActivity] = useState([logEntry('Admin operations opened')]);

  const pushLog = (message) => setActivity(prev => [logEntry(message), ...prev].slice(0, 10));

  const updateModeration = (id, status) => {
    setModerationQueue(prev => prev.map(item => item.id === id ? {
      ...item,
      status
    } : item));
    pushLog(`Moderation ${id} -> ${status}`);
  };

  const updateApplication = (id, status) => {
    setApplications(prev => prev.map(item => item.id === id ? {
      ...item,
      status
    } : item));
    pushLog(`Application ${id} -> ${status}`);
  };

  const updateDispute = (id, status) => {
    setDisputes(prev => prev.map(item => item.id === id ? {
      ...item,
      status
    } : item));
    pushLog(`Dispute ${id} -> ${status}`);
  };

  return <div className="role-workspace-page">
      <Hero kicker="Admin Operations" title={<>Moderation, approvals, and <span>platform controls</span></>} subtitle="This page complements the admin dashboard with operational flows: review products, approve seller applications, resolve disputes, and manage finance/risk settings." actions={[{
      label: 'Admin Dashboard',
      variant: 'dash-btn--soft',
      onClick: () => navigateTo('/dashboard/admin')
    }, {
      label: 'Marketplace',
      variant: 'dash-btn--soft',
      onClick: () => navigateTo('/marketplace')
    }, {
      label: 'Save Finance Settings',
      variant: 'dash-btn--primary',
      onClick: () => pushLog('Finance/risk settings saved')
    }]} />
      <Stats items={[{
      label: 'Pending moderation',
      value: String(moderationQueue.filter(item => item.status === 'Pending').length),
      note: `${moderationQueue.length} queued`
    }, {
      label: 'Seller applications',
      value: String(applications.length),
      note: `${applications.filter(item => ['In Review', 'Needs Docs'].includes(item.status)).length} active review`
    }, {
      label: 'Open disputes',
      value: String(disputes.filter(item => ['Open', 'Investigating'].includes(item.status)).length),
      note: `Exposure ${dh(disputes.filter(item => item.status !== 'Resolved').reduce((sum, item) => sum + item.amount, 0))}`
    }, {
      label: 'Commission',
      value: `${settings.commissionRate}%`,
      note: `Payout day ${settings.payoutDay}`
    }]} />

      <div className="role-workspace-body">
        <div className="role-workspace-stack">
          <Panel id="moderation" title="Product Moderation Queue" subtitle="Approve, reject, or request changes on product submissions">
            <div className="dash-list">
              {moderationQueue.map(item => <div className="dash-list__item" key={item.id}>
                  <div>
                    <p className="dash-list__title">{item.name}</p>
                    <p className="dash-list__subtitle">{item.farmer} | {item.note}</p>
                  </div>
                  <div className="dash-list__meta">
                    <span className={statusClass(item.status)}>{item.status}</span>
                  </div>
                  <div className="dash-list__actions">
                    <button className="dash-btn dash-btn--compact dash-btn--success" type="button" onClick={() => updateModeration(item.id, 'Approved')}>Approve</button>
                    <button className="dash-btn dash-btn--compact" type="button" onClick={() => updateModeration(item.id, 'Changes Requested')}>Changes</button>
                    <button className="dash-btn dash-btn--compact dash-btn--danger" type="button" onClick={() => updateModeration(item.id, 'Rejected')}>Reject</button>
                  </div>
                </div>)}
            </div>
          </Panel>

          <Panel id="applications" title="Seller Applications" subtitle="Approve new farmer sellers or request missing documents">
            <div className="dash-list">
              {applications.map(app => <div className="dash-list__item" key={app.id}>
                  <div>
                    <p className="dash-list__title">{app.farmName}</p>
                    <p className="dash-list__subtitle">{app.owner} | {app.id}</p>
                  </div>
                  <div className="dash-list__meta">
                    <span className={statusClass(app.status)}>{app.status}</span>
                  </div>
                  <div className="dash-list__actions">
                    <button className="dash-btn dash-btn--compact dash-btn--success" type="button" onClick={() => updateApplication(app.id, 'Approved')}>Approve</button>
                    <button className="dash-btn dash-btn--compact" type="button" onClick={() => updateApplication(app.id, 'Needs Docs')}>Need Docs</button>
                    <button className="dash-btn dash-btn--compact dash-btn--danger" type="button" onClick={() => updateApplication(app.id, 'Rejected')}>Reject</button>
                  </div>
                </div>)}
            </div>
          </Panel>
        </div>

        <div className="role-workspace-stack">
          <Panel id="disputes" title="Disputes Desk" subtitle="Resolve conflicts and issue refunds when needed">
            <div className="dash-list">
              {disputes.map(item => <div className="dash-list__item" key={item.id}>
                  <div>
                    <p className="dash-list__title">{item.id} | {item.orderId}</p>
                    <p className="dash-list__subtitle">{item.issue}</p>
                  </div>
                  <div className="dash-list__meta">
                    <span className="role-workspace-chip">{dh(item.amount)}</span>
                    <span className={statusClass(item.status)}>{item.status}</span>
                  </div>
                  <div className="dash-list__actions">
                    <button className="dash-btn dash-btn--compact" type="button" onClick={() => updateDispute(item.id, 'Investigating')}>Investigate</button>
                    <button className="dash-btn dash-btn--compact dash-btn--success" type="button" onClick={() => updateDispute(item.id, 'Resolved')}>Resolve</button>
                    <button className="dash-btn dash-btn--compact dash-btn--danger" type="button" onClick={() => updateDispute(item.id, 'Refunded')}>Refund</button>
                  </div>
                </div>)}
            </div>
          </Panel>

          <Panel id="finance" title="Finance & Risk Settings" subtitle="Platform-level payout and risk configuration">
            <div className="dash-field-grid dash-field-grid--1">
              <label className="dash-label">
                Commission rate (%)
                <input className="dash-input" type="number" min="0" step="0.1" value={settings.commissionRate} onChange={event => setSettings(prev => ({
                ...prev,
                commissionRate: event.target.value
              }))} />
              </label>
              <label className="dash-label">
                Payout day
                <select className="dash-select" value={settings.payoutDay} onChange={event => setSettings(prev => ({
                ...prev,
                payoutDay: event.target.value
              }))}>
                  <option>Monday</option>
                  <option>Tuesday</option>
                  <option>Wednesday</option>
                  <option>Thursday</option>
                  <option>Friday</option>
                </select>
              </label>
            </div>
            <div className="dash-panel-stack">
              <div className="dash-switch">
                <div className="dash-switch__meta">
                  <strong>Escrow mode</strong>
                  <span>Hold funds until delivery milestones</span>
                </div>
                <button className={`dash-btn dash-btn--compact ${settings.escrowEnabled ? 'dash-btn--success' : ''}`.trim()} type="button" onClick={() => setSettings(prev => ({
                ...prev,
                escrowEnabled: !prev.escrowEnabled
              }))}>{settings.escrowEnabled ? 'On' : 'Off'}</button>
              </div>
              <div className="dash-switch">
                <div className="dash-switch__meta">
                  <strong>Auto risk hold</strong>
                  <span>Pause suspicious payout requests automatically</span>
                </div>
                <button className={`dash-btn dash-btn--compact ${settings.autoRiskHold ? 'dash-btn--success' : ''}`.trim()} type="button" onClick={() => setSettings(prev => ({
                ...prev,
                autoRiskHold: !prev.autoRiskHold
              }))}>{settings.autoRiskHold ? 'On' : 'Off'}</button>
              </div>
            </div>
            <div className="dash-form-actions">
              <button className="dash-btn dash-btn--primary" type="button" onClick={() => pushLog('Finance/risk settings saved')}>Save Settings</button>
            </div>
          </Panel>
          <ActivityLog title="Audit Trail" items={activity} />
        </div>
      </div>
    </div>;
};

const SellerOnboardingPage = () => {
  const role = getStoredRole();
  const user = getStoredUser();
  const [checklist, setChecklist] = useState([{
    id: 'identity',
    title: 'Identity documents ready',
    subtitle: 'CIN and farmer ID prepared',
    done: false
  }, {
    id: 'farm-proof',
    title: 'Farm location proof',
    subtitle: 'Ownership or lease document available',
    done: false
  }, {
    id: 'product-plan',
    title: 'Initial catalog plan',
    subtitle: 'At least 3 products with pricing',
    done: false
  }]);
  const [form, setForm] = useState({
    farmName: '',
    city: '',
    products: '',
    note: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [activity, setActivity] = useState([logEntry('Seller onboarding opened')]);

  const pushLog = (message) => setActivity(prev => [logEntry(message), ...prev].slice(0, 8));

  const toggleChecklist = (id) => {
    setChecklist(prev => prev.map(item => item.id === id ? {
      ...item,
      done: !item.done
    } : item));
    pushLog(`Checklist updated (${id})`);
  };

  const submitApplication = () => {
    if (!form.farmName.trim() || !form.city.trim() || !form.products.trim()) {
      pushLog('Farm name, city, and products are required');
      return;
    }
    setSubmitted(true);
    pushLog(`Submitted seller application for ${form.farmName.trim()}`);
  };

  return <div className="role-workspace-page">
      <Hero kicker="Seller Onboarding" title={<>Become a verified farmer seller with a <span>guided flow</span></>} subtitle="This page explains and simulates how farmers join the platform: prepare documents, complete the checklist, and submit an application for admin review." actions={role === 'farmer' ? [{
      label: 'Farmer Studio',
      variant: 'dash-btn--primary',
      onClick: () => navigateTo('/dashboard/farmer/studio')
    }, {
      label: 'Farmer Dashboard',
      variant: 'dash-btn--soft',
      onClick: () => navigateTo('/dashboard/farmer')
    }] : [{
      label: 'Register as Farmer',
      variant: 'dash-btn--primary',
      onClick: () => navigateTo('/register?role=farmer')
    }, {
      label: role ? 'Buyer Workspace' : 'Login',
      variant: 'dash-btn--soft',
      onClick: () => navigateTo(role ? '/dashboard/buyer/workspace' : '/login')
    }]} />
      <Stats items={[{
      label: 'Checklist progress',
      value: `${checklist.filter(item => item.done).length}/${checklist.length}`,
      note: 'Preparation steps completed'
    }, {
      label: 'Current role',
      value: getRoleLabel(role),
      note: user ? `Signed in as ${user}` : 'Guest visitor'
    }, {
      label: 'Application status',
      value: submitted ? 'Submitted' : 'Draft',
      note: submitted ? 'Awaiting admin review' : 'Ready to submit'
    }, {
      label: 'Next page',
      value: role === 'farmer' ? 'Studio' : 'Register',
      note: 'Continue the farmer onboarding flow'
    }]} />

      <div className="role-workspace-body">
        <div className="role-workspace-stack">
          <Panel title="Farmer Seller Checklist" subtitle="Complete these before publishing products">
            <div className="role-workspace-checklist">
              {checklist.map(item => <div className="role-workspace-checklist__item" key={item.id}>
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.subtitle}</span>
                  </div>
                  <button className={`dash-btn dash-btn--compact ${item.done ? 'dash-btn--success' : ''}`.trim()} type="button" onClick={() => toggleChecklist(item.id)}>
                    {item.done ? 'Done' : 'Mark Done'}
                  </button>
                </div>)}
            </div>
          </Panel>

          <Panel title="Seller Application Form" subtitle="Demo frontend form for farmer onboarding">
            <div className="dash-field-grid dash-field-grid--1">
              <input className="dash-input" value={form.farmName} onChange={event => setForm(prev => ({
              ...prev,
              farmName: event.target.value
            }))} placeholder="Farm name" />
              <input className="dash-input" value={form.city} onChange={event => setForm(prev => ({
              ...prev,
              city: event.target.value
            }))} placeholder="City" />
              <input className="dash-input" value={form.products} onChange={event => setForm(prev => ({
              ...prev,
              products: event.target.value
            }))} placeholder="Main products (e.g. tomatoes, lettuce, peppers)" />
              <textarea className="dash-textarea" value={form.note} onChange={event => setForm(prev => ({
              ...prev,
              note: event.target.value
            }))} placeholder="Notes, certifications, cold storage, harvest cadence..." />
            </div>
            <div className="dash-form-actions">
              <button className="dash-btn dash-btn--primary" type="button" onClick={submitApplication}>Submit Seller Application</button>
              <button className="dash-btn" type="button" onClick={() => setForm({
              farmName: '',
              city: '',
              products: '',
              note: ''
            })}>Clear Form</button>
            </div>
            {submitted ? <div className="dash-alert dash-alert--success" style={{
            marginTop: '12px'
          }}>
                <span>Application submitted. Admin can review it in Seller Applications.</span>
                <button className="dash-btn dash-btn--compact" type="button" onClick={() => navigateTo('/dashboard/admin/operations#applications')}>
                  Open Admin Page
                </button>
              </div> : null}
          </Panel>
        </div>

        <div className="role-workspace-stack">
          <Panel title="Required Pages for a Great Farm Marketplace" subtitle="Role-based page map (what should exist in production)">
            <div className="dash-list">
              <div className="dash-list__item">
                <div>
                  <p className="dash-list__title">Buyer role</p>
                  <p className="dash-list__subtitle">Marketplace, product details, cart, checkout, orders, favorites, addresses, support, order tracking</p>
                </div>
                <div className="dash-list__actions">
                  <button className="dash-btn dash-btn--compact" type="button" onClick={() => navigateTo('/dashboard/buyer/workspace')}>
                    Buyer Workspace
                  </button>
                </div>
              </div>
              <div className="dash-list__item">
                <div>
                  <p className="dash-list__title">Farmer role</p>
                  <p className="dash-list__subtitle">Farmer dashboard, product studio, inventory, orders, payouts, harvest planner, store profile</p>
                </div>
                <div className="dash-list__actions">
                  <button className="dash-btn dash-btn--compact" type="button" onClick={() => navigateTo('/dashboard/farmer/studio')}>
                    Farmer Studio
                  </button>
                </div>
              </div>
              <div className="dash-list__item">
                <div>
                  <p className="dash-list__title">Admin role</p>
                  <p className="dash-list__subtitle">Moderation queue, seller approvals, disputes, finance/risk, analytics, settings, audit log</p>
                </div>
                <div className="dash-list__actions">
                  <button className="dash-btn dash-btn--compact" type="button" onClick={() => navigateTo('/dashboard/admin/operations')}>
                    Admin Operations
                  </button>
                </div>
              </div>
            </div>
          </Panel>
          <ActivityLog items={activity} />
        </div>
      </div>
    </div>;
};

export { BuyerWorkspacePage, FarmerStudioPage, AdminOperationsPage, SellerOnboardingPage };
