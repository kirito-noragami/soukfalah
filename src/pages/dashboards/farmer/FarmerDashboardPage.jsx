/**
 * FarmerDashboardPage — 100 % Supabase.
 *
 * Reads / writes:
 *  - farms           (create farm, view farm)
 *  - products        (add product)
 *  - listings        (auto-created on product add; restock, pause, price)
 *  - farmer_requests (incoming bulk requests from buyers; accept/decline/counter)
 *  - activity_log    (writes activity after each action)
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import fieldsImage from '../../../assets/images/home-fields.png';
import heroImage   from '../../../assets/images/home-hero.png';
import { useAuth }    from '../../../app/providers/AuthProvider';
import { supabase }   from '../../../services/supabase';
import { navigateTo } from '../../../app/navigation';
import '../dashboard-ui.css';
import './FarmerDashboardPage.css';

/* ─── Formatters ─────────────────────────────────────────────────────────── */
const fmtDh    = v  => `${new Intl.NumberFormat('fr-MA').format(Math.round(v))} DH`;
const fmtKg    = v  => `${new Intl.NumberFormat('fr-MA').format(Math.round(v))} kg`;
const fmtStamp = iso => {
  try { return new Intl.DateTimeFormat('en-GB', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(iso)); }
  catch { return iso; }
};

const statusCls = s => {
  if (s === 'accepted' || s === 'active')    return 'dash-status dash-status--success';
  if (s === 'declined')                       return 'dash-status dash-status--danger';
  if (s === 'negotiating' || s === 'low_stock') return 'dash-status dash-status--warning';
  if (s === 'paused')                         return 'dash-status dash-status--info';
  return 'dash-status dash-status--info';
};

/* ─── Create Farm Modal ──────────────────────────────────────────────────── */
const CreateFarmModal = ({ userId, onCreated, onClose }) => {
  const [form, setForm] = useState({ name: '', city: '', description: '', lat: '', lng: '', accent: '#7ea35f' });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  const handleSave = async () => {
    if (!form.name.trim() || !form.city.trim()) { setError('Farm name and city are required.'); return; }
    setSaving(true); setError('');
    try {
      const payload = {
        owner_id:    userId,
        name:        form.name.trim(),
        city:        form.city.trim(),
        description: form.description.trim(),
        accent:      form.accent || '#7ea35f',
      };
      if (form.lat && form.lng) {
        payload.location = `POINT(${parseFloat(form.lng)} ${parseFloat(form.lat)})`;
      }
      const { data, error: e } = await supabase.from('farms').insert(payload).select().single();
      if (e) throw e;
      onCreated(data);
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const f = (key, label, type = 'text', ph = '') => (
    <label className="dash-label">{label}
      <input className="dash-input" type={type} value={form[key]} placeholder={ph}
        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
    </label>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fdfbf7', borderRadius: 18, padding: 28, width: 'min(96vw,480px)', boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }}>
        <h2 style={{ margin: '0 0 18px', fontSize: 20, color: '#223223' }}>Create Your Farm</h2>
        {error && <p style={{ color: '#c0392b', fontSize: 13, marginBottom: 12 }}>{error}</p>}
        <div className="dash-field-grid dash-field-grid--1">
          {f('name', 'Farm Name *', 'text', 'e.g. Vergers Midelt Atlas')}
          {f('city', 'City *', 'text', 'e.g. Midelt, Marrakech')}
          <label className="dash-label">Description
            <textarea className="dash-textarea" rows={3} value={form.description}
              placeholder="Describe your farm…"
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          </label>
          {f('lat', 'Latitude (optional)', 'number', 'e.g. 32.68')}
          {f('lng', 'Longitude (optional)', 'number', 'e.g. -4.73')}
          <label className="dash-label">Accent Color
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="color" value={form.accent}
                onChange={e => setForm(p => ({ ...p, accent: e.target.value }))}
                style={{ width: 40, height: 36, border: 'none', cursor: 'pointer', borderRadius: 8 }} />
              <span style={{ fontSize: 13, color: '#6d7a6b' }}>{form.accent}</span>
            </div>
          </label>
        </div>
        <div className="dash-form-actions" style={{ marginTop: 18 }}>
          <button className="dash-btn dash-btn--primary" type="button" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Create Farm'}
          </button>
          <button className="dash-btn" type="button" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

/* ─── Add Product Modal ──────────────────────────────────────────────────── */
const AddProductModal = ({ farmId, farmerId, onAdded, onClose }) => {
  const [form, setForm] = useState({
    name: '', category: 'Fruits', price_dh: '', unit: 'kg',
    description: '', badge: '', harvest_date: '', accent: '#7ea35f', available: '100',
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  const handleSave = async () => {
    if (!form.name.trim() || !form.price_dh) { setError('Name and price are required.'); return; }
    setSaving(true); setError('');
    try {
      const payload = {
        farm_id:      farmId,
        name:         form.name.trim(),
        category:     form.category,
        price_dh:     parseFloat(form.price_dh),
        unit:         form.unit.trim() || 'kg',
        description:  form.description.trim(),
        badge:        form.badge.trim() || null,
        harvest_date: form.harvest_date || null,
        accent:       form.accent,
        available:    parseInt(form.available, 10) || 100,
        status:       'active',
      };
      const { data: product, error: e } = await supabase.from('products').insert(payload).select().single();
      if (e) throw e;

      // Create the listing row
      await supabase.from('listings').insert({
        farmer_id:   farmerId,
        product_id:  product.id,
        name:        product.name,
        stock_kg:    parseInt(form.available, 10) || 100,
        price_per_kg: parseFloat(form.price_dh),
        category:    form.category,
        status:      'active',
      });

      onAdded(product);
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const f = (key, label, type = 'text', ph = '') => (
    <label className="dash-label">{label}
      <input className="dash-input" type={type} value={form[key]} placeholder={ph}
        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
    </label>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fdfbf7', borderRadius: 18, padding: 28, width: 'min(96vw,520px)', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }}>
        <h2 style={{ margin: '0 0 18px', fontSize: 20, color: '#223223' }}>Add Product to Farm</h2>
        {error && <p style={{ color: '#c0392b', fontSize: 13, marginBottom: 12 }}>{error}</p>}
        <div className="dash-field-grid dash-field-grid--1">
          {f('name', 'Product Name *', 'text', 'e.g. Atlas Apples')}
          <label className="dash-label">Category *
            <select className="dash-select" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
              {['Vegetables', 'Fruits', 'Herbs', 'Nuts', 'Grains', 'Others'].map(c => <option key={c}>{c}</option>)}
            </select>
          </label>
          {f('price_dh', 'Price (DH/unit) *', 'number', 'e.g. 15')}
          {f('unit', 'Unit', 'text', 'kg / bunch / jar')}
          {f('available', 'Stock quantity', 'number', '100')}
          <label className="dash-label">Description
            <textarea className="dash-textarea" rows={3} value={form.description}
              placeholder="Describe this product…"
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          </label>
          {f('badge', 'Badge (optional)', 'text', 'Seasonal / Organic / Premium')}
          {f('harvest_date', 'Harvest date (optional)', 'date')}
          <label className="dash-label">Accent Color
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="color" value={form.accent}
                onChange={e => setForm(p => ({ ...p, accent: e.target.value }))}
                style={{ width: 40, height: 36, border: 'none', cursor: 'pointer', borderRadius: 8 }} />
              <span style={{ fontSize: 13, color: '#6d7a6b' }}>{form.accent}</span>
            </div>
          </label>
        </div>
        <div className="dash-form-actions" style={{ marginTop: 18 }}>
          <button className="dash-btn dash-btn--primary" type="button" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Add Product'}
          </button>
          <button className="dash-btn" type="button" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

/* ─── Main ───────────────────────────────────────────────────────────────── */
const FarmerDashboardPage = () => {
  const { userId, profile } = useAuth();
  const displayName = profile?.full_name || 'Farmer';

  const pageStyle = {
    '--farmer-hero-image':   `url(${heroImage})`,
    '--farmer-fields-image': `url(${fieldsImage})`,
  };

  /* ── State ────────────────────────────────────────────────────────────── */
  const [data, setData] = useState({ farm: null, products: [], listings: [], requests: [] });
  const farm     = data.farm;
  const products = data.products;
  const listings = data.listings;
  const requests = data.requests;
  const [loading,    setLoading]    = useState(true);
  const [notice,     setNotice]     = useState(null);

  const [showCreateFarm, setShowCreateFarm] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddListing, setShowAddListing] = useState(false);
  const [manageListings, setManageListings] = useState(false);

  const [selectedListingId,  setSelectedListingId]  = useState(null);
  const [selectedRequestId,  setSelectedRequestId]  = useState(null);
  const [requestFilter,      setRequestFilter]      = useState('all');
  const [requestSearch,      setRequestSearch]      = useState('');
  const [showAllRequests,    setShowAllRequests]    = useState(false);
  const [counterOffer,       setCounterOffer]       = useState('');

  /* ── Load everything from Supabase ──────────────────────────────────── */
  const loadAll = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data: farmData } = await supabase
        .from('farms').select('*').eq('owner_id', userId).maybeSingle();

      let prodData = [], lstData = [], reqData = [];

      if (farmData) {
        const [p, l] = await Promise.all([
          supabase.from('products').select('*').eq('farm_id', farmData.id).order('created_at', { ascending: false }),
          supabase.from('listings').select('*').eq('farmer_id', userId).order('updated_at', { ascending: false }),
        ]);
        prodData = p.data || [];
        lstData  = l.data || [];
      }

      const { data: rData } = await supabase
        .from('farmer_requests')
        .select('*, buyer_profile:buyer_id(full_name, email)')
        .eq('farmer_id', userId).order('created_at', { ascending: false });
      reqData = (rData || []).map(r => ({ ...r, profiles: r.buyer_profile }));

      console.log('[setData] farm:', farmData?.id, 'products:', prodData.length);
      if (farmData) {
        setData({ farm: farmData, products: prodData, listings: lstData, requests: reqData });
      } else {
        setData(prev => prev.farm ? prev : { farm: null, products: [], listings: [], requests: reqData });
      }

    } catch (e) { console.error('Load error:', e.message); }
    finally { setLoading(false); }
  }, [userId]);

  const didLoad = useRef(false);
  useEffect(() => {
    if (userId && !didLoad.current) {
      didLoad.current = true;
      loadAll();
    }
  }, [userId, loadAll]);


  /* ── Helpers ─────────────────────────────────────────────────────────── */
  const pushNotice = (msg, type = 'success') => setNotice({ id: Date.now(), msg, type });

  const logActivity = async (text, kind = 'info') => {
    const uid = profile?.id ?? userId;
    if (!uid) return;
    await supabase.from('activity_log').insert({ user_id: uid, text, kind });
  };

  /* ── Request actions ─────────────────────────────────────────────────── */
  const handleRequestAction = async (requestId, newStatus, opts = {}) => {
    const update = { status: newStatus };
    if (opts.price_per_kg) update.price_per_kg = opts.price_per_kg;
    const { error } = await supabase.from('farmer_requests').update(update).eq('id', requestId);
    if (error) { pushNotice(error.message, 'danger'); return; }
    setData(prev => ({ ...prev, requests: prev.requests.map(r => r.id === requestId ? { ...r, ...update } : r) }));
    pushNotice(`Request ${newStatus}.`, newStatus === 'declined' ? 'danger' : 'success');
    await logActivity(`Request ${newStatus}`, newStatus === 'declined' ? 'danger' : 'success');
  };

  /* ── Listing actions ─────────────────────────────────────────────────── */
  const handleRestock = async (listingId, kg) => {
    const lst = listings.find(l => l.id === listingId);
    if (!lst) return;
    const newStock = lst.stock_kg + kg;
    const { error } = await supabase.from('listings')
      .update({ stock_kg: newStock, status: newStock <= 90 ? 'low_stock' : 'active' })
      .eq('id', listingId);
    if (error) { pushNotice(error.message, 'danger'); return; }
    setData(prev => ({ ...prev, listings: prev.listings.map(l => l.id === listingId ? { ...l, stock_kg: newStock, status: newStock <= 90 ? 'low_stock' : 'active' } : l) }));
    pushNotice(`+${kg} kg added.`);
    await logActivity(`Restocked ${lst.name} +${kg}kg`, 'success');
  };

  const handleToggleStatus = async (listingId) => {
    const lst = listings.find(l => l.id === listingId);
    if (!lst) return;
    const next = lst.status === 'paused'
      ? (lst.stock_kg <= 90 ? 'low_stock' : 'active')
      : 'paused';
    const { error } = await supabase.from('listings').update({ status: next }).eq('id', listingId);
    if (error) { pushNotice(error.message, 'danger'); return; }
    setData(prev => ({ ...prev, listings: prev.listings.map(l => l.id === listingId ? { ...l, status: next } : l) }));
    pushNotice(`Listing is now ${next}.`, 'info');
  };

  const handleUpdatePrice = async (listingId, delta) => {
    const lst = listings.find(l => l.id === listingId);
    if (!lst) return;
    const newPrice = Math.max(1, lst.price_per_kg + delta);
    const { error } = await supabase.from('listings').update({ price_per_kg: newPrice }).eq('id', listingId);
    if (error) { pushNotice(error.message, 'danger'); return; }
    setData(prev => ({ ...prev, listings: prev.listings.map(l => l.id === listingId ? { ...l, price_per_kg: newPrice } : l) }));
    pushNotice(`Price updated to ${fmtDh(newPrice)}/kg.`);
  };

  /* ── Derived ─────────────────────────────────────────────────────────── */
  const filteredReqs = requests.filter(r => {
    if (requestFilter !== 'all' && r.status !== requestFilter) return false;
    if (requestSearch.trim()) {
      const q = requestSearch.trim().toLowerCase();
      return `${r.id} ${r.product_name} ${r.profiles?.full_name}`.toLowerCase().includes(q);
    }
    return true;
  });
  const visibleReqs   = showAllRequests ? filteredReqs : filteredReqs.slice(0, 6);
  const selectedReq   = requests.find(r => r.id === selectedRequestId) ?? null;
  const selectedLst   = listings.find(l => l.id === selectedListingId) ?? null;

  const activeListings  = listings.filter(l => l.status === 'active' || l.status === 'low_stock').length;
  const pendingReqs     = requests.filter(r => r.status === 'pending' || r.status === 'negotiating').length;
  const lowStockCount   = listings.filter(l => l.stock_kg <= 90 || l.status === 'low_stock').length;
  const estRevenue      = requests.filter(r => r.status === 'accepted').reduce((s, r) => s + Number(r.qty_kg) * Number(r.price_per_kg), 0);

  /* ── Render ──────────────────────────────────────────────────────────── */
  return (
    <div className="farmer-dashboard" style={pageStyle}>

      {/* Modals */}
      {showCreateFarm && (
        <CreateFarmModal
          userId={profile?.id ?? userId}
          onCreated={f => {
            setData(prev => ({ ...prev, farm: f })); setShowCreateFarm(false);
            pushNotice(`Farm "${f.name}" created! It will appear on the map.`);
            logActivity(`Created farm: ${f.name}`, 'success');
          }}
          onClose={() => setShowCreateFarm(false)}
        />
      )}
      {showAddProduct && farm && (
        <AddProductModal
          farmId={farm.id}
          farmerId={profile?.id ?? userId}
          onAdded={p => {
            setData(prev => ({ ...prev, products: [p, ...prev.products] }));
            setShowAddProduct(false);
            pushNotice(`"${p.name}" added to your farm!`);
            logActivity(`Added product: ${p.name}`, 'success');
            loadAll(); // reload listings too
          }}
          onClose={() => setShowAddProduct(false)}
        />
      )}

      {/* Hero */}
      <section className="farmer-hero">
        <div>
          <p className="farmer-hero__kicker">Farmer Dashboard</p>
          <h1>Welcome back, {displayName}!</h1>
          <p>Manage your farm, products, listings, and buyer requests.</p>
        </div>
        <div className="farmer-hero__actions">
          <span className="farmer-chip">Farmer</span>
          {farm && (
            <button type="button" className="dash-btn dash-btn--soft" onClick={() => navigateTo(`/farm/${farm.id}`)}>
              👁 View My Farm
            </button>
          )}
          <button type="button" className="farmer-button" onClick={() => setShowAddListing(v => !v)}>
            {showAddListing ? 'Close' : 'Add Listing'}
          </button>
          <button type="button" className="dash-btn dash-btn--soft" onClick={() => setManageListings(v => !v)}>
            {manageListings ? 'Done' : 'Manage Listings'}
          </button>
        </div>
      </section>

      {/* Notice */}
      {notice && (
        <div className={`dash-alert ${notice.type === 'danger' ? 'dash-alert--danger' : notice.type === 'warning' ? 'dash-alert--warning' : 'dash-alert--success'}`}>
          <span>{notice.msg}</span>
          <button type="button" className="dash-btn dash-btn--compact" onClick={() => setNotice(null)}>✕</button>
        </div>
      )}

      {/* Farm panel */}
      <div style={{ background: 'rgba(255,255,255,0.85)', borderRadius: 18, border: '1px solid #eadfce', padding: 20, boxShadow: '0 8px 20px rgba(32,40,32,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#6d7a6b', fontWeight: 600 }}>Your Farm</p>
            {loading ? (
              <p style={{ margin: '4px 0 0', color: '#888', fontSize: 14 }}>Loading…</p>
            ) : farm ? (
              <p style={{ margin: '4px 0 0', fontSize: 18, fontWeight: 700, color: '#223223' }}>
                {farm.name}
                <span style={{ marginLeft: 10, fontSize: 13, color: '#6d7a6b', fontWeight: 400 }}>{farm.city}</span>
              </p>
            ) : (
              <p style={{ margin: '4px 0 0', color: '#c08050', fontSize: 14 }}>
                No farm yet — create one to appear on the map and receive buyer orders.
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {!farm && !loading && (
              <button type="button" className="dash-btn dash-btn--primary" onClick={() => setShowCreateFarm(true)}>
                + Create My Farm
              </button>
            )}
            {farm && (
              <button type="button" className="dash-btn dash-btn--primary" onClick={() => setShowAddProduct(true)}>
                + Add Product
              </button>
            )}
          </div>
        </div>

        {/* Products list */}
        {farm && products.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#6d7a6b', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              Products ({products.length})
            </p>
            <div style={{ marginTop: 8, display: 'grid', gap: 6 }}>
              {products.map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fdfbf7', borderRadius: 10, padding: '8px 12px', border: '1px solid rgba(225,212,194,0.7)', fontSize: 13 }}>
                  <div>
                    <span style={{ fontWeight: 600, color: '#223223' }}>{p.name}</span>
                    <span style={{ marginLeft: 8, color: '#6d7a6b' }}>{p.category}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ color: '#4f7a46', fontWeight: 600 }}>{p.price_dh} DH/{p.unit}</span>
                    <span style={{ color: '#888', fontSize: 12 }}>{p.available} {p.unit} stock</span>
                    <span className={p.status === 'active' ? 'dash-status dash-status--success' : 'dash-status dash-status--info'}>{p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {farm && products.length === 0 && !loading && (
          <p style={{ margin: '12px 0 0', color: '#888', fontSize: 13 }}>No products yet. Click "+ Add Product" to add your first product.</p>
        )}
      </div>

      {/* Stats */}
      <section className="farmer-stats">
        <article>
          <h3>{data.products.length}</h3>
          <p>Products</p>
          <span>{data.farm ? 'Live on Supabase' : 'No farm yet'}</span>
        </article>
        <article>
          <h3>{data.listings.filter(l => l.status === 'active' || l.status === 'low_stock').length}</h3>
          <p>Active listings</p>
          <span>{data.listings.filter(l => l.stock_kg <= 90 || l.status === 'low_stock').length} low stock</span>
        </article>
        <article>
          <h3>{data.requests.filter(r => r.status === 'pending' || r.status === 'negotiating').length}</h3>
          <p>Pending requests</p>
          <span>{fmtDh(data.requests.filter(r => r.status === 'accepted').reduce((s, r) => s + Number(r.qty_kg) * Number(r.price_per_kg), 0))} confirmed</span>
        </article>
      </section>

      <section className="farmer-grid">

        {/* ── Requests panel ── */}
        <div className="farmer-panel">
          <div className="farmer-panel__header">
            <h2>Incoming Requests</h2>
            <button type="button" onClick={() => setShowAllRequests(v => !v)}>
              {showAllRequests ? 'Show Recent' : 'View All'}
            </button>
          </div>
          <div className="dash-panel-stack">
            <div className="dash-toolbar">
              <div className="dash-toolbar__group">
                <input className="dash-input farmer-panel__search" type="search" value={requestSearch}
                  onChange={e => setRequestSearch(e.target.value)} placeholder="Search request, buyer, product" />
                <select className="dash-select" value={requestFilter} onChange={e => setRequestFilter(e.target.value)}>
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="negotiating">Negotiating</option>
                  <option value="accepted">Accepted</option>
                  <option value="declined">Declined</option>
                </select>
              </div>
              <span className="dash-toolbar__meta">{filteredReqs.length} request{filteredReqs.length !== 1 ? 's' : ''}</span>
            </div>

            <div className="farmer-table">
              <div className="farmer-table__head">
                <span>Order ref</span><span>Product · Qty</span><span>Buyer</span><span>Total</span>
              </div>
              {visibleReqs.length ? visibleReqs.map(r => (
                <button key={r.id} type="button"
                  className={`farmer-table__row farmer-table__row--button${selectedRequestId === r.id ? ' is-active' : ''}`}
                  onClick={() => setSelectedRequestId(r.id)}>
                  <span className="farmer-table__id">
                    {r.order_item_id ? r.order_item_id.slice(0, 8) + '…' : r.id.slice(0, 8) + '…'}
                    <small className="farmer-table__sub">{fmtStamp(r.created_at)}</small>
                  </span>
                  <span>{r.product_name}<small className="farmer-table__sub">{fmtKg(r.qty_kg)} · {fmtDh(r.price_per_kg)}/kg</small></span>
                  <span>{r.profiles?.full_name ?? r.profiles?.email ?? 'Buyer'}<small className="farmer-table__sub">{r.status}</small></span>
                  <span className="farmer-table__qty">{fmtDh(r.qty_kg * r.price_per_kg)}</span>
                </button>
              )) : (
                <div className="dash-empty">No requests yet. They appear here when buyers confirm an order.</div>
              )}
            </div>

            {selectedReq && (
              <div className="dash-section" key={selectedReq.id}>
                <div className="dash-toolbar">
                  <div>
                    <p className="dash-section__title">{selectedReq.product_name}</p>
                    <p className="dash-section__subtitle">
                      Buyer: {selectedReq.profiles?.full_name ?? selectedReq.profiles?.email ?? '—'} ·
                      {selectedReq.order_item_id ? ` Order ref: ${selectedReq.order_item_id.slice(0, 8)}…` : ''} ·
                      Delivery: {selectedReq.delivery_window ?? '—'}
                    </p>
                  </div>
                  <span className={statusCls(selectedReq.status)}>{selectedReq.status}</span>
                </div>
                <div className="farmer-request-detail__meta">
                  <span>Qty: {fmtKg(selectedReq.qty_kg)}</span>
                  <span>Price: {fmtDh(selectedReq.price_per_kg)}/unit</span>
                  <span>Total: {fmtDh(selectedReq.qty_kg * selectedReq.price_per_kg)}</span>
                </div>
                {selectedReq.note && <p className="dash-inline-note">{selectedReq.note}</p>}
                {selectedReq.status === 'accepted' && (
                  <p style={{ color: '#4f7a46', fontWeight: 600, fontSize: 13, margin: '8px 0 0' }}>
                    ✓ Accepted — the buyer can now proceed to payment.
                  </p>
                )}
                {selectedReq.status === 'declined' && (
                  <p style={{ color: '#c0392b', fontWeight: 600, fontSize: 13, margin: '8px 0 0' }}>
                    ✗ You declined this request.
                  </p>
                )}
                {!['accepted', 'declined'].includes(selectedReq.status) && (
                  <div className="dash-form-actions">
                    <button type="button" className="dash-btn dash-btn--success"
                      onClick={() => handleRequestAction(selectedReq.id, 'accepted')}>Accept</button>
                    <button type="button" className="dash-btn dash-btn--danger"
                      onClick={() => handleRequestAction(selectedReq.id, 'declined')}>Decline</button>
                    <label className="dash-label farmer-request-detail__counter">
                      Counter offer (DH/unit)
                      <input className="dash-input" type="number" min="1" value={counterOffer}
                        onChange={e => setCounterOffer(e.target.value)} />
                    </label>
                    <button type="button" className="dash-btn"
                      onClick={() => handleRequestAction(selectedReq.id, 'negotiating', { price_per_kg: parseFloat(counterOffer) || selectedReq.price_per_kg })}>
                      Send Counter
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Listings panel ── */}
        <div className="farmer-panel">
          <div className="farmer-panel__header">
            <h2>Listings</h2>
            <button type="button" onClick={() => setManageListings(v => !v)}>
              {manageListings ? 'Done' : 'Manage'}
            </button>
          </div>
          <div className="dash-panel-stack">
            <div className="farmer-listings">
              {listings.length ? listings.map(l => (
                <button key={l.id} type="button"
                  className={`farmer-listings__item farmer-listings__item--button${selectedListingId === l.id ? ' is-active' : ''}`}
                  onClick={() => setSelectedListingId(l.id)}>
                  <div>
                    <p className="farmer-listings__name">{l.name}</p>
                    <p className="farmer-listings__stock">{fmtKg(l.stock_kg)} · {fmtDh(l.price_per_kg)}/kg</p>
                  </div>
                  <span className={statusCls(l.status)}>{l.status}</span>
                </button>
              )) : (
                <div className="dash-empty">No listings yet. Add a product to automatically create a listing.</div>
              )}
            </div>

            {selectedLst && (
              <div className="dash-section" key={selectedLst.id}>
                <div className="dash-toolbar">
                  <div>
                    <p className="dash-section__title">{selectedLst.name}</p>
                    <p className="dash-section__subtitle">{selectedLst.category} · Updated {fmtStamp(selectedLst.updated_at)}</p>
                  </div>
                  <span className={statusCls(selectedLst.status)}>{selectedLst.status}</span>
                </div>
                <div className="farmer-request-detail__meta">
                  <span>Stock: {fmtKg(selectedLst.stock_kg)}</span>
                  <span>Price: {fmtDh(selectedLst.price_per_kg)}/kg</span>
                </div>
                <div className="dash-form-actions">
                  <button type="button" className="dash-btn dash-btn--success" onClick={() => handleRestock(selectedLst.id, 25)}>+25 kg</button>
                  <button type="button" className="dash-btn dash-btn--success" onClick={() => handleRestock(selectedLst.id, 50)}>+50 kg</button>
                  <button type="button" className="dash-btn" onClick={() => handleUpdatePrice(selectedLst.id, 1)}>+1 DH/kg</button>
                  <button type="button" className="dash-btn" onClick={() => handleUpdatePrice(selectedLst.id, -1)}>−1 DH/kg</button>
                  <button type="button" className="dash-btn dash-btn--soft" onClick={() => handleToggleStatus(selectedLst.id)}>
                    {selectedLst.status === 'paused' ? 'Resume listing' : 'Pause listing'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </section>
    </div>
  );
};

export default FarmerDashboardPage;