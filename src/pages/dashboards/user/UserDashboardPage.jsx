import { useMemo, useState } from 'react';
import fieldsImage from '../../../assets/images/home-fields.png';
import heroImage from '../../../assets/images/home-hero.png';
import { products } from '../../../data/products';
import { farms } from '../../../data/farms';
import { navigateTo } from '../../../app/navigation';
import { useAuth } from '../../../app/providers/AuthProvider';
import { cartAdd } from '../../../app/providers/CartProvider';
import { DEMO_ORDERS } from '../../../data/seedData';
import '../dashboard-ui.css';
import './UserDashboardPage.css';

const formatDh = v => `${new Intl.NumberFormat('fr-MA').format(Math.round(v))} DH`;
const formatStamp = iso => { try { return new Intl.DateTimeFormat('en-GB',{month:'short',day:'2-digit',hour:'2-digit',minute:'2-digit'}).format(new Date(iso)); } catch{return iso;} };
const parsePriceValue = p => { const n=Number.parseFloat(String(p).replace(/[^\d.]/g,'')); return Number.isFinite(n)?n:0; };
const getStatusClass = s => {
  if(s==='Delivered') return 'dash-status dash-status--success';
  if(s==='Cancelled') return 'dash-status dash-status--danger';
  if(s==='In Transit') return 'dash-status dash-status--info';
  return 'dash-status dash-status--warning';
};
const STATUS_FLOW = ['Preparing','In Transit','Delivered'];

const ORDERS_KEY='soukfalah-orders';
const FAV_KEY='soukfalah-favorites';
const readOrders=()=>{try{return JSON.parse(localStorage.getItem(ORDERS_KEY)||'[]');}catch{return [];}};
const writeOrders=o=>{try{localStorage.setItem(ORDERS_KEY,JSON.stringify(o));}catch{}};
const readFavorites=()=>{try{return JSON.parse(localStorage.getItem(FAV_KEY)||'[]');}catch{return [];}};
const writeFavorites=f=>{try{localStorage.setItem(FAV_KEY,JSON.stringify(f));}catch{}};

const normaliseOrder = o => ({
  id: o.id,
  farm: o.items?.[0]?.farmer || o.farm || 'Farm',
  farmLocation: o.shipping?.address || '',
  product: o.items?.map(i=>i.name).join(', ') || o.product || '',
  quantity: o.items?.reduce((s,i)=>s+i.quantity,0) || o.quantity || 1,
  status: o.status || 'Preparing',
  payment: o.payment==='cash'?'Cash on Delivery':'Card',
  totalDh: Number(o.total??o.totalDh??0),
  createdAt: o.createdAt||new Date().toISOString(),
  eta: o.eta||'Soon',
  items: o.items||[],
});

let _act=1;
const mkAct=(text,kind='info')=>({id:`act-${_act+=1}`,text,kind,createdAt:new Date().toISOString()});

const UserDashboardPage = () => {
  const { fullName, username } = useAuth();
  const displayName = fullName || username || 'there';

  const pageStyle={ '--buyer-hero-image':`url(${heroImage})`,'--buyer-fields-image':`url(${fieldsImage})` };

  const [orders,setOrders]=useState(()=>readOrders().map(normaliseOrder));
  const [favorites,setFavorites]=useState(readFavorites);
  const [activity,setActivity]=useState([mkAct('Dashboard opened')]);
  const [notice,setNotice]=useState(null);
  const [selectedOrderId,setSelectedOrderId]=useState(()=>readOrders().map(normaliseOrder)[0]?.id||null);
  const [orderStatusFilter,setOrderStatusFilter]=useState('all');
  const [orderSearch,setOrderSearch]=useState('');
  const [showAllOrders,setShowAllOrders]=useState(false);
  const [showComposer,setShowComposer]=useState(false);
  const [showFavManager,setShowFavManager]=useState(false);
  const [farmToAdd,setFarmToAdd]=useState('');
  const [favLocationFilter,setFavLocationFilter]=useState('all');
  const [draftOrder,setDraftOrder]=useState({productId:products[0]?.id||'',quantity:'5',priority:'standard'});

  const pushNotice=(msg,type='success')=>setNotice({id:Date.now(),msg,type});
  const pushActivity=(text,kind='info')=>setActivity(p=>[mkAct(text,kind),...p].slice(0,8));
  const saveOrders=updated=>{setOrders(updated);writeOrders(updated);};

  const filteredOrders=useMemo(()=>orders.filter(o=>{
    if(orderStatusFilter!=='all'&&o.status!==orderStatusFilter) return false;
    if(orderSearch.trim()){const q=orderSearch.trim().toLowerCase();return `${o.id} ${o.farm} ${o.product}`.toLowerCase().includes(q);}
    return true;
  }),[orders,orderStatusFilter,orderSearch]);

  const displayedOrders=showAllOrders?filteredOrders:filteredOrders.slice(0,6);
  const selectedOrder=orders.find(o=>o.id===selectedOrderId)||displayedOrders[0]||null;
  const visibleFavorites=favorites.filter(f=>favLocationFilter==='all'||f.location===favLocationFilter);
  const availableFarms=farms.filter(f=>!favorites.some(fav=>fav.name===f.name));

  const activeOrders=orders.filter(o=>o.status!=='Cancelled').length;
  const pendingOrders=orders.filter(o=>['Preparing','In Transit'].includes(o.status)).length;
  const deliveredOrders=orders.filter(o=>o.status==='Delivered').length;
  const totalSpend=orders.filter(o=>o.status!=='Cancelled').reduce((s,o)=>s+o.totalDh,0);

  const handleAdvanceOrder=()=>{
    if(!selectedOrder) return;
    if(['Delivered','Cancelled'].includes(selectedOrder.status)){pushNotice('Cannot advance this order.','warning');return;}
    const idx=STATUS_FLOW.indexOf(selectedOrder.status);
    const next=STATUS_FLOW[Math.min(idx+1,STATUS_FLOW.length-1)];
    const updated=orders.map(o=>o.id===selectedOrder.id?{...o,status:next,eta:next==='Delivered'?'Delivered':'Today'}:o);
    saveOrders(updated);
    pushActivity(`${selectedOrder.id} → ${next}`,'info');
    pushNotice(`Order ${selectedOrder.id} moved to ${next}.`);
  };

  const handleCancelOrder=()=>{
    if(!selectedOrder) return;
    if(['Delivered','Cancelled'].includes(selectedOrder.status)){pushNotice('Cannot cancel.','warning');return;}
    const updated=orders.map(o=>o.id===selectedOrder.id?{...o,status:'Cancelled',eta:'Cancelled'}:o);
    saveOrders(updated);
    pushActivity(`Cancelled ${selectedOrder.id}`,'danger');
    pushNotice(`Order ${selectedOrder.id} cancelled.`,'danger');
  };

  const handleReorder=()=>{
    if(!selectedOrder) return;
    if(selectedOrder.items?.length){
      selectedOrder.items.forEach(item=>{
        cartAdd({id:item.id,name:item.name,price:item.price,unit:item.unit,accent:item.accent,farmer:{name:item.farmer}},item.quantity);
      });
      pushNotice('Items added to cart!','success');
      pushActivity(`Reordered from ${selectedOrder.id}`,'success');
    } else {
      pushNotice('Nothing to reorder.','warning');
    }
  };

  const handleCreateOrder=e=>{
    e.preventDefault();
    const product=products.find(p=>p.id===draftOrder.productId);
    const quantity=Math.max(1,parseInt(draftOrder.quantity,10)||1);
    if(!product){pushNotice('Select a product.','warning');return;}
    const newOrder={
      id:`SO-${Date.now()}`,
      farm:product.farmer.name,farmLocation:product.farmer.location,
      product:product.name,quantity,
      status:draftOrder.priority==='express'?'In Transit':'Preparing',
      payment:'Card',
      totalDh:parsePriceValue(product.price)*quantity||1,
      createdAt:new Date().toISOString(),
      eta:draftOrder.priority==='express'?'Today 20:00':'Tomorrow',
      items:[{id:product.id,name:product.name,price:parsePriceValue(product.price),unit:product.unit,quantity,accent:product.accent,farmer:product.farmer.name}],
    };
    const updated=[newOrder,...orders];
    saveOrders(updated);
    setSelectedOrderId(newOrder.id);
    setShowComposer(false);
    pushActivity(`Created ${newOrder.id} for ${newOrder.product}`,'success');
    pushNotice(`Order ${newOrder.id} created.`);
  };

  const handleAddFavorite=()=>{
    const farm=farms.find(f=>f.id===farmToAdd);
    if(!farm){pushNotice('Choose a farm.','warning');return;}
    if(favorites.some(f=>f.name===farm.name)){pushNotice('Already in favorites.','warning');return;}
    const fav={id:`fav-${farm.id}`,name:farm.name,location:farm.location,category:farm.products[0]?.name||'Produce',rating:4.7};
    const updated=[fav,...favorites];
    setFavorites(updated);writeFavorites(updated);
    setFarmToAdd('');
    pushNotice(`${farm.name} added.`);
  };

  const handleRemoveFavorite=id=>{
    const updated=favorites.filter(f=>f.id!==id);
    setFavorites(updated);writeFavorites(updated);
    pushNotice('Removed.','info');
  };

  return (
    <div className="buyer-dashboard" style={pageStyle}>
      <section className="buyer-hero">
        <div>
          <p className="buyer-hero__kicker">Buyer Dashboard</p>
          <h1>Welcome back, {displayName}!</h1>
          <p>Manage your orders, track deliveries, and keep favorite farms close.</p>
        </div>
        <div className="buyer-hero__actions">
          <span className="buyer-chip">Buyer</span>
          <button type="button" className="buyer-button" onClick={()=>setShowComposer(v=>!v)}>
            {showComposer?'Close Form':'New Order'}
          </button>
          <button type="button" className="dash-btn dash-btn--soft" onClick={()=>navigateTo('/marketplace')}>Browse Marketplace</button>
        </div>
      </section>

      {notice&&<div className={`dash-alert ${notice.type==='danger'?'dash-alert--danger':notice.type==='warning'?'dash-alert--warning':'dash-alert--success'}`}>
        <span>{notice.msg}</span>
        <button type="button" className="dash-btn dash-btn--compact" onClick={()=>setNotice(null)}>Dismiss</button>
      </div>}

      {orders.length===0&&(
        <div className="dash-alert dash-alert--warning" style={{display:'flex',alignItems:'center',gap:'1rem'}}>
          <span>No orders yet. Load demo data to test all features, or go place a real order!</span>
          <button type="button" className="dash-btn dash-btn--primary" onClick={()=>{
            const seeded=DEMO_ORDERS.map(normaliseOrder);
            saveOrders(seeded);
            setSelectedOrderId(seeded[0]?.id||null);
            pushNotice('Demo orders loaded! You can now test the dashboard.');
          }}>Load Demo Data</button>
          <button type="button" className="dash-btn" onClick={()=>navigateTo('/marketplace')}>Shop Now →</button>
        </div>
      )}

      <section className="buyer-stats">
        <article><h3>{activeOrders}</h3><p>Tracked orders</p><span>{pendingOrders} active</span></article>
        <article><h3>{favorites.length}</h3><p>Favorite farms</p><span>{availableFarms.length} more available</span></article>
        <article><h3>{formatDh(totalSpend)}</h3><p>Total spend</p><span>{deliveredOrders} delivered</span></article>
      </section>

      <section className="buyer-grid">
        <div className="buyer-panel">
          <div className="buyer-panel__header">
            <h2>Order Workspace</h2>
            <button type="button" onClick={()=>setShowAllOrders(v=>!v)}>{showAllOrders?'Show Recent':'View All'}</button>
          </div>
          <div className="dash-panel-stack">
            <div className="dash-toolbar buyer-panel__toolbar">
              <div className="dash-toolbar__group buyer-panel__toolbar-group">
                <input className="dash-input buyer-panel__search" type="search" value={orderSearch} onChange={e=>setOrderSearch(e.target.value)} placeholder="Search order, farm, product"/>
                <select className="dash-select" value={orderStatusFilter} onChange={e=>setOrderStatusFilter(e.target.value)}>
                  <option value="all">All statuses</option>
                  <option value="Preparing">Preparing</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <span className="dash-toolbar__meta buyer-panel__toolbar-meta">{filteredOrders.length} order{filteredOrders.length!==1?'s':''}</span>
            </div>

            <div className="buyer-table">
              <div className="buyer-table__head">
                <span>Order</span><span>Farm</span><span>Status</span><span>Total</span>
              </div>
              {displayedOrders.length ? displayedOrders.map(o=>(
                <button key={o.id} type="button"
                  className={`buyer-table__row buyer-table__row--button${selectedOrderId===o.id?' is-active':''}`}
                  onClick={()=>setSelectedOrderId(o.id)}>
                  <span className="buyer-table__id">{o.id}</span>
                  <span>{o.farm}<small className="buyer-table__sub">{o.product}</small></span>
                  <span className={getStatusClass(o.status)}>{o.status}</span>
                  <span className="buyer-table__total">{formatDh(o.totalDh)}</span>
                </button>
              )) : (
                <div className="dash-empty">
                  No orders yet.{' '}
                  <button type="button" style={{textDecoration:'underline',background:'none',border:'none',cursor:'pointer',color:'inherit'}}
                    onClick={()=>navigateTo('/marketplace')}>Browse the marketplace →</button>
                </div>
              )}
            </div>

            {selectedOrder&&(
              <div className="dash-section">
                <div className="dash-toolbar">
                  <div>
                    <p className="dash-section__title">{selectedOrder.id} | {selectedOrder.product}</p>
                    <p className="dash-section__subtitle">{selectedOrder.farm} · {selectedOrder.quantity} units · {selectedOrder.payment}</p>
                  </div>
                  <span className={getStatusClass(selectedOrder.status)}>{selectedOrder.status}</span>
                </div>
                <div className="buyer-order-detail__meta">
                  <span>Placed: {formatStamp(selectedOrder.createdAt)}</span>
                  <span>ETA: {selectedOrder.eta}</span>
                  <span>Total: {formatDh(selectedOrder.totalDh)}</span>
                </div>
                <div className="dash-form-actions">
                  <button type="button" className="dash-btn dash-btn--primary" onClick={handleAdvanceOrder}>Advance Status</button>
                  <button type="button" className="dash-btn" onClick={handleReorder}>Reorder</button>
                  <button type="button" className="dash-btn dash-btn--danger" onClick={handleCancelOrder}>Cancel Order</button>
                  <button type="button" className="dash-btn dash-btn--soft" onClick={()=>navigateTo('/cart')}>Open Cart</button>
                </div>
              </div>
            )}

            {showComposer&&(
              <form className="dash-section" onSubmit={handleCreateOrder}>
                <p className="dash-section__title">Create New Order</p>
                <div className="dash-field-grid">
                  <label className="dash-label">Product
                    <select className="dash-select" value={draftOrder.productId} onChange={e=>setDraftOrder(p=>({...p,productId:e.target.value}))}>
                      {products.map(p=><option key={p.id} value={p.id}>{p.name} ({p.price}/{p.unit})</option>)}
                    </select>
                  </label>
                  <label className="dash-label">Quantity
                    <input className="dash-input" type="number" min="1" value={draftOrder.quantity} onChange={e=>setDraftOrder(p=>({...p,quantity:e.target.value}))}/>
                  </label>
                  <label className="dash-label">Priority
                    <select className="dash-select" value={draftOrder.priority} onChange={e=>setDraftOrder(p=>({...p,priority:e.target.value}))}>
                      <option value="standard">Standard</option>
                      <option value="express">Express</option>
                    </select>
                  </label>
                </div>
                <div className="dash-form-actions">
                  <button type="submit" className="dash-btn dash-btn--primary">Create Order</button>
                  <button type="button" className="dash-btn" onClick={()=>setShowComposer(false)}>Close</button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="buyer-panel">
          <div className="buyer-panel__header">
            <h2>Favorite Farms</h2>
            <button type="button" onClick={()=>setShowFavManager(v=>!v)}>{showFavManager?'Done':'Manage'}</button>
          </div>
          <div className="dash-panel-stack">
            <div className="dash-toolbar buyer-favorites__toolbar">
              <div className="dash-toolbar__group buyer-favorites__controls">
                <select className="dash-select" value={favLocationFilter} onChange={e=>setFavLocationFilter(e.target.value)}>
                  <option value="all">All cities</option>
                  {[...new Set(favorites.map(f=>f.location))].map(c=><option key={c} value={c}>{c}</option>)}
                </select>
                <select className="dash-select" value={farmToAdd} onChange={e=>setFarmToAdd(e.target.value)}>
                  <option value="">Add a farm…</option>
                  {availableFarms.map(f=><option key={f.id} value={f.id}>{f.name} ({f.location})</option>)}
                </select>
                <button type="button" className="dash-btn dash-btn--success" onClick={handleAddFavorite} disabled={!farmToAdd}>Add</button>
              </div>
            </div>

            <div className="buyer-favorites">
              {visibleFavorites.length ? visibleFavorites.map(f=>(
                <div key={f.id} className="buyer-favorites__item buyer-favorites__item--rich">
                  <div className="buyer-favorites__content">
                    <p className="buyer-favorites__name">{f.name}</p>
                    <p className="buyer-favorites__location">{f.location}</p>
                    {f.category&&<span className="dash-status dash-status--info">{f.category}</span>}
                  </div>
                  <div className="buyer-favorites__actions">
                    {f.rating&&<span className="buyer-rating">{Number(f.rating).toFixed(1)}</span>}
                    <button type="button" className="dash-btn dash-btn--compact" onClick={()=>navigateTo('/map')}>Map</button>
                    {showFavManager&&<button type="button" className="dash-btn dash-btn--compact dash-btn--danger" onClick={()=>handleRemoveFavorite(f.id)}>Remove</button>}
                  </div>
                </div>
              )) : <div className="dash-empty">No favorites yet.</div>}
            </div>

            <div className="dash-section">
              <p className="dash-section__title">Recent Activity</p>
              <div className="dash-log">
                {activity.map(e=>(
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

export default UserDashboardPage;