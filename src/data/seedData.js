/**
 * seedData.js
 * Call seedAll() from the browser console to fill localStorage with demo data.
 * Or import and call it from a component.
 */

export const DEMO_PRODUCTS = [
  { id: 'fresh-tomatoes', name: 'Organic Tomatoes', price: 15, unit: 'kg', accent: '#d96a54', farmer: 'Hamid Merabet' },
  { id: 'organic-apples', name: 'Organic Apples',   price: 12, unit: 'kg', accent: '#d9b96f', farmer: 'Amina Idrissi' },
  { id: 'ripe-strawberries', name: 'Ripe Strawberries', price: 20, unit: 'kg', accent: '#d86a89', farmer: 'Karima Zouali' },
  { id: 'crisp-lettuce', name: 'Crisp Lettuce',     price: 8,  unit: 'kg', accent: '#7fa96b', farmer: 'Youssef Naji'  },
  { id: 'fresh-mint',    name: 'Fresh Mint',        price: 5,  unit: 'bunch', accent: '#4aad8b', farmer: 'Rachid Benali' },
];

export const DEMO_ORDERS = [
  {
    id: 'SO-001',
    status: 'Delivered',
    payment: 'card',
    total: 180,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    eta: 'Delivered',
    items: [
      { id: 'fresh-tomatoes', name: 'Organic Tomatoes', price: 15, unit: 'kg', quantity: 8, accent: '#d96a54', farmer: 'Hamid Merabet' },
      { id: 'crisp-lettuce',  name: 'Crisp Lettuce',    price: 8,  unit: 'kg', quantity: 6, accent: '#7fa96b', farmer: 'Youssef Naji'  },
      { id: 'fresh-mint',     name: 'Fresh Mint',       price: 5,  unit: 'bunch', quantity: 6, accent: '#4aad8b', farmer: 'Rachid Benali' },
    ],
    shipping: { fullName: 'Test User', email: 'test@soukfellah.ma', address: 'Agadir', phone: '0600000001' },
  },
  {
    id: 'SO-002',
    status: 'In Transit',
    payment: 'card',
    total: 260,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    eta: 'Today 18:00',
    items: [
      { id: 'organic-apples',    name: 'Organic Apples',    price: 12, unit: 'kg', quantity: 10, accent: '#d9b96f', farmer: 'Amina Idrissi'  },
      { id: 'ripe-strawberries', name: 'Ripe Strawberries', price: 20, unit: 'kg', quantity: 5,  accent: '#d86a89', farmer: 'Karima Zouali' },
      { id: 'fresh-mint',        name: 'Fresh Mint',        price: 5,  unit: 'bunch', quantity: 8, accent: '#4aad8b', farmer: 'Rachid Benali' },
      { id: 'fresh-tomatoes',    name: 'Organic Tomatoes',  price: 15, unit: 'kg', quantity: 4,  accent: '#d96a54', farmer: 'Hamid Merabet' },
    ],
    shipping: { fullName: 'Test User', email: 'test@soukfellah.ma', address: 'Agadir', phone: '0600000001' },
  },
  {
    id: 'SO-003',
    status: 'Preparing',
    payment: 'cash',
    total: 95,
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    eta: 'Tomorrow',
    items: [
      { id: 'fresh-tomatoes', name: 'Organic Tomatoes', price: 15, unit: 'kg', quantity: 5, accent: '#d96a54', farmer: 'Hamid Merabet' },
      { id: 'crisp-lettuce',  name: 'Crisp Lettuce',    price: 8,  unit: 'kg', quantity: 4, accent: '#7fa96b', farmer: 'Youssef Naji'  },
      { id: 'fresh-mint',     name: 'Fresh Mint',       price: 5,  unit: 'bunch', quantity: 3, accent: '#4aad8b', farmer: 'Rachid Benali' },
    ],
    shipping: { fullName: 'Test User', email: 'test@soukfellah.ma', address: 'Agadir', phone: '0600000001' },
  },
];

export const DEMO_LISTINGS = [
  { id: 'LIST-01', name: 'Organic Tomatoes',  stockKg: 240, status: 'Active',    category: 'Vegetables', pricePerKg: 15, updatedAt: new Date().toISOString() },
  { id: 'LIST-02', name: 'Ripe Strawberries', stockKg: 75,  status: 'Low Stock', category: 'Fruits',     pricePerKg: 20, updatedAt: new Date().toISOString() },
  { id: 'LIST-03', name: 'Fresh Mint',        stockKg: 160, status: 'Active',    category: 'Herbs',      pricePerKg: 5,  updatedAt: new Date().toISOString() },
];

export const DEMO_REQUESTS = [
  { id: 'REQ-001', product: 'Organic Tomatoes', buyer: 'buyer', qtyKg: 50,  pricePerKg: 14, status: 'Pending',    deliveryWindow: 'Tomorrow morning', note: 'Need clean packaging', createdAt: new Date(Date.now()-3600000).toISOString() },
  { id: 'REQ-002', product: 'Fresh Mint',       buyer: 'buyer', qtyKg: 30,  pricePerKg: 5,  status: 'Negotiating',deliveryWindow: 'Wednesday afternoon', note: 'Restaurant supply', createdAt: new Date(Date.now()-7200000).toISOString() },
  { id: 'REQ-003', product: 'Ripe Strawberries',buyer: 'buyer', qtyKg: 20,  pricePerKg: 18, status: 'Accepted',   deliveryWindow: 'Today 18:00',       note: '',                  createdAt: new Date(Date.now()-86400000).toISOString() },
];

export const seedAll = () => {
  localStorage.setItem('soukfalah-orders',   JSON.stringify(DEMO_ORDERS));
  localStorage.setItem('soukfalah-listings', JSON.stringify(DEMO_LISTINGS));
  localStorage.setItem('soukfalah-requests', JSON.stringify(DEMO_REQUESTS));
  console.log('[SoukFellah] ✅ Seed data loaded. Refresh the page.');
  return 'Done! Refresh the page now.';
};

export const clearAll = () => {
  ['soukfalah-orders','soukfalah-listings','soukfalah-requests','soukfalah-cart','soukfalah-favorites'].forEach(k=>localStorage.removeItem(k));
  console.log('[SoukFellah] 🗑️ All data cleared.');
  return 'Cleared! Refresh the page now.';
};