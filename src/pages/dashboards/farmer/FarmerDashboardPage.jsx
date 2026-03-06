import { useState } from 'react';
import fieldsImage from '../../../assets/images/home-fields.png';
import heroImage from '../../../assets/images/home-hero.png';
import { products } from '../../../data/products';
import '../dashboard-ui.css';
import './FarmerDashboardPage.css';

let farmerRequestCounter = 93;
let farmerListingCounter = 10;
let farmerActivityCounter = 1;

const formatDh = value => `${new Intl.NumberFormat('fr-MA').format(Math.round(value))} DH`;
const formatKg = value => `${new Intl.NumberFormat('fr-MA').format(Math.round(value))} kg`;
const formatStamp = iso => new Intl.DateTimeFormat('en-GB', {
  month: 'short',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit'
}).format(new Date(iso));

const nextRequestId = () => {
  farmerRequestCounter += 1;
  return `REQ-${String(farmerRequestCounter).padStart(3, '0')}`;
};

const nextListingId = () => {
  farmerListingCounter += 1;
  return `LIST-${String(farmerListingCounter).padStart(2, '0')}`;
};

const createFarmerActivity = (text, kind = 'info') => ({
  id: `farmer-activity-${farmerActivityCounter += 1}`,
  text,
  kind,
  createdAt: new Date().toISOString()
});

const getFarmerStatusClass = status => {
  if (status === 'Accepted' || status === 'Active') return 'dash-status dash-status--success';
  if (status === 'Declined') return 'dash-status dash-status--danger';
  if (status === 'Negotiating' || status === 'Low Stock') return 'dash-status dash-status--warning';
  if (status === 'Paused') return 'dash-status dash-status--info';
  return 'dash-status dash-status--info';
};

const initialRequests = [{
  id: 'REQ-093',
  product: 'Organic Tomatoes',
  buyer: 'Rania K.',
  qtyKg: 120,
  pricePerKg: 15,
  status: 'Pending',
  deliveryWindow: 'Tomorrow morning',
  note: 'Need clean packaging',
  createdAt: '2026-02-21T09:10:00Z'
}, {
  id: 'REQ-092',
  product: 'Seasonal Oranges',
  buyer: 'Omar B.',
  qtyKg: 80,
  pricePerKg: 7,
  status: 'Negotiating',
  deliveryWindow: 'Tue afternoon',
  note: 'Discuss pallet delivery',
  createdAt: '2026-02-20T16:20:00Z'
}, {
  id: 'REQ-091',
  product: 'Fresh Herbs Pack',
  buyer: 'Lamia D.',
  qtyKg: 45,
  pricePerKg: 22,
  status: 'Accepted',
  deliveryWindow: 'Today 18:00',
  note: 'Restaurant supply',
  createdAt: '2026-02-20T11:05:00Z'
}];

const initialListings = [{
  id: 'LIST-01',
  name: 'Golden Potatoes',
  stockKg: 240,
  status: 'Active',
  category: 'Vegetables',
  pricePerKg: 10,
  updatedAt: '2026-02-20T08:00:00Z'
}, {
  id: 'LIST-02',
  name: 'Summer Strawberries',
  stockKg: 75,
  status: 'Low Stock',
  category: 'Fruits',
  pricePerKg: 20,
  updatedAt: '2026-02-21T07:10:00Z'
}, {
  id: 'LIST-03',
  name: 'Early Cucumbers',
  stockKg: 160,
  status: 'Active',
  category: 'Vegetables',
  pricePerKg: 13,
  updatedAt: '2026-02-19T13:25:00Z'
}];

const initialFarmerActivity = [{
  id: 'farmer-activity-1',
  text: 'Accepted request REQ-091 from Lamia D.',
  kind: 'success',
  createdAt: '2026-02-20T11:15:00Z'
}, {
  id: 'farmer-activity-2',
  text: 'Stock warning for Summer Strawberries (75 kg)',
  kind: 'warning',
  createdAt: '2026-02-21T07:15:00Z'
}, {
  id: 'farmer-activity-3',
  text: 'Updated price for Golden Potatoes',
  kind: 'info',
  createdAt: '2026-02-19T18:05:00Z'
}];

const FarmerDashboardPage = () => {
  const pageStyle = {
    '--farmer-hero-image': `url(${heroImage})`,
    '--farmer-fields-image': `url(${fieldsImage})`
  };

  const [requests, setRequests] = useState(initialRequests);
  const [listings, setListings] = useState(initialListings);
  const [activity, setActivity] = useState(initialFarmerActivity);
  const [notice, setNotice] = useState(null);
  const [requestFilter, setRequestFilter] = useState('all');
  const [requestSearch, setRequestSearch] = useState('');
  const [showAllRequests, setShowAllRequests] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(initialRequests[0]?.id || null);
  const [selectedListingId, setSelectedListingId] = useState(initialListings[0]?.id || null);
  const [showAddListing, setShowAddListing] = useState(false);
  const [manageListings, setManageListings] = useState(false);
  const [counterOffer, setCounterOffer] = useState('0');
  const [listingDraft, setListingDraft] = useState({
    productId: products[0]?.id || '',
    stockKg: '120',
    pricePerKg: '15',
    status: 'Active'
  });

  const pushNotice = (message, type = 'success') => {
    setNotice({
      id: Date.now(),
      message,
      type
    });
  };

  const pushActivity = (text, kind = 'info') => {
    setActivity(current => [createFarmerActivity(text, kind), ...current].slice(0, 8));
  };

  const filteredRequests = requests.filter(item => {
    if (requestFilter !== 'all' && item.status !== requestFilter) {
      return false;
    }
    if (requestSearch.trim()) {
      const q = requestSearch.trim().toLowerCase();
      const haystack = `${item.id} ${item.product} ${item.buyer}`.toLowerCase();
      return haystack.includes(q);
    }
    return true;
  });

  const visibleRequests = showAllRequests ? filteredRequests : filteredRequests.slice(0, 5);
  const selectedRequest = requests.find(item => item.id === selectedRequestId) || visibleRequests[0] || requests[0] || null;
  const selectedListing = listings.find(item => item.id === selectedListingId) || listings[0] || null;

  const activeListings = listings.filter(item => item.status === 'Active' || item.status === 'Low Stock').length;
  const pendingRequests = requests.filter(item => item.status === 'Pending' || item.status === 'Negotiating').length;
  const lowStockListings = listings.filter(item => item.stockKg <= 90 || item.status === 'Low Stock').length;
  const estimatedRevenue = requests.filter(item => item.status === 'Accepted').reduce((sum, item) => sum + item.qtyKg * item.pricePerKg, 0) + listings.filter(item => item.status === 'Active').reduce((sum, item) => sum + item.stockKg * item.pricePerKg * 0.08, 0);

  const categoryMix = ['Vegetables', 'Fruits', 'Herbs', 'Others'].map(category => {
    const totalStock = listings.filter(item => item.category === category).reduce((sum, item) => sum + item.stockKg, 0);
    return {
      category,
      totalStock
    };
  }).filter(item => item.totalStock > 0).sort((a, b) => b.totalStock - a.totalStock);

  const handleRequestAction = (nextStatus, options = {}) => {
    if (!selectedRequest) return;

    setRequests(current => current.map(item => item.id === selectedRequest.id ? {
      ...item,
      status: nextStatus,
      pricePerKg: options.pricePerKg || item.pricePerKg
    } : item));

    if (nextStatus === 'Accepted') {
      pushActivity(`Accepted ${selectedRequest.id} from ${selectedRequest.buyer}`, 'success');
      pushNotice(`Request ${selectedRequest.id} accepted.`, 'success');
      return;
    }
    if (nextStatus === 'Declined') {
      pushActivity(`Declined ${selectedRequest.id}`, 'danger');
      pushNotice(`Request ${selectedRequest.id} declined.`, 'danger');
      return;
    }
    pushActivity(`Sent counter offer for ${selectedRequest.id}`, 'info');
    pushNotice(`Counter offer saved for ${selectedRequest.id}.`, 'info');
  };

  const handleCounterOffer = () => {
    if (!selectedRequest) return;
    const price = Math.max(1, Number.parseInt(counterOffer, 10) || selectedRequest.pricePerKg);
    handleRequestAction('Negotiating', {
      pricePerKg: price
    });
  };

  const handleAddListing = event => {
    event.preventDefault();
    const product = products.find(item => item.id === listingDraft.productId);
    const stockKg = Math.max(1, Number.parseInt(listingDraft.stockKg, 10) || 0);
    const pricePerKg = Math.max(1, Number.parseInt(listingDraft.pricePerKg, 10) || 0);

    if (!product) {
      pushNotice('Select a product before adding a listing.', 'warning');
      return;
    }

    const newListing = {
      id: nextListingId(),
      name: product.name,
      stockKg,
      status: stockKg <= 90 ? 'Low Stock' : listingDraft.status,
      category: product.category || 'Others',
      pricePerKg,
      updatedAt: new Date().toISOString()
    };

    setListings(current => [newListing, ...current]);
    setSelectedListingId(newListing.id);
    setShowAddListing(false);
    pushActivity(`Added listing ${newListing.name} (${formatKg(stockKg)})`, 'success');
    pushNotice(`${newListing.name} listing added.`, 'success');
  };

  const handleRestockSelected = amount => {
    if (!selectedListing) return;
    setListings(current => current.map(item => item.id === selectedListing.id ? {
      ...item,
      stockKg: item.stockKg + amount,
      status: item.stockKg + amount <= 90 ? 'Low Stock' : item.status === 'Paused' ? 'Paused' : 'Active',
      updatedAt: new Date().toISOString()
    } : item));
    pushActivity(`Restocked ${selectedListing.name} by ${formatKg(amount)}`, 'success');
    pushNotice(`${selectedListing.name} restocked (+${amount} kg).`, 'success');
  };

  const handleToggleListingStatus = () => {
    if (!selectedListing) return;
    const nextStatus = selectedListing.status === 'Paused' ? selectedListing.stockKg <= 90 ? 'Low Stock' : 'Active' : 'Paused';
    setListings(current => current.map(item => item.id === selectedListing.id ? {
      ...item,
      status: nextStatus,
      updatedAt: new Date().toISOString()
    } : item));
    pushActivity(`${selectedListing.name} status changed to ${nextStatus}`, 'info');
    pushNotice(`${selectedListing.name} is now ${nextStatus}.`, 'info');
  };

  const handleUpdateListingPrice = delta => {
    if (!selectedListing) return;
    setListings(current => current.map(item => item.id === selectedListing.id ? {
      ...item,
      pricePerKg: Math.max(1, item.pricePerKg + delta),
      updatedAt: new Date().toISOString()
    } : item));
    pushActivity(`Updated price for ${selectedListing.name}`, 'info');
    pushNotice(`${selectedListing.name} price updated.`, 'success');
  };

  return <div className="farmer-dashboard" style={pageStyle}>
      <section className="farmer-hero">
        <div>
          <p className="farmer-hero__kicker">Farmer Dashboard</p>
          <h1>Welcome back, Youssef!</h1>
          <p>
            Handle buyer requests, manage inventory and pricing, and keep your
            listings healthy from one operational workspace.
          </p>
        </div>
        <div className="farmer-hero__actions">
          <span className="farmer-chip">Farmer</span>
          <button type="button" className="farmer-button" onClick={() => setShowAddListing(value => !value)}>
            {showAddListing ? 'Close Form' : 'Add Listing'}
          </button>
          <button type="button" className="dash-btn dash-btn--soft" onClick={() => setManageListings(value => !value)}>
            {manageListings ? 'Close Manager' : 'Manage Listings'}
          </button>
        </div>
      </section>

      {notice ? <div className={`dash-alert ${notice.type === 'danger' ? 'dash-alert--danger' : notice.type === 'warning' ? 'dash-alert--warning' : 'dash-alert--success'}`}>
          <span>{notice.message}</span>
          <button type="button" className="dash-btn dash-btn--compact" onClick={() => setNotice(null)}>
            Dismiss
          </button>
        </div> : null}

      <section className="farmer-stats">
        <article>
          <h3>{activeListings}</h3>
          <p>Active listings</p>
          <span>{lowStockListings} need restock</span>
        </article>
        <article>
          <h3>{pendingRequests}</h3>
          <p>Pending requests</p>
          <span>Respond to keep ranking high</span>
        </article>
        <article>
          <h3>{formatDh(estimatedRevenue)}</h3>
          <p>Estimated revenue</p>
          <span>Accepted orders + active stock</span>
        </article>
      </section>

      <section className="farmer-grid">
        <div className="farmer-panel">
          <div className="farmer-panel__header">
            <h2>Incoming Requests</h2>
            <button type="button" onClick={() => setShowAllRequests(value => !value)}>
              {showAllRequests ? 'Show Recent' : 'View All'}
            </button>
          </div>

          <div className="dash-panel-stack">
            <div className="dash-toolbar">
              <div className="dash-toolbar__group">
                <input className="dash-input farmer-panel__search" type="search" value={requestSearch} onChange={event => setRequestSearch(event.target.value)} placeholder="Search request, buyer, product" />
                <select className="dash-select" value={requestFilter} onChange={event => setRequestFilter(event.target.value)}>
                  <option value="all">All requests</option>
                  <option value="Pending">Pending</option>
                  <option value="Negotiating">Negotiating</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Declined">Declined</option>
                </select>
              </div>
              <span className="dash-toolbar__meta">
                {filteredRequests.length} request{filteredRequests.length === 1 ? '' : 's'}
              </span>
            </div>

            <div className="farmer-table">
              <div className="farmer-table__head">
                <span>Request</span>
                <span>Product</span>
                <span>Buyer</span>
                <span>Qty</span>
              </div>
              {visibleRequests.length ? visibleRequests.map(item => <button className={`farmer-table__row farmer-table__row--button${selectedRequestId === item.id ? ' is-active' : ''}`} type="button" key={item.id} onClick={() => setSelectedRequestId(item.id)}>
                    <span className="farmer-table__id">{item.id}</span>
                    <span>
                      {item.product}
                      <small className="farmer-table__sub">{formatDh(item.pricePerKg)}/kg</small>
                    </span>
                    <span>
                      {item.buyer}
                      <small className="farmer-table__sub">{item.status}</small>
                    </span>
                    <span className="farmer-table__qty">{formatKg(item.qtyKg)}</span>
                  </button>) : <div className="dash-empty">No requests match your filters.</div>}
            </div>

            {selectedRequest ? <div className="dash-section">
                <div className="dash-toolbar">
                  <div>
                    <p className="dash-section__title">{selectedRequest.id} • {selectedRequest.product}</p>
                    <p className="dash-section__subtitle">
                      Buyer: {selectedRequest.buyer} • Delivery: {selectedRequest.deliveryWindow}
                    </p>
                  </div>
                  <span className={getFarmerStatusClass(selectedRequest.status)}>{selectedRequest.status}</span>
                </div>
                <div className="farmer-request-detail__meta">
                  <span>Qty: {formatKg(selectedRequest.qtyKg)}</span>
                  <span>Offered: {formatDh(selectedRequest.pricePerKg)}/kg</span>
                  <span>Total: {formatDh(selectedRequest.qtyKg * selectedRequest.pricePerKg)}</span>
                </div>
                <p className="dash-inline-note">{selectedRequest.note || 'No buyer note provided.'}</p>
                <div className="dash-form-actions">
                  <button type="button" className="dash-btn dash-btn--success" onClick={() => handleRequestAction('Accepted')}>
                    Accept
                  </button>
                  <button type="button" className="dash-btn dash-btn--danger" onClick={() => handleRequestAction('Declined')}>
                    Decline
                  </button>
                  <label className="dash-label farmer-request-detail__counter">
                    Counter offer (DH/kg)
                    <input className="dash-input" type="number" min="1" value={counterOffer} onChange={event => setCounterOffer(event.target.value)} />
                  </label>
                  <button type="button" className="dash-btn" onClick={handleCounterOffer}>
                    Send Counter Offer
                  </button>
                </div>
              </div> : null}
          </div>
        </div>

        <div className="farmer-panel">
          <div className="farmer-panel__header">
            <h2>Listing Management</h2>
            <button type="button" onClick={() => setManageListings(value => !value)}>
              {manageListings ? 'Hide Controls' : 'Manage'}
            </button>
          </div>

          <div className="dash-panel-stack">
            <div className="farmer-listings">
              {listings.map(item => <button className={`farmer-listings__item farmer-listings__item--button${selectedListingId === item.id ? ' is-active' : ''}`} key={item.id} type="button" onClick={() => setSelectedListingId(item.id)}>
                  <div>
                    <p className="farmer-listings__name">{item.name}</p>
                    <p className="farmer-listings__stock">
                      {formatKg(item.stockKg)} • {formatDh(item.pricePerKg)}/kg
                    </p>
                  </div>
                  <span className={getFarmerStatusClass(item.status)}>{item.status}</span>
                </button>)}
            </div>

            {selectedListing ? <div className="dash-section">
                <div className="dash-toolbar">
                  <div>
                    <p className="dash-section__title">{selectedListing.name}</p>
                    <p className="dash-section__subtitle">
                      {selectedListing.category} • Updated {formatStamp(selectedListing.updatedAt)}
                    </p>
                  </div>
                  <span className={getFarmerStatusClass(selectedListing.status)}>{selectedListing.status}</span>
                </div>
                <div className="farmer-request-detail__meta">
                  <span>Stock: {formatKg(selectedListing.stockKg)}</span>
                  <span>Price: {formatDh(selectedListing.pricePerKg)}/kg</span>
                </div>
                {manageListings ? <div className="dash-form-actions">
                    <button type="button" className="dash-btn dash-btn--success" onClick={() => handleRestockSelected(25)}>
                      +25 kg
                    </button>
                    <button type="button" className="dash-btn dash-btn--success" onClick={() => handleRestockSelected(50)}>
                      +50 kg
                    </button>
                    <button type="button" className="dash-btn" onClick={() => handleUpdateListingPrice(1)}>
                      +1 DH
                    </button>
                    <button type="button" className="dash-btn" onClick={() => handleUpdateListingPrice(-1)}>
                      -1 DH
                    </button>
                    <button type="button" className="dash-btn dash-btn--soft" onClick={handleToggleListingStatus}>
                      {selectedListing.status === 'Paused' ? 'Resume Listing' : 'Pause Listing'}
                    </button>
                  </div> : <p className="dash-inline-note">Enable “Manage Listings” to restock, pause, or update pricing.</p>}
              </div> : null}

            {showAddListing ? <form className="dash-section" onSubmit={handleAddListing}>
                <div>
                  <p className="dash-section__title">Add New Listing</p>
                  <p className="dash-section__subtitle">
                    Publish a new product offer to the marketplace.
                  </p>
                </div>
                <div className="dash-field-grid">
                  <label className="dash-label">
                    Product template
                    <select className="dash-select" value={listingDraft.productId} onChange={event => {
                    const product = products.find(item => item.id === event.target.value);
                    setListingDraft(current => ({
                      ...current,
                      productId: event.target.value,
                      pricePerKg: String(product ? Math.round(Number.parseFloat(String(product.price).replace(/[^\d.]/g, '')) || 1) : current.pricePerKg)
                    }));
                  }}>
                      {products.map(product => <option key={product.id} value={product.id}>
                          {product.name} ({product.category})
                        </option>)}
                    </select>
                  </label>
                  <label className="dash-label">
                    Stock (kg)
                    <input className="dash-input" type="number" min="1" value={listingDraft.stockKg} onChange={event => setListingDraft(current => ({
                    ...current,
                    stockKg: event.target.value
                  }))} />
                  </label>
                  <label className="dash-label">
                    Price (DH/kg)
                    <input className="dash-input" type="number" min="1" value={listingDraft.pricePerKg} onChange={event => setListingDraft(current => ({
                    ...current,
                    pricePerKg: event.target.value
                  }))} />
                  </label>
                  <label className="dash-label">
                    Initial status
                    <select className="dash-select" value={listingDraft.status} onChange={event => setListingDraft(current => ({
                    ...current,
                    status: event.target.value
                  }))}>
                      <option value="Active">Active</option>
                      <option value="Paused">Paused</option>
                    </select>
                  </label>
                </div>
                <div className="dash-form-actions">
                  <button type="submit" className="dash-btn dash-btn--primary">
                    Publish Listing
                  </button>
                  <button type="button" className="dash-btn" onClick={() => setShowAddListing(false)}>
                    Close
                  </button>
                </div>
              </form> : null}

            <div className="dash-section">
              <p className="dash-section__title">Inventory Mix</p>
              <div className="dash-metric-bars">
                {categoryMix.length ? categoryMix.map(row => {
                const maxStock = categoryMix[0]?.totalStock || 1;
                return <div className="dash-metric-bars__row" key={row.category}>
                        <div className="dash-metric-bars__head">
                          <span>{row.category}</span>
                          <span>{formatKg(row.totalStock)}</span>
                        </div>
                        <div className="dash-metric-bars__track">
                          <div className="dash-metric-bars__fill" style={{
                        width: `${Math.max(8, Math.round(row.totalStock / maxStock * 100))}%`
                      }} />
                        </div>
                      </div>;
              }) : <div className="dash-empty">Add listings to see inventory composition.</div>}
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

export default FarmerDashboardPage;

