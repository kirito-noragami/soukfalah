/**
 * farms.js
 *
 * Each farm has:
 *  - farmerUsername : matches the auth account that owns it
 *  - products[]     : each product has an `id` matching products.js
 *
 * Association chain:
 *   Auth account (farmer) → farm.farmerUsername
 *   Farm products          → products.js (via product.id)
 *   Buyer                 → visits /farm/:id, adds to cart, checks out
 */

export const farms = [
  // ── DEMO FARM — fully wired ────────────────────────────────────────────────
  {
    id: 'farm-midelt-apples',
    name: 'Vergers Midelt Atlas',
    location: 'Midelt',
    region: 'Drâa-Tafilalet',
    accent: '#7ea35f',
    farmerUsername: 'farmer',          // ← linked to the `farmer` auth account
    farmer: {
      name: 'Youssef Atlas',
      username: 'farmer',
      bio: 'Third-generation orchardist in the Atlas mountains. Sustainable, pesticide-free growing since 1998.',
      joinedYear: 2022,
      rating: 4.9,
      reviews: 34,
    },
    coordinates: { lat: 32.7044, lng: -4.7421 },
    position:    { x: 58, y: 48 },    // for the SVG map
    description: 'Nestled in the Atlas mountains at 1500 m altitude, Vergers Midelt Atlas produces crisp, naturally sweet fruit year-round. Our cold nights and warm days create the ideal microclimate for flavourful apples, pears, and walnuts.',
    certifications: ['Organic', 'GAP Certified'],
    products: [
      { id: 'midelt-apples',        name: 'Atlas Apples',       price: '11 DH', unit: 'kg',   accent: '#c8b45a', stock: 320, category: 'Fruits' },
      { id: 'midelt-golden-apples', name: 'Golden Apples',      price: '13 DH', unit: 'kg',   accent: '#dfc55c', stock: 180, category: 'Fruits' },
      { id: 'midelt-pears',         name: 'Atlas Pears',        price: '14 DH', unit: 'kg',   accent: '#a8c87e', stock: 140, category: 'Fruits' },
      { id: 'midelt-walnuts',       name: 'Mountain Walnuts',   price: '45 DH', unit: 'kg',   accent: '#a87c50', stock: 90,  category: 'Nuts'   },
      { id: 'midelt-honey',         name: 'Atlas Blossom Honey',price: '80 DH', unit: 'jar',  accent: '#d4a843', stock: 60,  category: 'Others' },
    ],
  },

  // ── Other farms ─────────────────────────────────────────────────────────────
  {
    id: 'farm-tangier',
    name: 'Rif Orchard',
    location: 'Tangier',
    accent: '#6f9c6b',
    coordinates: { lat: 35.7595, lng: -5.8340 },
    position: { x: 30, y: 22 },
    farmerUsername: null,
    products: [
      { name: 'Citrus',  price: '7 DH',  unit: 'kg' },
      { name: 'Olives',  price: '14 DH', unit: 'kg' },
    ],
  },
  {
    id: 'farm-rabat',
    name: 'Bouregreg Fields',
    location: 'Rabat',
    accent: '#8caf76',
    coordinates: { lat: 34.0209, lng: -6.8416 },
    position: { x: 34, y: 34 },
    farmerUsername: null,
    products: [
      { name: 'Lettuce', price: '8 DH', unit: 'kg'    },
      { name: 'Herbs',   price: '6 DH', unit: 'bunch' },
    ],
  },
  {
    id: 'farm-casablanca',
    name: 'Atlantic Harvest',
    location: 'Casablanca',
    accent: '#7b9d73',
    coordinates: { lat: 33.5731, lng: -7.5898 },
    position: { x: 36, y: 42 },
    farmerUsername: null,
    products: [
      { name: 'Tomatoes', price: '15 DH', unit: 'kg' },
      { name: 'Peppers',  price: '18 DH', unit: 'kg' },
    ],
  },
  {
    id: 'farm-fes',
    name: 'Atlas Gardens',
    location: 'Fes',
    accent: '#9ab37b',
    coordinates: { lat: 34.0181, lng: -5.0078 },
    position: { x: 54, y: 33 },
    farmerUsername: null,
    products: [
      { name: 'Apples',  price: '12 DH', unit: 'kg' },
      { name: 'Carrots', price: '9 DH',  unit: 'kg' },
    ],
  },
  {
    id: 'farm-marrakech',
    name: 'Palm Grove Farm',
    location: 'Marrakech',
    accent: '#7a8f64',
    coordinates: { lat: 31.6295, lng: -7.9811 },
    position: { x: 46, y: 56 },
    farmerUsername: null,
    products: [
      { name: 'Oranges', price: '7 DH',  unit: 'kg' },
      { name: 'Dates',   price: '22 DH', unit: 'kg' },
    ],
  },
  {
    id: 'farm-agadir',
    name: 'Souss Valley',
    location: 'Agadir',
    accent: '#6f8560',
    coordinates: { lat: 30.4278, lng: -9.5981 },
    position: { x: 35, y: 70 },
    farmerUsername: null,
    products: [
      { name: 'Berries',  price: '20 DH', unit: 'kg' },
      { name: 'Avocado',  price: '25 DH', unit: 'kg' },
    ],
  },
  {
    id: 'farm-oujda',
    name: 'Eastern Plateau',
    location: 'Oujda',
    accent: '#97ad6c',
    coordinates: { lat: 34.6814, lng: -1.9086 },
    position: { x: 70, y: 40 },
    farmerUsername: null,
    products: [
      { name: 'Wheat',   price: '6 DH',  unit: 'kg' },
      { name: 'Almonds', price: '28 DH', unit: 'kg' },
    ],
  },
];

export const findFarmById = id => {
  if (!id) return undefined;
  return farms.find(f => f.id === id);
};

/** Returns the farm owned by a given username (or undefined) */
export const findFarmByFarmer = username => {
  if (!username) return undefined;
  return farms.find(f => f.farmerUsername === username);
};