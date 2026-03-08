import { useState } from 'react';
import fieldsImage from '../../../assets/images/home-fields.png';
import heroImage from '../../../assets/images/home-hero.png';
import { products } from '../../../data/products';
import { useAuth } from '../../../app/providers/AuthProvider';
import { DEMO_LISTINGS, DEMO_REQUESTS } from '../../../data/seedData';
import { findFarmByFarmer } from '../../../data/farms';
import { navigateTo } from '../../../app/navigation';
import '../dashboard-ui.css';
import './FarmerDashboardPage.css';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDh  = v => `${new Intl.NumberFormat('fr-MA').format(Math.round(v))} DH`;
const formatKg  = v => `${new Intl.NumberFormat('fr-MA').format(Math.round(v))} kg`;
const formatStamp = iso => { try { return new Intl.DateTimeFormat('en-GB',{month:'short',day:'2-digit',hour:'2-digit',minute:'2-digit'}).format(new Date(iso)); } catch{return iso;} };

const getStatusClass = s => {
  if(s==='Accepted'||s==='Active')      return 'dash-status dash-status--success';
  if(s==='Declined')                     return 'dash-status dash-status--danger';
  if(s==='Negotiating'||s==='Low Stock') return 'dash-status dash-status--warning';
  if(s==='Paused')                       return 'dash-status dash-status--info';
  return 'dash-status dash-status--info';
};

// ─── localStorage ─────────────────────────────────────────────────────────────
const LISTINGS_KEY  = 'soukfalah-listings';
const REQUESTS_KEY  = 'soukfalah-requests';

const readLS   = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)||'null') ?? fallback; } catch { return fallback; } };
const writeLS  = (key, val)      => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

let _actId = 1;
const mkAct = (text, kind='info') => ({ id:`fact-${_actId+=1}`, text, kind, createdAt: new Date().toISOString() });

// ─── Component ────────────────────────────────────────────────────────────────
const FarmerDashboardPage = () => {
  const { fullName, username } = useAuth();
  const displayName = fullName || username || 'Farmer';
  const myFarm = findFarmByFarmer(username); // farm this farmer owns

  const pageStyle = { '--farmer-hero-image':`url(${heroImage})`, '--farmer-fields-image':`url(${fieldsImage})` };

  const [listings,   setListings]  = useState(() => readLS(LISTINGS_KEY,  []));
  const [requests,   setRequests]  = useState(() => readLS(REQUESTS_KEY,  []));
  const [activity,   setActivity]  = useState([mkAct('Dashboard opened')]);
  const [notice,     setNotice]    = useState(null);

  const [requestFilter,      setRequestFilter]      = useState('all');
  const [requestSearch,      setRequestSearch]      = useState('');
  const [showAllRequests,    setShowAllRequests]    = useState(false);
  const [selectedRequestId,  setSelectedRequestId]  = useState(() => readLS(REQUESTS_KEY,[])[0]?.id || null);
  const [selectedListingId,  setSelectedListingId]  = useState(() => readLS(LISTINGS_KEY,[])[0]?.id || null);
  const [showAddListing,     setShowAddListing]     = useState(false);
  const [manageListings,     setManageListings]     = useState(false);
  const [counterOffer,       setCounterOffer]       = useState('0');
  const [listingDraft,       setListingDraft]       = useState({
    productId: products[0]?.id || '', stockKg: '120', pricePerKg: '15', status: 'Active',
  });

  // ── Helpers ────────────────────────────────────────────────────────────────
  const pushNotice  = (msg, type='success') => setNotice({ id:Date.now(), msg, type });
  const pushActivity = (text, kind='info')  => setActivity(p => [mkAct(text, kind), ...p].slice(0, 8));
  const saveListings = v => { setListings(v); writeLS(LISTINGS_KEY, v); };
  const saveRequests = v => { setRequests(v); writeLS(REQUESTS_KEY, v); };

  // ── Seed button (only if empty) ─────────────────────────────────────────────
  const hasSeedData = listings.length > 0 || requests.length > 0;
  const loadSeedData = () => {
    saveListings(DEMO_LISTINGS);
    saveRequests(DEMO_REQUESTS);
    setSelectedListingId(DEMO_LISTINGS[0]?.id || null);
    setSelectedRequestId(DEMO_REQUESTS[0]?.id || null);
    pushNotice('Demo data loaded! You can now test the dashboard.', 'success');
  };

  // ── Derived ────────────────────────────────────────────────────────────────
  const filteredRequests = requests.filter(r => {
    if(requestFilter !== 'all' && r.status !== requestFilter) return false;
    if(requestSearch.trim()) { const q=requestSearch.trim().toLowerCase(); return `${r.id} ${r.product} ${r.buyer}`.toLowerCase().includes(q); }
    return true;
  });
  const visibleRequests  = showAllRequests ? filteredRequests : filteredRequests.slice(0, 6);
  const selectedRequest  = requests.find(r => r.id === selectedRequestId) || visibleRequests[0] || null;
  const selectedListing  = listings.find(l => l.id === selectedListingId) || listings[0] || null;

  const activeListings   = listings.filter(l => l.status === 'Active' || l.status === 'Low Stock').length;
  const pendingRequests  = requests.filter(r => r.status === 'Pending' || r.status === 'Negotiating').length;
  const lowStockCount    = listings.filter(l => l.stockKg <= 90 || l.status === 'Low Stock').length;
  const estRevenue       = requests.filter(r => r.status === 'Accepted').reduce((s,r) => s + r.qtyKg * r.pricePerKg, 0);

  // ── Request actions ────────────────────────────────────────────────────────
  const handleRequestAction = (nextStatus, opts={}) => {
    if(!selectedRequest) return;
    const updated = requests.map(r => r.id === selectedRequest.id ? { ...r, status: nextStatus, pricePerKg: opts.pricePerKg ?? r.pricePerKg } : r);
    saveRequests(updated);
    pushActivity(`${nextStatus} request ${selectedRequest.id}`, nextStatus === 'Accepted' ? 'success' : nextStatus === 'Declined' ? 'danger' : 'info');
    pushNotice(`Request ${selectedRequest.id} ${nextStatus.toLowerCase()}.`, nextStatus === 'Declined' ? 'danger' : 'success');
  };

  const handleCounterOffer = () => {
    if(!selectedRequest) return;
    const price = Math.max(1, parseInt(counterOffer, 10) || selectedRequest.pricePerKg);
    handleRequestAction('Negotiating', { pricePerKg: price });
  };

  // ── Listing actions ────────────────────────────────────────────────────────
  const handleAddListing = e => {
    e.preventDefault();
    const product  = products.find(p => p.id === listingDraft.productId);
    const stockKg  = Math.max(1, parseInt(listingDraft.stockKg, 10)    || 0);
    const pricePerKg = Math.max(1, parseInt(listingDraft.pricePerKg, 10) || 0);
    if(!product) { pushNotice('Select a product.', 'warning'); return; }
    const newListing = {
      id: `LIST-${Date.now()}`,
      name: product.name,
      stockKg,
      status: stockKg <= 90 ? 'Low Stock' : listingDraft.status,
      category: product.category || 'Others',
      pricePerKg,
      updatedAt: new Date().toISOString(),
    };
    const updated = [newListing, ...listings];
    saveListings(updated);
    setSelectedListingId(newListing.id);
    setShowAddListing(false);
    pushActivity(`Added listing: ${newListing.name}`, 'success');
    pushNotice(`${newListing.name} published.`);
  };

  const handleRestock = kg => {
    if(!selectedListing) return;
    const updated = listings.map(l => l.id === selectedListing.id ? {
      ...l, stockKg: l.stockKg + kg,
      status: l.stockKg + kg <= 90 ? 'Low Stock' : l.status === 'Paused' ? 'Paused' : 'Active',
      updatedAt: new Date().toISOString(),
    } : l);
    saveListings(updated);
    pushActivity(`Restocked ${selectedListing.name} +${kg}kg`, 'success');
    pushNotice(`+${kg} kg added to ${selectedListing.name}.`);
  };

  const handleToggleStatus = () => {
    if(!selectedListing) return;
    const next = selectedListing.status === 'Paused' ? (selectedListing.stockKg <= 90 ? 'Low Stock' : 'Active') : 'Paused';
    const updated = listings.map(l => l.id === selectedListing.id ? { ...l, status: next, updatedAt: new Date().toISOString() } : l);
    saveListings(updated);
    pushActivity(`${selectedListing.name} → ${next}`, 'info');
    pushNotice(`${selectedListing.name} is now ${next}.`, 'info');
  };

  const handleUpdatePrice = delta => {
    if(!selectedListing) return;
    const updated = listings.map(l => l.id === selectedListing.id ? { ...l, pricePerKg: Math.max(1, l.pricePerKg + delta), updatedAt: new Date().toISOString() } : l);
    saveListings(updated);
    pushActivity(`Updated price for ${selectedListing.name}`, 'info');
    pushNotice(`${selectedListing.name} price updated.`);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="farmer-dashboard" style={pageStyle}>
      <section className="farmer-hero">
        <div>
          <p className="farmer-hero__kicker">Farmer Dashboard</p>
          <h1>Welcome back, {displayName}!</h1>
          <p>Handle buyer requests, manage inventory and pricing from one workspace.</p>
        </div>
        <div className="farmer-hero__actions">
          <span className="farmer-chip">Farmer</span>
          {myFarm && (
            <button type="button" className="dash-btn dash-btn--soft" onClick={() => navigateTo(`/farm/${myFarm.id}`)}>
              👁 View My Farm Page
            </button>
          )}
          <button type="button" className="farmer-button" onClick={() => setShowAddListing(v => !v)}>
            {showAddListing ? 'Close Form' : 'Add Listing'}
          </button>
          <button type="button" className="dash-btn dash-btn--soft" onClick={() => setManageListings(v => !v)}>
            {manageListings ? 'Close Manager' : 'Manage Listings'}
          </button>
        </div>
      </section>

      {notice && (
        <div className={`dash-alert ${notice.type==='danger'?'dash-alert--danger':notice.type==='warning'?'dash-alert--warning':'dash-alert--success'}`}>
          <span>{notice.msg}</span>
          <button type="button" className="dash-btn dash-btn--compact" onClick={() => setNotice(null)}>Dismiss</button>
        </div>
      )}

      {!hasSeedData && (
        <div className="dash-alert dash-alert--warning" style={{display:'flex',alignItems:'center',gap:'1rem'}}>
          <span>Your dashboard is empty. Load demo data to test all features.</span>
          <button type="button" className="dash-btn dash-btn--primary" onClick={loadSeedData}>Load Demo Data</button>
        </div>
      )}

      <section className="farmer-stats">
        <article><h3>{activeListings}</h3><p>Active listings</p><span>{lowStockCount} need restock</span></article>
        <article><h3>{pendingRequests}</h3><p>Pending requests</p><span>Respond to keep ranking</span></article>
        <article><h3>{formatDh(estRevenue)}</h3><p>Accepted revenue</p><span>From confirmed orders</span></article>
      </section>

      <section className="farmer-grid">
        {/* ── Requests ── */}
        <div className="farmer-panel">
          <div className="farmer-panel__header">
            <h2>Incoming Requests</h2>
            <button type="button" onClick={() => setShowAllRequests(v => !v)}>{showAllRequests ? 'Show Recent' : 'View All'}</button>
          </div>
          <div className="dash-panel-stack">
            <div className="dash-toolbar">
              <div className="dash-toolbar__group">
                <input className="dash-input farmer-panel__search" type="search" value={requestSearch} onChange={e => setRequestSearch(e.target.value)} placeholder="Search request, buyer, product"/>
                <select className="dash-select" value={requestFilter} onChange={e => setRequestFilter(e.target.value)}>
                  <option value="all">All requests</option>
                  <option value="Pending">Pending</option>
                  <option value="Negotiating">Negotiating</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Declined">Declined</option>
                </select>
              </div>
              <span className="dash-toolbar__meta">{filteredRequests.length} request{filteredRequests.length!==1?'s':''}</span>
            </div>

            <div className="farmer-table">
              <div className="farmer-table__head">
                <span>Request</span><span>Product</span><span>Buyer</span><span>Qty</span>
              </div>
              {visibleRequests.length ? visibleRequests.map(r => (
                <button key={r.id} type="button"
                  className={`farmer-table__row farmer-table__row--button${selectedRequestId===r.id?' is-active':''}`}
                  onClick={() => setSelectedRequestId(r.id)}>
                  <span className="farmer-table__id">{r.id}</span>
                  <span>{r.product}<small className="farmer-table__sub">{formatDh(r.pricePerKg)}/kg</small></span>
                  <span>{r.buyer}<small className="farmer-table__sub">{r.status}</small></span>
                  <span className="farmer-table__qty">{formatKg(r.qtyKg)}</span>
                </button>
              )) : <div className="dash-empty">No requests yet. They'll appear when buyers place orders.</div>}
            </div>

            {selectedRequest && (
              <div className="dash-section">
                <div className="dash-toolbar">
                  <div>
                    <p className="dash-section__title">{selectedRequest.id} • {selectedRequest.product}</p>
                    <p className="dash-section__subtitle">Buyer: {selectedRequest.buyer} • Delivery: {selectedRequest.deliveryWindow}</p>
                  </div>
                  <span className={getStatusClass(selectedRequest.status)}>{selectedRequest.status}</span>
                </div>
                <div className="farmer-request-detail__meta">
                  <span>Qty: {formatKg(selectedRequest.qtyKg)}</span>
                  <span>Offered: {formatDh(selectedRequest.pricePerKg)}/kg</span>
                  <span>Total: {formatDh(selectedRequest.qtyKg * selectedRequest.pricePerKg)}</span>
                </div>
                {selectedRequest.note && <p className="dash-inline-note">{selectedRequest.note}</p>}
                <div className="dash-form-actions">
                  <button type="button" className="dash-btn dash-btn--success" onClick={() => handleRequestAction('Accepted')}>Accept</button>
                  <button type="button" className="dash-btn dash-btn--danger" onClick={() => handleRequestAction('Declined')}>Decline</button>
                  <label className="dash-label farmer-request-detail__counter">
                    Counter offer (DH/kg)
                    <input className="dash-input" type="number" min="1" value={counterOffer} onChange={e => setCounterOffer(e.target.value)}/>
                  </label>
                  <button type="button" className="dash-btn" onClick={handleCounterOffer}>Send Counter</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Listings ── */}
        <div className="farmer-panel">
          <div className="farmer-panel__header">
            <h2>Listing Management</h2>
            <button type="button" onClick={() => setManageListings(v => !v)}>{manageListings ? 'Hide Controls' : 'Manage'}</button>
          </div>
          <div className="dash-panel-stack">
            <div className="farmer-listings">
              {listings.length ? listings.map(l => (
                <button key={l.id} type="button"
                  className={`farmer-listings__item farmer-listings__item--button${selectedListingId===l.id?' is-active':''}`}
                  onClick={() => setSelectedListingId(l.id)}>
                  <div>
                    <p className="farmer-listings__name">{l.name}</p>
                    <p className="farmer-listings__stock">{formatKg(l.stockKg)} • {formatDh(l.pricePerKg)}/kg</p>
                  </div>
                  <span className={getStatusClass(l.status)}>{l.status}</span>
                </button>
              )) : <div className="dash-empty">No listings yet. Click "Add Listing" to publish a product.</div>}
            </div>

            {selectedListing && (
              <div className="dash-section">
                <div className="dash-toolbar">
                  <div>
                    <p className="dash-section__title">{selectedListing.name}</p>
                    <p className="dash-section__subtitle">{selectedListing.category} • Updated {formatStamp(selectedListing.updatedAt)}</p>
                  </div>
                  <span className={getStatusClass(selectedListing.status)}>{selectedListing.status}</span>
                </div>
                <div className="farmer-request-detail__meta">
                  <span>Stock: {formatKg(selectedListing.stockKg)}</span>
                  <span>Price: {formatDh(selectedListing.pricePerKg)}/kg</span>
                </div>
                {manageListings ? (
                  <div className="dash-form-actions">
                    <button type="button" className="dash-btn dash-btn--success" onClick={() => handleRestock(25)}>+25 kg</button>
                    <button type="button" className="dash-btn dash-btn--success" onClick={() => handleRestock(50)}>+50 kg</button>
                    <button type="button" className="dash-btn" onClick={() => handleUpdatePrice(1)}>+1 DH</button>
                    <button type="button" className="dash-btn" onClick={() => handleUpdatePrice(-1)}>−1 DH</button>
                    <button type="button" className="dash-btn dash-btn--soft" onClick={handleToggleStatus}>
                      {selectedListing.status === 'Paused' ? 'Resume' : 'Pause'}
                    </button>
                  </div>
                ) : <p className="dash-inline-note">Enable "Manage Listings" to restock, pause, or update pricing.</p>}
              </div>
            )}

            {showAddListing && (
              <form className="dash-section" onSubmit={handleAddListing}>
                <p className="dash-section__title">Add New Listing</p>
                <div className="dash-field-grid">
                  <label className="dash-label">Product
                    <select className="dash-select" value={listingDraft.productId} onChange={e => {
                      const p = products.find(p => p.id === e.target.value);
                      setListingDraft(d => ({ ...d, productId: e.target.value, pricePerKg: p ? String(Math.round(parseFloat(String(p.price).replace(/[^\d.]/g,''))||1)) : d.pricePerKg }));
                    }}>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.category})</option>)}
                    </select>
                  </label>
                  <label className="dash-label">Stock (kg)
                    <input className="dash-input" type="number" min="1" value={listingDraft.stockKg} onChange={e => setListingDraft(d => ({...d,stockKg:e.target.value}))}/>
                  </label>
                  <label className="dash-label">Price (DH/kg)
                    <input className="dash-input" type="number" min="1" value={listingDraft.pricePerKg} onChange={e => setListingDraft(d => ({...d,pricePerKg:e.target.value}))}/>
                  </label>
                  <label className="dash-label">Status
                    <select className="dash-select" value={listingDraft.status} onChange={e => setListingDraft(d => ({...d,status:e.target.value}))}>
                      <option value="Active">Active</option>
                      <option value="Paused">Paused</option>
                    </select>
                  </label>
                </div>
                <div className="dash-form-actions">
                  <button type="submit" className="dash-btn dash-btn--primary">Publish Listing</button>
                  <button type="button" className="dash-btn" onClick={() => setShowAddListing(false)}>Close</button>
                </div>
              </form>
            )}

            <div className="dash-section">
              <p className="dash-section__title">Recent Activity</p>
              <div className="dash-log">
                {activity.map(e => (
                  <div key={e.id} className="dash-log__item">
                    <p>{e.text}</p>
                    <div className="dash-log__time">{formatStamp(e.createdAt)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FarmerDashboardPage;