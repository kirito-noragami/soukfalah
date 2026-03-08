/**
 * seedData.js
 * Demo data for the Midelt Atlas farm (owned by the `farmer` demo account).
 *
 * Association:
 *   farmer account (username: 'farmer') → farm-midelt-apples → 5 products
 *   3 demo orders (buyer perspective)
 *   5 listings   (farmer perspective — one per product)
 *   3 requests   (incoming buyer requests for the farmer)
 */

// ── Orders (buyer sees these in their dashboard) ─────────────────────────────
export const DEMO_ORDERS = [
  {
    id: 'SO-001',
    status: 'Delivered',
    payment: 'card',
    total: 184,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    eta: 'Delivered',
    items: [
      { id: 'midelt-apples',  name: 'Atlas Apples',   price: 11, unit: 'kg',  quantity: 8, accent: '#c8b45a', farmer: 'Youssef Atlas' },
      { id: 'midelt-pears',   name: 'Atlas Pears',    price: 14, unit: 'kg',  quantity: 4, accent: '#a8c87e', farmer: 'Youssef Atlas' },
      { id: 'midelt-honey',   name: 'Atlas Blossom Honey', price: 80, unit: 'jar', quantity: 1, accent: '#d4a843', farmer: 'Youssef Atlas' },
    ],
    shipping: { fullName: 'Demo Buyer', email: 'buyer@soukfellah.ma', address: 'Agadir, Souss-Massa', phone: '0600000001' },
  },
  {
    id: 'SO-002',
    status: 'In Transit',
    payment: 'card',
    total: 269,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    eta: 'Today 18:00',
    items: [
      { id: 'midelt-golden-apples', name: 'Golden Apples',     price: 13, unit: 'kg', quantity: 10, accent: '#dfc55c', farmer: 'Youssef Atlas' },
      { id: 'midelt-walnuts',       name: 'Mountain Walnuts',  price: 45, unit: 'kg', quantity: 3,  accent: '#a87c50', farmer: 'Youssef Atlas' },
      { id: 'midelt-apples',        name: 'Atlas Apples',      price: 11, unit: 'kg', quantity: 4,  accent: '#c8b45a', farmer: 'Youssef Atlas' },
    ],
    shipping: { fullName: 'Demo Buyer', email: 'buyer@soukfellah.ma', address: 'Agadir, Souss-Massa', phone: '0600000001' },
  },
  {
    id: 'SO-003',
    status: 'Preparing',
    payment: 'cash',
    total: 117,
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    eta: 'Tomorrow',
    items: [
      { id: 'midelt-apples', name: 'Atlas Apples', price: 11, unit: 'kg',  quantity: 5, accent: '#c8b45a', farmer: 'Youssef Atlas' },
      { id: 'midelt-pears',  name: 'Atlas Pears',  price: 14, unit: 'kg',  quantity: 3, accent: '#a8c87e', farmer: 'Youssef Atlas' },
      { id: 'midelt-honey',  name: 'Atlas Blossom Honey', price: 80, unit: 'jar', quantity: 1, accent: '#d4a843', farmer: 'Youssef Atlas' },
    ],
    shipping: { fullName: 'Demo Buyer', email: 'buyer@soukfellah.ma', address: 'Agadir, Souss-Massa', phone: '0600000001' },
  },
];

// ── Listings (farmer sees these in their dashboard) ──────────────────────────
export const DEMO_LISTINGS = [
  { id: 'LIST-01', name: 'Atlas Apples',       productId: 'midelt-apples',        farmId: 'farm-midelt-apples', stockKg: 320, status: 'Active',    category: 'Fruits',  pricePerKg: 11, updatedAt: new Date().toISOString() },
  { id: 'LIST-02', name: 'Golden Apples',       productId: 'midelt-golden-apples', farmId: 'farm-midelt-apples', stockKg: 180, status: 'Active',    category: 'Fruits',  pricePerKg: 13, updatedAt: new Date().toISOString() },
  { id: 'LIST-03', name: 'Atlas Pears',         productId: 'midelt-pears',         farmId: 'farm-midelt-apples', stockKg: 140, status: 'Active',    category: 'Fruits',  pricePerKg: 14, updatedAt: new Date().toISOString() },
  { id: 'LIST-04', name: 'Mountain Walnuts',    productId: 'midelt-walnuts',       farmId: 'farm-midelt-apples', stockKg: 90,  status: 'Low Stock', category: 'Nuts',    pricePerKg: 45, updatedAt: new Date().toISOString() },
  { id: 'LIST-05', name: 'Atlas Blossom Honey', productId: 'midelt-honey',         farmId: 'farm-midelt-apples', stockKg: 60,  status: 'Low Stock', category: 'Others',  pricePerKg: 80, updatedAt: new Date().toISOString() },
];

// ── Requests (buyer requests that the farmer needs to respond to) ─────────────
export const DEMO_REQUESTS = [
  {
    id: 'REQ-001', product: 'Atlas Apples',   productId: 'midelt-apples',
    buyer: 'buyer', farmId: 'farm-midelt-apples',
    qtyKg: 50, pricePerKg: 10,
    status: 'Pending',
    deliveryWindow: 'Tomorrow morning',
    note: 'Need clean, sorted packaging — restaurant delivery.',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'REQ-002', product: 'Mountain Walnuts', productId: 'midelt-walnuts',
    buyer: 'buyer', farmId: 'farm-midelt-apples',
    qtyKg: 20, pricePerKg: 42,
    status: 'Negotiating',
    deliveryWindow: 'Wednesday afternoon',
    note: 'Bulk supply for patisserie — discuss weekly contract.',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'REQ-003', product: 'Atlas Blossom Honey', productId: 'midelt-honey',
    buyer: 'buyer', farmId: 'farm-midelt-apples',
    qtyKg: 15, pricePerKg: 78,
    status: 'Accepted',
    deliveryWindow: 'Today 18:00',
    note: '',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

// ── Seed helpers ──────────────────────────────────────────────────────────────
export const seedAll = () => {
  localStorage.setItem('soukfalah-orders',   JSON.stringify(DEMO_ORDERS));
  localStorage.setItem('soukfalah-listings', JSON.stringify(DEMO_LISTINGS));
  localStorage.setItem('soukfalah-requests', JSON.stringify(DEMO_REQUESTS));
  console.log('[SoukFellah] ✅ Seed data loaded. Refresh the page.');
  return 'Done! Refresh the page now.';
};

export const clearAll = () => {
  ['soukfalah-orders','soukfalah-listings','soukfalah-requests','soukfalah-cart','soukfalah-favorites'].forEach(k => localStorage.removeItem(k));
  console.log('[SoukFellah] 🗑️ All data cleared. Refresh.');
  return 'Cleared!';
};

// Legacy export (used by older components)
export const DEMO_PRODUCTS = [
  { id: 'midelt-apples',        name: 'Atlas Apples',         price: 11, unit: 'kg',  accent: '#c8b45a', farmer: 'Youssef Atlas' },
  { id: 'midelt-golden-apples', name: 'Golden Apples',        price: 13, unit: 'kg',  accent: '#dfc55c', farmer: 'Youssef Atlas' },
  { id: 'midelt-pears',         name: 'Atlas Pears',          price: 14, unit: 'kg',  accent: '#a8c87e', farmer: 'Youssef Atlas' },
  { id: 'midelt-walnuts',       name: 'Mountain Walnuts',     price: 45, unit: 'kg',  accent: '#a87c50', farmer: 'Youssef Atlas' },
  { id: 'midelt-honey',         name: 'Atlas Blossom Honey',  price: 80, unit: 'jar', accent: '#d4a843', farmer: 'Youssef Atlas' },
];